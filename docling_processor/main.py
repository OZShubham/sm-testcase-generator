# CRITICAL: Replace your Cloud Function main.py with this enhanced version
# This fixes the file overwriting issue and race condition

import os
import time
import functions_framework
from google.cloud import storage, firestore
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.datamodel.base_models import InputFormat
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from markitdown import MarkItDown
import pathlib

# Initialize clients
storage_client = storage.Client()
db = firestore.Client()

PROCESSED_GCS_BUCKET_NAME = os.getenv("PROCESSED_GCS_BUCKET_NAME", "docling-processed-store")

def get_processed_filename(original_filename):
    """
    🔥 THIS FIXES THE OVERWRITE ISSUE! 🔥
    Convert original filename to processed filename with .md extension
    Example: document.pdf -> document.md, report.docx -> report.md
    """
    name_without_ext = pathlib.Path(original_filename).stem
    return f"{name_without_ext}.md"

@functions_framework.cloud_event
def docling_process(cloud_event):
    """Enhanced Cloud Function that preserves filenames and handles race conditions"""
    data = cloud_event.data
    bucket_name = data["bucket"]
    file_name = data["name"]

    print(f"Docling Processor: Processing file {file_name}")

    # Validate file structure
    parts = file_name.split('/')
    if len(parts) < 3:
        print(f"Docling Processor: Invalid file structure {file_name}")
        return
        
    filename_part = parts[-1]
    if not filename_part.startswith('original_'):
        print(f"Docling Processor: Skipping non-original file {file_name}")
        return

    user_id = parts[0]
    document_uuid = parts[1]
    original_filename = filename_part.replace("original_", "")

    # 🔥 THE KEY FIX: Generate proper filename based on original
    processed_filename = get_processed_filename(original_filename)
    
    print(f"Docling Processor: {original_filename} -> {processed_filename}")

    # Enhanced Firestore document retrieval with better retry logic
    doc_ref = db.collection("document_jobs").document(document_uuid)
    doc_snapshot = None
    
    # Progressive retry with exponential backoff (fixes race condition)
    max_retries = 15
    base_delay = 1
    
    for attempt in range(max_retries):
        try:
            doc_snapshot = doc_ref.get()
            if doc_snapshot.exists:
                print(f"Docling Processor: Document found on attempt {attempt + 1}")
                break
        except Exception as e:
            print(f"Docling Processor: Error on attempt {attempt + 1}: {e}")
        
        if attempt < max_retries - 1:
            delay = min(base_delay * (2 ** attempt), 30)
            print(f"Docling Processor: Retrying in {delay}s (attempt {attempt + 1}/{max_retries})")
            time.sleep(delay)

    # Fallback: Create document if still not found
    if not doc_snapshot or not doc_snapshot.exists:
        print(f"Docling Processor: Creating fallback document for {document_uuid}")
        try:
            doc_ref.set({
                "user_id": user_id,
                "original_filename": original_filename,
                "gcs_uri": f"gs://{bucket_name}/{file_name}",
                "docling_status": "Processing",
                "indexing_status": "Pending",
                "created_at": firestore.SERVER_TIMESTAMP,
                "created_by": "cloud_function_fallback"
            })
            time.sleep(2)  # Brief wait for consistency
            doc_snapshot = doc_ref.get()
        except Exception as e:
            print(f"Docling Processor: Failed to create fallback: {e}")
            return

    temp_file_path = None
    try:
        # Update processing status
        doc_ref.update({
            "docling_status": "Processing",
            "processing_start_time": firestore.SERVER_TIMESTAMP,
            "processed_filename": processed_filename
        })

        # Download and process file
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        
        temp_dir = "/tmp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_file_path = os.path.join(temp_dir, original_filename)

        # Retry mechanism for GCS blob download (fixes potential eventual consistency issues)
        max_download_retries = 5
        download_base_delay = 2 # seconds
        for attempt in range(max_download_retries):
            try:
                if not blob.exists():
                    raise Exception(f"Source blob {file_name} does not exist yet.")
                blob.download_to_filename(temp_file_path)
                print(f"Docling Processor: Downloaded {os.path.getsize(temp_file_path)} bytes on attempt {attempt + 1}")
                break
            except Exception as e:
                print(f"Docling Processor: Download error on attempt {attempt + 1}: {e}")
                if attempt < max_download_retries - 1:
                    delay = min(download_base_delay * (2 ** attempt), 20) # Max 20 seconds delay
                    print(f"Docling Processor: Retrying download in {delay}s...")
                    time.sleep(delay)
                else:
                    raise Exception(f"Failed to download source blob {file_name} after {max_download_retries} attempts.")

        # Process document
        if original_filename.lower().endswith('.txt'):
            print("Docling Processor: Processing as text file")
            md_converter = MarkItDown()
            result = md_converter.convert(temp_file_path)
            markdown_content = result.text_content if hasattr(result, 'text_content') else str(result)
        else:
            print("Docling Processor: Processing with Docling")
            pipeline_options = PdfPipelineOptions(
                do_table_structure=False,
                do_ocr=False,
            )

            allowed_formats = [
                InputFormat.PDF, InputFormat.DOCX, InputFormat.PPTX,
                InputFormat.XLSX, InputFormat.HTML, InputFormat.IMAGE, InputFormat.MD,
            ]
            
            converter = DocumentConverter(
                allowed_formats=allowed_formats,
                format_options={
                    InputFormat.PDF: PdfFormatOption(
                        pipeline_options=pipeline_options,
                        backend=PyPdfiumDocumentBackend
                    )
                }
            )
            result = converter.convert(temp_file_path)
            markdown_content = result.document.export_to_markdown()

        if not markdown_content or len(markdown_content.strip()) == 0:
            raise Exception("Generated markdown content is empty")

        # 🔥 SAVE WITH PROPER FILENAME (no more overwrites!)
        processed_bucket = storage_client.bucket(PROCESSED_GCS_BUCKET_NAME)
        processed_blob_name = f"{user_id}/{document_uuid}/{processed_filename}"  # Uses original filename!
        processed_blob = processed_bucket.blob(processed_blob_name)
        processed_blob.upload_from_string(markdown_content, content_type="text/markdown")
        
        processed_gcs_uri = f"gs://{PROCESSED_GCS_BUCKET_NAME}/{processed_blob_name}"
        
        print(f"Docling Processor: ✅ Saved as {processed_filename} at {processed_gcs_uri}")

        # Update completion status
        doc_ref.update({
            "docling_status": "Completed",
            "processed_gcs_uri": processed_gcs_uri,
            "processed_filename": processed_filename,
            "processing_end_time": firestore.SERVER_TIMESTAMP,
            "content_length": len(markdown_content)
        })
        
        print(f"Docling Processor: ✅ Successfully processed {original_filename} -> {processed_filename}")

    except Exception as e:
        error_msg = str(e)
        print(f"Docling Processor: ❌ Error: {error_msg}")
        
        try:
            doc_ref.update({
                "docling_status": "Failed", 
                "error": error_msg,
                "processing_end_time": firestore.SERVER_TIMESTAMP
            })
        except Exception as update_error:
            print(f"Docling Processor: Failed to update error status: {update_error}")
            
    finally:
        # Cleanup
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                print(f"Docling Processor: Cleaned up {temp_file_path}")
            except Exception as cleanup_error:
                print(f"Docling Processor: Cleanup error: {cleanup_error}")
