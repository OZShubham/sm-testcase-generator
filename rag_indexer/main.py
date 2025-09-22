
import os
import time
import functions_framework
import vertexai
from vertexai.preview import rag
from google.cloud import firestore, pubsub_v1
from google.api_core import exceptions
import json
import base64


# Initialize clients
db = firestore.Client()


PROJECT_ID = os.getenv("GCP_PROJECT_ID","silent-elevator-472108-p9")
LOCATION = "europe-west3"  # Using a supported region as requested
COMPLIANCE_CORPUS_DISPLAY_NAME = "global-compliance-corpus"


def get_or_create_corpus(corpus_display_name: str):
    """
    Retrieves a corpus if it exists, otherwise creates a new one.
    This function is now more robust and prevents duplicate corpus creation.
    """
    # --- More robustly check for existing corpora ---
    corpora = rag.list_corpora()
    for corpus in corpora:
        if corpus.display_name == corpus_display_name:
            print(f"Found existing corpus: {corpus.name}")
            return corpus

    print(f"Creating new corpus: {corpus_display_name}")
    return rag.create_corpus(display_name=corpus_display_name)


def import_file_to_corpus(gcs_uri: str, corpus_display_name: str):
    """
    Imports a file from GCS into a specified RAG corpus using an LLM parser.
    CORRECTED: Fixed the ImportRagFilesResponse handling
    """
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    corpus = get_or_create_corpus(corpus_display_name)

    # Configure chunking with fixed length
    transformation_config = rag.TransformationConfig(
        chunking_config=rag.ChunkingConfig(
            chunk_size=500,  # Default chunk size
            chunk_overlap=50   # Default chunk overlap
        )
    )

    print(f"Importing {gcs_uri} into corpus {corpus.display_name} ({corpus.name})...")

    # Retry logic for import_files to handle concurrent operations
    for i in range(5): # Retry up to 5 times
        try:
            # CORRECTED: import_files returns a response directly, not an operation
            response = rag.import_files(
                corpus_name=corpus.name,
                paths=[gcs_uri],
                transformation_config=transformation_config,
                max_embedding_requests_per_min=1000, # Optional: Default QPM
            )

            # CORRECTED: Access the response attributes directly (no .result() method)
            print(f"RAG Indexer: Import completed. Imported {response.imported_rag_files_count} files.")

            # Check for skipped files (optional attribute)
            if hasattr(response, 'skipped_rag_files_count'):
                print(f"RAG Indexer: Skipped {response.skipped_rag_files_count} files.")

            # Check for failed files (optional attribute)  
            if hasattr(response, 'failed_rag_files_count') and response.failed_rag_files_count > 0:
                print(f"RAG Indexer: Failed to import {response.failed_rag_files_count} files.")

            print(f"Successfully imported and parsed {gcs_uri} into {corpus_display_name}.")
            return # Exit on success

        except exceptions.FailedPrecondition as e:
            if "There are other operations running on the RagCorpus" in str(e) and i < 4:
                print(f"RAG Indexer: Corpus {corpus.name} is busy. Retrying import in 10 seconds... (Attempt {i+1}/5)")
                time.sleep(10)
            else:
                raise e # Re-raise if it's not a concurrent operation error or max retries reached


@functions_framework.cloud_event
def rag_index(cloud_event):
    """
    Triggered by a Pub/Sub message. This function indexes the
    file into the user-specific RAG corpus.
    The Pub/Sub message is expected to contain 'user_id', 'document_uuid', and 'gcs_uri'.
    """
    # Parse the Pub/Sub message
    if not cloud_event.data or not cloud_event.data.get('message'):
        print("RAG Indexer: No Pub/Sub message data found.")
        return

    pubsub_message = cloud_event.data['message']
    if 'data' not in pubsub_message:
        print("RAG Indexer: Pub/Sub message 'data' field is missing.")
        return

    try:
        message_data = json.loads(base64.b64decode(pubsub_message['data']).decode('utf-8'))
        user_id = message_data['user_id']
        document_uuid = message_data['document_uuid']
        gcs_uri = message_data['gcs_uri']
    except (json.JSONDecodeError, KeyError) as e:
        print(f"RAG Indexer: Error parsing Pub/Sub message: {e}. Message data: {pubsub_message.get('data')}")
        return

    print(f"RAG Indexer: Processing document {document_uuid} for user {user_id} from GCS URI: {gcs_uri}.")

    doc_ref = db.collection("document_jobs").document(document_uuid)

    # With Pub/Sub, the Firestore document should already exist, so we can simplify the retry logic.
    # We'll still do a quick check, but expect it to be there.
    doc_snapshot = doc_ref.get()
    if not doc_snapshot.exists:
        print(f"RAG Indexer: Document {document_uuid} not found in Firestore. This indicates an issue with the Pub/Sub publishing logic. Aborting.")
        return

    try:
        # 1. Update status
        doc_ref.update({"indexing_status": "Indexing"})

        # 2. Define user-specific corpus name
        user_corpus_display_name = f"user-corpus-{user_id}"

        # 3. Index the file into the user-specific corpus
        import_file_to_corpus(gcs_uri, user_corpus_display_name)

        # 4. Update status to "Completed"
        doc_ref.update({"indexing_status": "Completed"})
        print(f"RAG Indexer: Successfully indexed {gcs_uri} for user {user_id}.")

    except Exception as e:
        print(f"RAG Indexer: Error indexing file {gcs_uri}: {e}")
        doc_ref.update({"indexing_status": "Failed", "error": str(e)})
