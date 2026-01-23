from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

from database import get_db
from models import User, Class, StudyMaterial, Enrollment
from schemas import StudyMaterialCreate, StudyMaterialResponse
from auth import get_current_active_user

router = APIRouter(prefix="/api/materials", tags=["materials"])

# Directory for file uploads
UPLOAD_DIR = "uploads/materials"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload/{class_id}", response_model=StudyMaterialResponse)
async def upload_material(
    class_id: int,
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload a study material to a class (teachers only)"""
    # Check if class exists and user is the teacher
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    if class_obj.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the class teacher can upload materials")
    
    # Create unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{class_id}_{timestamp}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create database entry
    material = StudyMaterial(
        class_id=class_id,
        title=title,
        description=description,
        file_url=f"/uploads/materials/{unique_filename}",
        file_type=file_ext.lstrip('.'),
        file_size=file_size,
        uploaded_by=current_user.id
    )
    
    db.add(material)
    db.commit()
    db.refresh(material)
    
    # Add uploader name to response
    response = StudyMaterialResponse.model_validate(material)
    response.uploader_name = current_user.username
    
    return response


@router.get("/class/{class_id}", response_model=List[StudyMaterialResponse])
def get_class_materials(
    class_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all materials for a class (requires enrollment or being the teacher)"""
    # Check if class exists
    class_obj = db.query(Class).filter(Class.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Check if user is teacher or enrolled student
    is_teacher = class_obj.teacher_id == current_user.id
    is_enrolled = db.query(Enrollment).filter(
        Enrollment.class_id == class_id,
        Enrollment.student_id == current_user.id
    ).first() is not None
    
    if not (is_teacher or is_enrolled):
        raise HTTPException(status_code=403, detail="You must be enrolled in this class to view materials")
    
    # Get materials
    materials = db.query(StudyMaterial).filter(
        StudyMaterial.class_id == class_id
    ).order_by(StudyMaterial.created_at.desc()).all()
    
    # Add uploader names
    result = []
    for material in materials:
        material_data = StudyMaterialResponse.model_validate(material)
        uploader = db.query(User).filter(User.id == material.uploaded_by).first()
        material_data.uploader_name = uploader.username if uploader else "Unknown"
        result.append(material_data)
    
    return result


@router.delete("/{material_id}")
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a study material (teacher only)"""
    material = db.query(StudyMaterial).filter(StudyMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    # Check if user is the teacher of the class
    class_obj = db.query(Class).filter(Class.id == material.class_id).first()
    if class_obj.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the class teacher can delete materials")
    
    # Delete file from filesystem
    file_path = os.path.join(".", material.file_url.lstrip('/'))
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete from database
    db.delete(material)
    db.commit()
    
    return {"message": "Material deleted successfully"}
