import os
from google.cloud import storage
from dotenv import load_dotenv

load_dotenv()

storage_client = None
gcs_bucket = None

try:
    storage_client = storage.Client()
    GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME") 
    if not GCS_BUCKET_NAME:
        raise ValueError("GCS_BUCKET_NAME environment variable not set.")
    gcs_bucket = storage_client.bucket(GCS_BUCKET_NAME)
    print("Google Cloud Storage initialized successfully.")
except Exception as e:
    print(f"Google Cloud Storage initialization error: {e}")
    storage_client = None
    gcs_bucket = None
