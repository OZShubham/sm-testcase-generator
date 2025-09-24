import os
import firebase_admin
from firebase_admin import credentials, firestore

db = None

try:
    if not firebase_admin._apps:
        # For Cloud Run, use Application Default Credentials
        firebase_admin.initialize_app()
    
    # Initialize Firestore
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None