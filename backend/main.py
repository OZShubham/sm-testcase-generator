

# main.py
import os
from google import genai
from google.api_core.exceptions import GoogleAPIError
import vertexai
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Body, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types
from vertexai.preview import rag
from google.cloud import storage, firestore
import requests
from typing import Optional
import pathlib
import re
import json


# Load environment variables from .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Set Google credentials BEFORE importing other modules
credentials_path = os.path.join('backend', 'credentials.json')
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

# Import routers after setting credentials
from backend.api import documents, users, auth

# Initialize clients
os.environ['GOOGLE_GENAI_USE_VERTEXAI'] = 'True'
os.environ['GOOGLE_CLOUD_PROJECT'] = os.getenv("GCP_PROJECT_ID")
os.environ['GOOGLE_CLOUD_LOCATION'] = "us-central1"

# Explicitly initialize genai.Client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION")
)
storage_client = storage.Client()
db = firestore.Client()

try:
    vertexai.init(project=os.getenv("GCP_PROJECT_ID"), location=os.getenv("GOOGLE_CLOUD_LOCATION"))
except Exception as e:
    raise RuntimeError(f"Failed to initialize Vertex AI: {e}")

COMPLIANCE_CORPUS_DISPLAY_NAME = "global-compliance-corpus"
RAG_RETRIEVAL_SERVICE_URL = os.getenv("RAG_RETRIEVAL_SERVICE_URL")
REQUIREMENT_EXTRACTOR_SERVICE_URL = os.getenv("REQUIREMENT_EXTRACTOR_SERVICE_URL")

# Initialize FastAPI
app = FastAPI(title="Healthcare Test Case Generation API", description="API for automating test case generation", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router)
app.include_router(users.router)
app.include_router(auth.router)

def get_processed_filename(original_filename):
    """Convert original filename to processed filename with .md extension"""
    name_without_ext = pathlib.Path(original_filename).stem
    return f"{name_without_ext}.md"

def extract_json_from_text(text: str) -> list:
    """
    Try to extract JSON array from text that might contain other content.
    """
    try:
        # First, try to parse the entire text as JSON
        parsed = json.loads(text.strip())
        if isinstance(parsed, list):
            return parsed
        elif isinstance(parsed, dict):
            return [parsed]
    except json.JSONDecodeError:
        pass
    
    # Try to find JSON array within the text
    json_pattern = r'\[\s*\{.*?\}\s*\]'
    matches = re.findall(json_pattern, text, re.DOTALL)
    
    for match in matches:
        try:
            parsed = json.loads(match)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            continue
    
    # Try to find single JSON object
    json_obj_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    matches = re.findall(json_obj_pattern, text, re.DOTALL)
    
    objects = []
    for match in matches:
        try:
            parsed = json.loads(match)
            if isinstance(parsed, dict) and any(key in parsed for key in ['id', 'title', 'description']):
                objects.append(parsed)
        except json.JSONDecodeError:
            continue
    
    if objects:
        return objects
    
    return []

def parse_generated_test_cases(generated_text: str) -> list[dict]:
    """
    Enhanced parsing function that handles both JSON and markdown formats.
    """
    print("=== PARSING TEST CASES ===")
    print(f"Input length: {len(generated_text)} characters")
    
    # First try to extract JSON
    json_cases = extract_json_from_text(generated_text)
    if json_cases:
        print(f"Found {len(json_cases)} test cases via JSON parsing")
        # Ensure all required fields are present
        processed_cases = []
        for i, case in enumerate(json_cases):
            processed_case = {
                "id": case.get("id", f"TC-{uuid.uuid4().hex[:8].upper()}"),
                "title": case.get("title", f"Test Case {i+1}"),
                "description": case.get("description", "Generated test case"),
                "priority": case.get("priority", "Medium"),
                "status": case.get("status", "Generated"),
                "compliance": case.get("compliance", []),
                "steps": case.get("steps", []),
                "expectedResult": case.get("expectedResult", "System should function as expected"),
                "traceability": case.get("traceability", "Generated from document analysis")
            }
            processed_cases.append(processed_case)
        return processed_cases
    
    # Fallback to markdown parsing
    print("No JSON found, attempting markdown parsing...")
    test_cases = []
    
    # Split by common test case markers
    patterns = [
        r'(?:^|\n)(?:#+\s*)?(?:Test Case|TC)[\s\-:]*(\d+|[A-Z]+\-\d+)?[^\n]*\n',
        r'(?:^|\n)\*\*(?:Test Case|TC)[\s\-:]*(\d+|[A-Z]+\-\d+)?[^\n]*\*\*\n',
        r'(?:^|\n)(\d+\.|\-|\*)\s*(?:Test Case|TC)[\s\-:]*[^\n]*\n'
    ]
    
    sections = []
    for pattern in patterns:
        splits = re.split(pattern, generated_text, flags=re.IGNORECASE | re.MULTILINE)
        if len(splits) > 1:
            sections = splits
            break
    
    if not sections:
        # Try splitting by double newlines as a last resort
        sections = generated_text.split('\n\n')
    
    for i, section in enumerate(sections):
        if not section or not section.strip():
            continue
            
        # Extract various fields using flexible patterns
        tc_id = f"TC-{uuid.uuid4().hex[:8].upper()}"
        
        # Try to extract ID
        id_match = re.search(r'(?:TC|Test Case)[\s\-]*([A-Z0-9\-]+)', section, re.IGNORECASE)
        if id_match:
            tc_id = id_match.group(1)
            if not tc_id.startswith('TC-'):
                tc_id = f"TC-{tc_id}"
        
        # Extract title
        title_patterns = [
            r'(?:Title|Name):\s*(.+?)(?:\n|$)',
            r'\*\*(?:Title|Name)\*\*:?\s*(.+?)(?:\n|$)',
            r'(?:^|\n)(.+?)(?:\n|$)'  # First line as fallback
        ]
        
        title = f"Generated Test Case {i+1}"
        for pattern in title_patterns:
            title_match = re.search(pattern, section, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                break
        
        # Extract description
        desc_patterns = [
            r'(?:Description|Summary):\s*(.+?)(?:\n\n|\n(?:[A-Z][a-z]*:)|\n\*\*|$)',
            r'\*\*(?:Description|Summary)\*\*:?\s*(.+?)(?:\n\n|\n\*\*|$)',
        ]
        
        description = "AI-generated healthcare test case"
        for pattern in desc_patterns:
            desc_match = re.search(pattern, section, re.IGNORECASE | re.DOTALL)
            if desc_match:
                description = desc_match.group(1).strip()
                break
        
        # Extract priority
        priority_match = re.search(r'Priority:\s*(Critical|High|Medium|Low)', section, re.IGNORECASE)
        priority = priority_match.group(1) if priority_match else "Medium"
        
        # Extract compliance standards
        compliance = []
        compliance_match = re.search(r'(?:Compliance|Standards?):\s*(.+?)(?:\n\n|\n[A-Z]|\n\*\*|$)', section, re.IGNORECASE)
        if compliance_match:
            compliance_text = compliance_match.group(1)
            compliance = [std.strip() for std in re.split(r'[,;]', compliance_text) if std.strip()]
        
        # Extract steps
        steps = []
        steps_patterns = [
            r'(?:Steps|Procedure):\s*(.+?)(?:\n\n|\n[A-Z][a-z]*:|\n\*\*|$)',
            r'(?:^\d+\.|^\-|\*)\s*(.+?)(?=\n\d+\.|\n\-|\n\*|\n\n|$)'
        ]
        
        for pattern in steps_patterns:
            steps_matches = re.findall(pattern, section, re.IGNORECASE | re.MULTILINE)
            if steps_matches:
                steps = [step.strip() for step in steps_matches]
                break
        
        if not steps:
            steps = ["Execute the test according to requirements", "Verify expected behavior", "Document results"]
        
        test_case = {
            "id": tc_id,
            "title": title,
            "description": description,
            "priority": priority,
            "status": "Generated",
            "compliance": compliance,
            "steps": steps,
            "expectedResult": "System meets specified healthcare compliance requirements",
            "traceability": "Generated from document analysis and requirements"
        }
        
        test_cases.append(test_case)
    
    # If we still don't have any test cases, create a minimal one
    if not test_cases:
        print("No test cases parsed, creating default case")
        test_cases = [{
            "id": f"TC-{uuid.uuid4().hex[:8].upper()}",
            "title": "Healthcare Compliance Test",
            "description": "Verify system compliance with healthcare standards based on analyzed document",
            "priority": "High",
            "status": "Generated",
            "compliance": ["FDA 21 CFR 820", "ISO 13485"],
            "steps": [
                "Review system implementation against healthcare standards",
                "Execute compliance verification procedures",
                "Document compliance status and any deviations"
            ],
            "expectedResult": "System demonstrates full compliance with applicable healthcare regulations",
            "traceability": "Derived from document analysis"
        }]
    
    print(f"Final parsed test cases: {len(test_cases)}")
    return test_cases

# Enhanced Endpoints for Document Processing and Test Case Generation
@app.get("/documents")
async def get_user_documents(
    user_id: str,
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by overall status")
):
    """Enhanced document listing with better filtering and status calculation"""
    try:
        query = db.collection("document_jobs").where(field_path="user_id", op_string="==", value=user_id)
        query = query.order_by("created_at", direction=firestore.Query.DESCENDING)
        query = query.limit(limit)
        
        results = query.stream()
        
        documents = []
        for doc in results:
            doc_data = doc.to_dict()
            doc_data["id"] = doc.id
            doc_data["document_id"] = doc.id
            doc_data["name"] = doc_data.get("original_filename", "Untitled Document")
            
            docling_status = doc_data.get("docling_status", "Pending")
            indexing_status = doc_data.get("indexing_status", "Pending")
            
            if docling_status == "Failed" or indexing_status == "Failed":
                doc_data["overall_status"] = "Failed"
            elif docling_status == "Completed" and indexing_status == "Completed":
                doc_data["overall_status"] = "Completed"
            else:
                doc_data["overall_status"] = "Processing"
            
            if "processing_duration_seconds" in doc_data:
                doc_data["processing_time"] = f"{doc_data['processing_duration_seconds']:.1f}s"
            
            if "content_length" in doc_data:
                doc_data["content_size"] = f"{doc_data['content_length']:,} chars"
            
            if "file_size_bytes" in doc_data:
                doc_data["file_size"] = format_file_size(doc_data["file_size_bytes"])
            
            if "test_cases" in doc_data and isinstance(doc_data["test_cases"], list):
                doc_data["test_cases"] = doc_data["test_cases"]
            else:
                doc_data["test_cases"] = []

            if not status or doc_data["overall_status"].lower() == status.lower():
                documents.append(doc_data)
            
        return documents
        
    except Exception as e:
        print(f"Enhanced get_user_documents error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/{document_id}/status")
async def get_document_status(document_id: str):
    """Enhanced document status with more detailed information"""
    try:
        doc_ref = db.collection("document_jobs").document(document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        job_data = doc.to_dict()
        job_data["id"] = document_id
        job_data["document_id"] = document_id
        
        docling_status = job_data.get("docling_status", "Pending")
        indexing_status = job_data.get("indexing_status", "Pending")
        
        if docling_status == "Failed" or indexing_status == "Failed":
            job_data["overall_status"] = "Failed"
        elif docling_status == "Completed" and indexing_status == "Completed":
            job_data["overall_status"] = "Completed"
        else:
            job_data["overall_status"] = "Processing"
        
        if docling_status == "Processing":
            job_data["current_step"] = "Converting document to markdown"
        elif docling_status == "Completed" and indexing_status == "Processing":
            job_data["current_step"] = "Indexing document for search"
        elif docling_status == "Completed" and indexing_status == "Completed":
            job_data["current_step"] = "Ready for test case generation"
        else:
            job_data["current_step"] = "Waiting to start processing"
        
        if "processing_duration_seconds" in job_data:
            job_data["processing_time"] = f"{job_data['processing_duration_seconds']:.1f}s"
        
        if "content_length" in job_data:
            job_data["content_size"] = f"{job_data['content_length']:,} chars"
            
        if "file_size_bytes" in job_data:
            job_data["file_size"] = format_file_size(job_data["file_size_bytes"])
        
        return job_data
        
    except Exception as e:
        print(f"Enhanced get_document_status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str, user_id: str):
    """Enhanced document deletion with improved GCS cleanup"""
    try:
        doc_ref = db.collection("document_jobs").document(document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")

        job_data = doc.to_dict()
        
        if job_data.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="User not authorized to delete this document")

        try:
            gcs_uri = job_data.get("gcs_uri")
            if gcs_uri and gcs_uri.startswith("gs://"):
                uri_parts = gcs_uri.replace("gs://", "").split("/", 1)
                if len(uri_parts) == 2:
                    bucket_name, object_name = uri_parts
                    bucket = storage_client.bucket(bucket_name)
                    blob = bucket.blob(object_name)
                    if blob.exists():
                        blob.delete()
                        print(f"Deleted original file: {gcs_uri}")

            processed_gcs_uri = job_data.get("processed_gcs_uri")
            if processed_gcs_uri and processed_gcs_uri.startswith("gs://"):
                uri_parts = processed_gcs_uri.replace("gs://", "").split("/", 1)
                if len(uri_parts) == 2:
                    bucket_name, object_name = uri_parts
                    bucket = storage_client.bucket(bucket_name)
                    blob = bucket.blob(object_name)
                    if blob.exists():
                        blob.delete()
                        print(f"Deleted processed file: {processed_gcs_uri}")
        
        except Exception as gcs_error:
            print(f"GCS cleanup error (non-critical): {gcs_error}")

        user_corpus_display_name = f"user-corpus-{user_id}"
        try:
            corpora = rag.list_corpora(display_name=user_corpus_display_name)
            user_corpus = next((c for c in corpora if c.display_name == user_corpus_display_name), None)

            if user_corpus:
                rag_files = rag.list_files(name=user_corpus.name)
                gcs_uri_to_find = job_data.get("gcs_uri")
                file_to_delete = next((f for f in rag_files if f.gcs_uri == gcs_uri_to_find), None)
                if file_to_delete:
                    rag.delete_file(name=file_to_delete.name)
                    print(f"Deleted {file_to_delete.name} from corpus {user_corpus.name}")
        except Exception as rag_error:
            print(f"RAG cleanup error (non-critical): {rag_error}")

        doc_ref.delete()
        print(f"Deleted document {document_id} from Firestore")

        return {"message": "Document deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Enhanced delete_document error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/documents/{document_id}/generate-test-cases")
async def generate_test_cases(document_id: str, generation_config: dict = Body(...)):
    """Enhanced test case generation with better error handling and parsing."""
    try:
        print(f"=== STARTING TEST CASE GENERATION FOR DOCUMENT {document_id} ===")
        
        # Step 1: Retrieve and validate document status
        doc_ref = db.collection("document_jobs").document(document_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Document not found")

        job_data = doc.to_dict()
        user_id = job_data.get("user_id")
        print(f"User ID: {user_id}")
        
        if (
            job_data.get("docling_status") != "Completed"
            or job_data.get("indexing_status") != "Completed"
        ):
            raise HTTPException(
                status_code=400,
                detail="Document processing or indexing is not complete.",
            )

        # Step 2: Extract generation parameters
        test_types = generation_config.get("testTypes", [])
        priorities = generation_config.get("priorities", [])
        standards = generation_config.get("standards", [])
        
        print(f"Generation config - Types: {test_types}, Priorities: {priorities}, Standards: {standards}")

        # Step 3: Call Requirement Extraction Service
        if not REQUIREMENT_EXTRACTOR_SERVICE_URL:
            raise HTTPException(
                status_code=500,
                detail="REQUIREMENT_EXTRACTOR_SERVICE_URL is not configured.",
            )

        try:
            extraction_payload = {"document_id": document_id, "user_id": user_id}
            print(f"Calling requirement extraction service...")
            extraction_response = requests.post(
                REQUIREMENT_EXTRACTOR_SERVICE_URL, json=extraction_payload, timeout=60
            )
            extraction_response.raise_for_status()
            extracted_data = extraction_response.json()
            extracted_requirements = extracted_data.get("requirements", [])
            print(f"Extracted {len(extracted_requirements)} requirements")
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=500, detail=f"Requirement extraction service error: {str(e)}"
            )

        if not extracted_requirements:
            raise HTTPException(
                status_code=400, detail="No requirements extracted from the document."
            )

        # Step 4: Call custom retrieval service (RAG)
        if not RAG_RETRIEVAL_SERVICE_URL:
            raise HTTPException(
                status_code=500, detail="RAG_RETRIEVAL_SERVICE_URL is not configured."
            )

        requirements_text = "\n".join(
            [f"- {req['id']}: {req['description']}" for req in extracted_requirements]
        )
        retrieval_query_text = (
            f"Generate test cases for the following requirements: {requirements_text} "
            f"focusing on {', '.join(test_types)} with {', '.join(priorities)} "
            f"priority and compliance with {', '.join(standards)}."
        )
        retrieval_payload = {
            "document_id": document_id,
            "query_text": retrieval_query_text,
            "user_id": user_id,
        }

        try:
            print(f"Calling RAG retrieval service...")
            retrieval_response = requests.post(
                RAG_RETRIEVAL_SERVICE_URL, json=retrieval_payload, timeout=60
            )
            retrieval_response.raise_for_status()
            retrieved_data = retrieval_response.json()
            combined_contexts = retrieved_data.get("contexts", [])
            print(f"Retrieved {len(combined_contexts)} context chunks")
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=500, detail=f"RAG retrieval service error: {str(e)}"
            )

        # Step 5: Construct the enhanced prompt with explicit JSON formatting
        prompt_parts = [
            "**Objective:** Generate comprehensive and compliant test cases based on the extracted software requirements.",
            "",
            "**Extracted Requirements:**",
            "---",
            requirements_text,
            "---",
            "",
            "**Retrieved Contexts (from multiple RAG sources):**",
            "---",
            "\n".join(combined_contexts) if combined_contexts else "No additional relevant contexts retrieved.",
            "---",
            "",
            "**Instructions:**",
            "Based on the **Extracted Requirements** and **Retrieved Contexts** above, generate a complete set of test cases.",
        ]
        
        if test_types:
            prompt_parts.append(f"Focus on the following test types: {', '.join(test_types)}.")
        if priorities:
            prompt_parts.append(f"Assign test cases with the following priority levels: {', '.join(priorities)}.")
        if standards:
            prompt_parts.append(f"Ensure compliance with these standards: {', '.join(standards)}.")
            
        prompt_parts.extend([
            "",
            "**CRITICAL: Format your response as a JSON array of objects with the following structure:**",
            "",
            "```json",
            "[",
            "  {",
            '    "id": "TC-001",',
            '    "title": "Descriptive test case title",',
            '    "description": "Detailed description of what this test verifies",',
            '    "priority": "Critical|High|Medium|Low",',
            '    "status": "Generated",',
            '    "compliance": ["FDA 21 CFR 820", "ISO 13485"],',
            '    "steps": [',
            '      "Step 1: First action to perform",',
            '      "Step 2: Second action to perform",',
            '      "Step 3: Third action to perform"',
            '    ],',
            '    "expectedResult": "What should happen when the test passes",',
            '    "traceability": "Reference to source requirements"',
            "  }",
            "]",
            "```",
            "",
            "Generate 3-8 comprehensive test cases that cover all critical aspects of the requirements.",
            "Each test case must be fully compliant with healthcare regulations and standards.",
            "Provide ONLY the JSON array in your response - no additional text or explanations."
        ])

        prompt = "\n".join(prompt_parts)
        print(f"Generated prompt length: {len(prompt)} characters")

        # Step 6: Call the Gemini model
        try:
            print("Calling Gemini API...")
            response = client.models.generate_content(
                model="gemini-2.5-pro",
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,  # Lower temperature for more consistent JSON output
                    safety_settings=[
                        types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                        types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                        types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                        types.SafetySetting(category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH),
                    ]
                )
            )
            generated_text = response.text
            print("=== RAW AI RESPONSE ===")
            print(f"Response length: {len(generated_text)} characters")
            print("First 500 characters:")
            print(generated_text[:500])
            print("=== END RAW RESPONSE ===")
            
        except GoogleAPIError as e:
            print(f"Gemini API error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"AI generation error: {e.message}",
            )
        except Exception as e:
            print(f"Unexpected AI generation error: {e}")
            raise HTTPException(
                status_code=500, detail=f"An unexpected AI generation error occurred: {str(e)}"
            )

        # Step 7: Parse the generated test cases
        print("=== PARSING AI RESPONSE ===")
        parsed_test_cases = parse_generated_test_cases(generated_text)
        
        print("=== PARSED TEST CASES ===")
        print(f"Successfully parsed {len(parsed_test_cases)} test cases")
        for i, tc in enumerate(parsed_test_cases[:2]):  # Show first 2 for debugging
            print(f"Test Case {i+1}:")
            print(f"  ID: {tc.get('id')}")
            print(f"  Title: {tc.get('title')}")
            print(f"  Description: {tc.get('description', '')[:100]}...")
        print("=== END PARSED TEST CASES ===")
        
        # Step 8: Store the generated test cases and return response
        doc_ref.update(
            {
                "test_cases": parsed_test_cases,
                "generated_at": firestore.SERVER_TIMESTAMP,
                "generation_config": generation_config,
            }
        )

        print(f"=== COMPLETED GENERATION - RETURNING {len(parsed_test_cases)} TEST CASES ===")
        
        return {
            "test_cases": parsed_test_cases,
            "requirements_count": len(extracted_requirements),
            "generation_config": generation_config,
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Enhanced generate_test_cases error: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )

def format_file_size(bytes_size):
    """Helper function to format file size in human readable format"""
    if not bytes_size:
        return "Unknown size"
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"

# Root and health check endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "API is running", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

# Custom exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.detail},
    )

# Error handling middleware
@app.middleware("http")
async def error_handling_middleware(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        print(f"Unhandled error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": "Internal server error",
                "details": str(e),
            },
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )