"""
Dan Classic Furniture - User Schemas
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


# ============== Auth Schemas ==============

class UserCreate(BaseModel):
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=255)
    address: Optional[str] = None

    @field_validator('email')
    def validate_email(cls, v):
        return v.strip().lower()


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @field_validator('email')
    def validate_email(cls, v):
        return v.strip().lower()


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None


class RefreshToken(BaseModel):
    refresh_token: str


# ============== User Schemas ==============

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    full_name: str
    address: Optional[str] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


class UserInDB(UserResponse):
    password_hash: str


# ============== Admin User Management ==============

class AdminUserCreate(UserCreate):
    role: UserRole = UserRole.CUSTOMER


class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int
    page: int
    pages: int
