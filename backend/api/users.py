from fastapi import APIRouter, HTTPException, Depends, status
from firebase_admin import auth
from db.firebase import db
from firebase_auth import get_current_user
from models.user import UserCreate, UserResponse, UserUpdate
from datetime import datetime

router = APIRouter()

@router.post("/api/users", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    """Create a new user profile in Firestore"""
    try:
        firebase_user = auth.get_user(user_data.uid)
        
        if not firebase_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Firebase user not found"
            )
        
        user_doc_data = {
            "uid": user_data.uid,
            "email": user_data.email,
            "name": user_data.name,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        
        if db:
            user_ref = db.collection('users').document(user_data.uid)
            user_ref.set(user_doc_data)
        
        return UserResponse(
            uid=user_data.uid,
            email=user_data.email,
            name=user_data.name,
            created_at=user_doc_data["created_at"]
        )
        
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Firebase user not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.get("/api/users/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse(
        uid=current_user["uid"],
        email=current_user["email"],
        name=current_user["name"],
        created_at=current_user["created_at"]
    )

@router.put("/api/users/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update current user profile"""
    try:
        uid = current_user["uid"]
        
        update_data = {"updated_at": datetime.now()}
        
        if user_update.name is not None:
            update_data["name"] = user_update.name
            
        if user_update.email is not None:
            update_data["email"] = user_update.email
            auth.update_user(uid, email=user_update.email)
        
        if db:
            user_ref = db.collection('users').document(uid)
            user_ref.update(update_data)
        
        updated_user = await get_current_user({"uid": uid})
        
        return UserResponse(
            uid=updated_user["uid"],
            email=updated_user["email"],
            name=updated_user["name"],
            created_at=updated_user["created_at"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user: {str(e)}"
        )

@router.delete("/api/users/me")
async def delete_current_user(current_user: dict = Depends(get_current_user)):
    """Delete current user account"""
    try:
        uid = current_user["uid"]
        
        if db:
            db.collection('users').document(uid).delete()
        
        auth.delete_user(uid)
        
        return {"message": "User account deleted successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting user: {str(e)}"
        )

@router.get("/api/users", response_model=list[UserResponse])
async def list_users(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """List all users (admin endpoint)"""
    try:
        users = []
        
        if db:
            users_ref = db.collection('users').limit(limit)
            docs = users_ref.stream()
            
            for doc in docs:
                user_data = doc.to_dict()
                users.append(UserResponse(
                    uid=user_data["uid"],
                    email=user_data["email"],
                    name=user_data["name"],
                    created_at=user_data["created_at"]
                ))
        
        return users
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}"
        )
