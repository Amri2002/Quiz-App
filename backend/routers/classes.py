from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database import get_db
from models import User, Class, Enrollment
from schemas import (
    ClassCreate,
    ClassUpdate,
    ClassResponse,
    ClassDetailResponse,
    JoinClassRequest,
    StudentInClass
)
from auth import get_current_active_user
from dependencies import get_current_teacher
from utils import generate_join_code, normalize_join_code

router = APIRouter(prefix="/api/classes", tags=["classes"])


@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
async def create_class(
    class_data: ClassCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Create a new class (Teacher only).
    Generates a unique 6-character join code automatically.
    REQ-4.2.1.1, REQ-4.2.1.2, REQ-4.2.1.3
    """
    # Check if teacher already has a class with this name (REQ-4.2.1.2)
    existing_class = db.query(Class).filter(
        Class.teacher_id == current_user.id,
        Class.name == class_data.name
    ).first()
    
    if existing_class:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You already have a class named '{class_data.name}'"
        )
    
    # Generate unique join code (REQ-4.2.1.3)
    join_code = generate_join_code(db)
    
    # Create the class
    new_class = Class(
        name=class_data.name,
        description=class_data.description,
        join_code=normalize_join_code(join_code),
        teacher_id=current_user.id
    )
    
    try:
        db.add(new_class)
        db.commit()
        db.refresh(new_class)
        
        # Add student count
        response = ClassResponse.model_validate(new_class)
        response.student_count = 0
        return response
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create class"
        )


@router.get("/my-classes", response_model=List[ClassResponse])
async def get_my_classes(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    include_archived: bool = False
):
    """
    Get all classes for current user.
    - Teachers: Classes they own
    - Students: Classes they're enrolled in
    """
    if current_user.is_teacher:
        # Get classes owned by teacher
        query = db.query(Class).filter(Class.teacher_id == current_user.id)
        
        if not include_archived:
            query = query.filter(Class.is_archived == False)
        
        classes = query.order_by(Class.created_at.desc()).all()
        
        # Add student count to each class
        result = []
        for cls in classes:
            response = ClassResponse.model_validate(cls)
            response.student_count = db.query(Enrollment).filter(
                Enrollment.class_id == cls.id
            ).count()
            result.append(response)
        
        return result
    else:
        # Get classes student is enrolled in
        enrollments = db.query(Enrollment).filter(
            Enrollment.student_id == current_user.id
        ).all()
        
        result = []
        for enrollment in enrollments:
            cls = enrollment.classroom
            if include_archived or not cls.is_archived:
                response = ClassResponse.model_validate(cls)
                response.student_count = db.query(Enrollment).filter(
                    Enrollment.class_id == cls.id
                ).count()
                result.append(response)
        
        return result


@router.get("/{class_id}", response_model=ClassDetailResponse)
async def get_class_details(
    class_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific class.
    Teachers can see all students enrolled.
    Students can only access classes they're enrolled in.
    """
    cls = db.query(Class).filter(Class.id == class_id).first()
    
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    
    # Check access permissions
    if current_user.is_teacher:
        # Teachers can only see their own classes
        if cls.teacher_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to view this class"
            )
    else:
        # Students can only see classes they're enrolled in
        enrollment = db.query(Enrollment).filter(
            Enrollment.student_id == current_user.id,
            Enrollment.class_id == class_id
        ).first()
        
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not enrolled in this class"
            )
    
    # Get enrolled students
    enrollments = db.query(Enrollment).filter(
        Enrollment.class_id == class_id
    ).all()
    
    students = []
    for enrollment in enrollments:
        student_data = StudentInClass(
            id=enrollment.student.id,
            username=enrollment.student.username,
            full_name=enrollment.student.full_name,
            email=enrollment.student.email,
            enrolled_at=enrollment.enrolled_at
        )
        students.append(student_data)
    
    response = ClassResponse.model_validate(cls)
    response.student_count = len(students)
    
    return ClassDetailResponse(
        **response.model_dump(),
        students=students
    )


@router.post("/join", response_model=ClassResponse)
async def join_class(
    join_data: JoinClassRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Join a class using a join code (Students only).
    REQ-4.2.2.1, REQ-4.2.2.2, REQ-4.2.2.4
    """
    # Students only
    if current_user.is_teacher:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Teachers cannot join classes as students"
        )
    
    # Normalize the join code (remove dashes, uppercase)
    normalized_code = normalize_join_code(join_data.join_code)
    
    # Find the class with this join code (case-insensitive)
    cls = db.query(Class).filter(
        Class.join_code == normalized_code
    ).first()
    
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid join code. Please check and try again."
        )
    
    # Check if class is archived
    if cls.is_archived:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This class is archived and no longer accepting new students"
        )
    
    # Check if already enrolled (REQ-4.2.2.2)
    existing_enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.class_id == cls.id
    ).first()
    
    if existing_enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already enrolled in this class"
        )
    
    # Create enrollment (REQ-4.2.2.4 - timestamp automatic)
    enrollment = Enrollment(
        student_id=current_user.id,
        class_id=cls.id
    )
    
    try:
        db.add(enrollment)
        db.commit()
        
        # Return class details
        response = ClassResponse.model_validate(cls)
        response.student_count = db.query(Enrollment).filter(
            Enrollment.class_id == cls.id
        ).count()
        
        return response
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to join class"
        )


@router.delete("/{class_id}/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_student_from_class(
    class_id: int,
    student_id: int,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Remove a student from a class (Teacher only).
    REQ-4.2.2.3
    """
    # Verify class exists and belongs to teacher
    cls = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == current_user.id
    ).first()
    
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found or you don't have permission"
        )
    
    # Find the enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.class_id == class_id,
        Enrollment.student_id == student_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student is not enrolled in this class"
        )
    
    # Delete the enrollment (REQ-4.2.2.3)
    db.delete(enrollment)
    db.commit()
    
    return None


@router.patch("/{class_id}", response_model=ClassResponse)
async def update_class(
    class_id: int,
    class_data: ClassUpdate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Update class details or archive a class (Teacher only).
    REQ-4.2.1.4
    """
    # Verify class exists and belongs to teacher
    cls = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == current_user.id
    ).first()
    
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found or you don't have permission"
        )
    
    # Update fields
    if class_data.name is not None:
        # Check for duplicate name (excluding current class)
        existing = db.query(Class).filter(
            Class.teacher_id == current_user.id,
            Class.name == class_data.name,
            Class.id != class_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"You already have another class named '{class_data.name}'"
            )
        
        cls.name = class_data.name
    
    if class_data.description is not None:
        cls.description = class_data.description
    
    if class_data.is_archived is not None:
        cls.is_archived = class_data.is_archived  # REQ-4.2.1.4
    
    try:
        db.commit()
        db.refresh(cls)
        
        response = ClassResponse.model_validate(cls)
        response.student_count = db.query(Enrollment).filter(
            Enrollment.class_id == cls.id
        ).count()
        
        return response
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update class"
        )


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(
    class_id: int,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db)
):
    """
    Delete a class permanently (Teacher only).
    Note: Consider archiving instead for data preservation.
    """
    # Verify class exists and belongs to teacher
    cls = db.query(Class).filter(
        Class.id == class_id,
        Class.teacher_id == current_user.id
    ).first()
    
    if not cls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found or you don't have permission"
        )
    
    # Delete the class (cascade will delete enrollments)
    db.delete(cls)
    db.commit()
    
    return None
