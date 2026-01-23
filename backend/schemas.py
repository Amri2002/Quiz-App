from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    is_teacher: bool = False


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_teacher: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Classroom Management Schemas
class ClassCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class ClassUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    is_archived: Optional[bool] = None


class StudentInClass(BaseModel):
    id: int
    username: str
    full_name: Optional[str]
    email: str
    enrolled_at: datetime
    
    class Config:
        from_attributes = True


class ClassResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    join_code: str
    teacher_id: int
    is_archived: bool
    created_at: datetime
    student_count: Optional[int] = None
    
    class Config:
        from_attributes = True


class ClassDetailResponse(ClassResponse):
    students: List[StudentInClass] = []


class JoinClassRequest(BaseModel):
    join_code: str = Field(..., min_length=6, max_length=6)


class EnrollmentResponse(BaseModel):
    id: int
    student_id: int
    class_id: int
    enrolled_at: datetime
    class_name: str
    class_description: Optional[str]
    
    class Config:
        from_attributes = True
