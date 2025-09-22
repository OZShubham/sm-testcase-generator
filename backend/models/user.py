from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    uid: str
    email: EmailStr
    name: str
    
class UserResponse(BaseModel):
    uid: str
    email: str
    name: str
    created_at: datetime
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: Dict[str, Any]
