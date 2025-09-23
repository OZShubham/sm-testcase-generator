import os
import firebase_admin
from firebase_admin import credentials, firestore

db = None

try:
    if not firebase_admin._apps:
        # For development, you can use a service account key file
        # Correctly locate credentials.json from the backend directory
        dir_path = os.path.dirname(os.path.realpath(__file__))
        # cred = credentials.Certificate(os.path.join(dir_path, "..", "credentials.json"))
        # firebase_admin.initialize_app(cred)
        firebase_admin.initialize_app()
    
    
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"Firebase initialization error: {e}")
    # For demo purposes, we'll continue without Firebase
    db = None
