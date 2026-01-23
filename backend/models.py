from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_teacher = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    classes_owned = relationship("Class", back_populates="teacher", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")


class Class(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    join_code = Column(String(6), unique=True, index=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    teacher = relationship("User", back_populates="classes_owned")
    enrollments = relationship("Enrollment", back_populates="classroom", cascade="all, delete-orphan")
    materials = relationship("StudyMaterial", back_populates="classroom", cascade="all, delete-orphan")
    
    # Unique constraint: Teacher cannot have duplicate class names
    __table_args__ = (
        UniqueConstraint('teacher_id', 'name', name='uq_teacher_class_name'),
    )


class Enrollment(Base):
    __tablename__ = "enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    student = relationship("User", back_populates="enrollments")
    classroom = relationship("Class", back_populates="enrollments")
    
    # Unique constraint: Student cannot join same class twice
    __table_args__ = (
        UniqueConstraint('student_id', 'class_id', name='uq_student_class_enrollment'),
    )


class StudyMaterial(Base):
    __tablename__ = "study_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String, nullable=False)
    file_type = Column(String, nullable=True)  # pdf, doc, ppt, etc.
    file_size = Column(Integer, nullable=True)  # in bytes
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    classroom = relationship("Class", back_populates="materials")
    uploader = relationship("User")
