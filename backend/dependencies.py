from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import get_current_active_user


def get_current_teacher(
    current_user: User = Depends(get_current_active_user)
):
    """Ensure the current user is a teacher"""
    if not current_user.is_teacher:
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Teacher access required")
    return current_user
