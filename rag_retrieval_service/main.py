import os
import functions_framework
import os
import functions_framework
import json
from google.cloud import firestore
from vertexai.preview import rag
import vertexai
from google import genai # Import genai

# Initialize clients
db = firestore.Client()

# Get project and location from environment variables
GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
GOOGLE_CLOUD_LOCATION = os.getenv("GOOGLE_CLOUD_LOCATION")

# Ensure environment variables are set
if not GCP_PROJECT_ID or not GOOGLE_CLOUD_LOCATION:
    raise ValueError("GCP_PROJECT_ID and GOOGLE_CLOUD_LOCATION environment variables must be set for Vertex AI initialization.")

# Initialize Vertex AI API once per session for RAG operations
vertexai.init(project=GCP_PROJECT_ID, location=GOOGLE_CLOUD_LOCATION)

# Explicitly initialize genai.Client for Vertex AI after vertexai.init
client = genai.Client(
    vertexai=True,
    project=GCP_PROJECT_ID,
    location=GOOGLE_CLOUD_LOCATION
)

COMPLIANCE_CORPUS_DISPLAY_NAME = "global-compliance-corpus"

@functions_framework.http
def retrieve_contexts(request):
    """
    HTTP Cloud Function that retrieves contexts from multiple RAG corpora.
    Expects a JSON payload with 'document_id' and 'query_text'.
    """
    if request.method != 'POST':
        return 'Only POST requests are accepted', 405

    request_json = request.get_json(silent=True)
    if not request_json or 'document_id' not in request_json or 'query_text' not in request_json:
        return 'Missing JSON payload with document_id and query_text', 400

    document_id = request_json['document_id']
    query_text = request_json['query_text']
    user_id = request_json.get('user_id') # Assuming user_id is passed for user-specific corpus

    if not user_id:
        return 'Missing user_id in the request payload', 400

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

        # Set up RAG corpora resource names
        user_corpus_display_name = f"user-corpus-{user_id}"
        user_corpus_resource_name = f"projects/{GCP_PROJECT_ID}/locations/{GOOGLE_CLOUD_LOCATION}/ragCorpora/{user_corpus_display_name}"
        compliance_corpus_resource_name = f"projects/{GCP_PROJECT_ID}/locations/{GOOGLE_CLOUD_LOCATION}/ragCorpora/{COMPLIANCE_CORPUS_DISPLAY_NAME}"

        # Perform retrieval from user-specific corpus
        user_contexts = []
        try:
            user_retrieval_response = rag.retrieval_query(
                rag_resources=[
                    rag.RagResource(rag_corpus=user_corpus_resource_name)
                ],
                text=query_text,
                rag_retrieval_config=rag.RagRetrievalConfig(top_k=5) # Retrieve top 5 from user corpus
            )
            if user_retrieval_response and user_retrieval_response.contexts:
                user_contexts = [c.text for c in user_retrieval_response.contexts]
        except Exception as e:
            print(f"Error retrieving from user corpus {user_corpus_resource_name}: {e}")
            # Continue even if one retrieval fails

        # Perform retrieval from compliance corpus
        compliance_contexts = []
        try:
            compliance_retrieval_response = rag.retrieval_query(
                rag_resources=[
                    rag.RagResource(rag_corpus=compliance_corpus_resource_name)
                ],
                text=query_text,
                rag_retrieval_config=rag.RagRetrievalConfig(top_k=3) # Retrieve top 3 from compliance corpus
            )
            if compliance_retrieval_response and compliance_retrieval_response.contexts:
                compliance_contexts = [c.text for c in compliance_retrieval_response.contexts]
        except Exception as e:
            print(f"Error retrieving from compliance corpus {compliance_corpus_resource_name}: {e}")
            # Continue even if one retrieval fails

        # Combine and deduplicate contexts
        combined_contexts = list(set(user_contexts + compliance_contexts))

        return json.dumps({"contexts": combined_contexts}), 200, {'Content-Type': 'application/json'}

    except Exception as e:
        print(f"Error in custom retrieval service: {e}")
        return f"An unexpected error occurred: {str(e)}", 500
