# import os
# import functions_framework
# import json
# from google.cloud import firestore, storage
# # Removed: from vertexai.generative_models import GenerativeModel
# import vertexai
# from google import genai # Import genai

# # Initialize clients
# db = firestore.Client()
# storage_client = storage.Client()

# # Get project and location from environment variables
# GCP_PROJECT_ID = "silent-elevator-472108-p9"
# GOOGLE_CLOUD_LOCATION = "europe-west3"

# # Ensure environment variables are set
# if not GCP_PROJECT_ID or not GOOGLE_CLOUD_LOCATION:
#     raise ValueError("GCP_PROJECT_ID and GOOGLE_CLOUD_LOCATION environment variables must be set for Vertex AI initialization.")

# # Initialize Vertex AI API once per session for RAG operations (if any are added later)
# vertexai.init(project=GCP_PROJECT_ID, location=GOOGLE_CLOUD_LOCATION)

# # Explicitly initialize genai.Client for Vertex AI after vertexai.init
# client = genai.Client(
#     vertexai=True,
#     project=GCP_PROJECT_ID,
#     location=GOOGLE_CLOUD_LOCATION
# )

# @functions_framework.http
# def extract_requirements(request):
#     """
#     HTTP Cloud Function that extracts requirements from a processed markdown document.
#     Expects a JSON payload with 'document_id' and 'user_id'.
#     """
#     if request.method != 'POST':
#         return 'Only POST requests are accepted', 405

#     request_json = request.get_json(silent=True)
#     if not request_json or 'document_id' not in request_json or 'user_id' not in request_json:
#         return 'Missing JSON payload with document_id and user_id', 400

#     document_id = request_json['document_id']
#     user_id = request_json['user_id']

#     try:
#         # No need to call vertexai.init again here, it's done globally

#         # Retrieve user-specific document details to get its GCS URI
#         doc_ref = db.collection("document_jobs").document(document_id)
#         doc_snapshot = doc_ref.get()
#         if not doc_snapshot.exists:
#             return f"Document {document_id} not found in Firestore.", 404
        
#         job_data = doc_snapshot.to_dict()
#         processed_gcs_uri = job_data.get("processed_gcs_uri")

#         if not processed_gcs_uri:
#             return f"Processed GCS URI not found for document {document_id}.", 404

#         # Download processed markdown content
#         bucket_name, blob_name = processed_gcs_uri.replace("gs://", "").split("/", 1)
#         bucket = storage_client.bucket(bucket_name)
#         blob = bucket.blob(blob_name)
#         markdown_content = blob.download_as_text()

#         # Prompt to extract requirements
#         prompt = f"""
#         **Objective:** Extract all individual, discrete software requirements from the following document.

#         **Document Content:**
#         ---
#         {markdown_content}
#         ---

#         **Task:**
#         Read the document carefully and identify each distinct requirement. For each requirement, provide:
#         1.  A unique, concise ID (e.g., REQ-001, REQ-002).
#         2.  A clear and concise description of the requirement.

#         Format the output as a JSON array of objects, where each object has 'id' and 'description' keys.
#         Example:
#         [
#             {{ "id": "REQ-001", "description": "The system shall allow users to log in with a username and password." }},
#             {{ "id": "REQ-002", "description": "The system shall display a dashboard with key performance indicators." }}
#         ]
#         """
        
#         response = client.models.generate_content(
#             model="gemini-2.5-pro", # Specify model directly
#             contents=prompt,
#             config=genai.types.GenerateContentConfig( # Changed to 'config'
#                 temperature=0.2,
#                 response_mime_type="application/json" # Request JSON output
#             ),
#             safety_settings=[
#                 genai.types.SafetySetting(category='HARM_CATEGORY_HARASSMENT', threshold='BLOCK_ONLY_HIGH'),
#                 genai.types.SafetySetting(category='HARM_CATEGORY_HATE_SPEECH', threshold='BLOCK_ONLY_HIGH'),
#                 genai.types.SafetySetting(category='HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold='BLOCK_ONLY_HIGH'),
#                 genai.types.SafetySetting(category='HARM_CATEGORY_DANGEROUS_CONTENT', threshold='BLOCK_ONLY_HIGH'),
#             ]
#         )
        
#         # Parse the JSON response
#         extracted_requirements = json.loads(response.text)

#         # Store extracted requirements in Firestore
#         doc_ref.update({"extracted_requirements": extracted_requirements})

#         return json.dumps({"requirements": extracted_requirements}), 200, {'Content-Type': 'application/json'}

#     except Exception as e:
#         print(f"Error in requirement extraction service: {e}")
#         return f"An unexpected error occurred: {str(e)}", 500



import os
import functions_framework
import json
from google.cloud import firestore, storage
# Removed: from vertexai.generative_models import GenerativeModel, HarmCategory, HarmBlockThreshold # Import Vertex AI classes
import vertexai
from google import genai # Import genai
from google.genai import types # Import types for GenerateContentConfig and SafetySetting

# Initialize clients
db = firestore.Client()
storage_client = storage.Client()

# Get project and location from environment variables
GCP_PROJECT_ID = "silent-elevator-472108-p9"
GOOGLE_CLOUD_LOCATION = "us-central1"

# Ensure environment variables are set
if not GCP_PROJECT_ID or not GOOGLE_CLOUD_LOCATION:
    raise ValueError("GCP_PROJECT_ID and GOOGLE_CLOUD_LOCATION environment variables must be set for Vertex AI initialization.")

# Initialize Vertex AI API once per session
vertexai.init(project=GCP_PROJECT_ID, location=GOOGLE_CLOUD_LOCATION)

@functions_framework.http
def extract_requirements(request):
    """
    HTTP Cloud Function that extracts requirements from a processed markdown document.
    Expects a JSON payload with 'document_id' and 'user_id'.
    """
    if request.method != 'POST':
        return 'Only POST requests are accepted', 405

    request_json = request.get_json(silent=True)
    if not request_json or 'document_id' not in request_json or 'user_id' not in request_json:
        return 'Missing JSON payload with document_id and user_id', 400

    document_id = request_json['document_id']
    user_id = request_json['user_id']

    try:
        # Retrieve user-specific document details to get its GCS URI
        doc_ref = db.collection("document_jobs").document(document_id)
        doc_snapshot = doc_ref.get()
        if not doc_snapshot.exists:
            return f"Document {document_id} not found in Firestore.", 404
        
        job_data = doc_snapshot.to_dict()
        processed_gcs_uri = job_data.get("processed_gcs_uri")

        if not processed_gcs_uri:
            return f"Processed GCS URI not found for document {document_id}.", 404

        # Download processed markdown content
        bucket_name, blob_name = processed_gcs_uri.replace("gs://", "").split("/", 1)
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        markdown_content = blob.download_as_text()

        # Prompt to extract requirements
        prompt = f"""
        **Objective:** Extract all individual, discrete software requirements from the following document.

        **Document Content:**
        ---
        {markdown_content}
        ---

        **Task:**
        Read the document carefully and identify each distinct requirement. For each requirement, provide:
        1.  A unique, concise ID (e.g., REQ-001, REQ-002).
        2.  A clear and concise description of the requirement.

        Format the output as a JSON array of objects, where each object has 'id' and 'description' keys.
        Example:
        [
            {{ "id": "REQ-001", "description": "The system shall allow users to log in with a username and password." }},
            {{ "id": "REQ-002", "description": "The system shall display a dashboard with key performance indicators." }}
        ]
        """
        
        # Call generate_content with the google-genai client
        response = client.models.generate_content(
            model="gemini-2.5-pro",
            contents=prompt,
            config=types.GenerateContentConfig( # Use types.GenerateContentConfig
                temperature=0.2,
                response_mime_type="application/json"
            ),
            safety_settings=[ # Use list of types.SafetySetting
                types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
            ]
        )
        
        # Parse the JSON response
        extracted_requirements = json.loads(response.text)

        # Store extracted requirements in Firestore
        doc_ref.update({"extracted_requirements": extracted_requirements})

        return json.dumps({"requirements": extracted_requirements}), 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Error in requirement extraction service: {e}")
        return f"An unexpected error occurred: {str(e)}", 500
