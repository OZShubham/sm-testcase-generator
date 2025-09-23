from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from db.firebase import db
from datetime import datetime

security = HTTPBearer()

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase ID token"""
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token_data: dict = Depends(verify_firebase_token)):
    """Get current user from token"""
    try:
        uid = token_data['uid']
        
        if db:
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                user_data = user_doc.to_dict()
                return {
                    "uid": uid,
                    "email": user_data.get('email'),
                    "name": user_data.get('name'),
                    "created_at": user_data.get('created_at')
                }
        
        firebase_user = auth.get_user(uid)
        return {
            "uid": uid,
            "email": firebase_user.email,
            "name": firebase_user.display_name or "Unknown",
            "created_at": datetime.now()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
