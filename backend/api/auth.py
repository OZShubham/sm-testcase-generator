from fastapi import APIRouter, Depends
from backend.firebase_auth import get_current_user

router = APIRouter()

@router.post("/api/auth/verify-token")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verify if token is valid and return user data"""
    return {
        "valid": True,
        "user": current_user
    }

@router.post("/api/auth/refresh-token")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh user token (handled by Firebase client SDK)"""
    return {
        "message": "Token refresh should be handled by Firebase client SDK",
        "user": current_user
    }
