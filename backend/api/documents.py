import os
import uuid
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from google.cloud import firestore, pubsub_v1
from backend.db.firebase import db
from backend.db.gcs import gcs_bucket
from backend.firebase_auth import get_current_user
import json
import base64
from google.cloud import firestore, pubsub_v1
from backend.db.firebase import db
from backend.db.gcs import gcs_bucket
from backend.firebase_auth import get_current_user
import json
import base64

# Initialize Pub/Sub publisher client
publisher = pubsub_v1.PublisherClient()
RAG_INDEXING_TOPIC_NAME = os.getenv("RAG_INDEXING_TOPIC_NAME", "rag-indexing-queue")
RAG_INDEXING_TOPIC_PATH = publisher.topic_path(os.getenv("GCP_PROJECT_ID","silent-elevator-472108-p9"), RAG_INDEXING_TOPIC_NAME)

router = APIRouter()

@router.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    """
    Handles document upload, creates a job record in Firestore, and places
    the file in GCS, triggering downstream processing.
    """
    user_id = current_user["uid"]
    original_filename = file.filename
    document_uuid = str(uuid.uuid4())
    
    try:
        # GCS path will trigger the docling and rag-indexer functions
        blob_name = f"{user_id}/{document_uuid}/original_{original_filename}"
        
        # Get bucket from environment variable
        bucket_name = os.getenv("GCS_BUCKET_NAME")
        if not bucket_name:
            raise HTTPException(status_code=500, detail="GCS_BUCKET_NAME is not configured.")
        
        # gcs_bucket is the bucket object itself, not a function
        blob = gcs_bucket.blob(blob_name)
        
        content = await file.read()
        blob.upload_from_string(content, content_type=file.content_type)
        
        gcs_uri = f"gs://{bucket_name}/{blob_name}"
        print(f"Uploaded original file to {gcs_uri}")

        # Create the job record in Firestore BEFORE the functions are triggered
        doc_ref = db.collection("document_jobs").document(document_uuid)
        doc_ref.set({
            "user_id": user_id,
            "original_filename": original_filename,
            "gcs_uri": gcs_uri,
            "docling_status": "Pending",
            "indexing_status": "Pending",
            "created_at": firestore.SERVER_TIMESTAMP
        })

        # Publish a message to Pub/Sub to trigger the RAG indexer
        message_data = {
            "user_id": user_id,
            "document_uuid": document_uuid,
            "gcs_uri": gcs_uri
        }
        message_json = json.dumps(message_data)
        message_bytes = message_json.encode("utf-8")

        future = publisher.publish(RAG_INDEXING_TOPIC_PATH, message_bytes)
        message_id = future.result()
        print(f"Published Pub/Sub message for RAG indexing (message_id: {message_id})")

        return {"document_id": document_uuid, "status": "Upload successful, processing started via Pub/Sub."}

    except Exception as e:
        print(f"Error during document upload: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
