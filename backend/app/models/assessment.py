from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from ..core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="completed")  # completed, in_progress, archived
    title = Column(String(255), default="Posture & Movement Assessment")
    primary_concern = Column(String(100), nullable=True)
    body_area = Column(String(100), nullable=True)
    overall_risk_level = Column(String(50), default="low")  # low, moderate, urgent_referral, emergency
    summary = Column(Text, nullable=True)
    completed_exercise_ids = Column(JSON, default=list)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    user = relationship("User", back_populates="assessments")
    symptom_response = relationship("SymptomResponse", back_populates="assessment", uselist=False, cascade="all, delete-orphan")
    movement_measurements = relationship("MovementMeasurement", back_populates="assessment", cascade="all, delete-orphan")
    safety_screening = relationship("SafetyScreening", back_populates="assessment", uselist=False, cascade="all, delete-orphan")


class SymptomResponse(Base):
    __tablename__ = "symptom_responses"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, unique=True)
    body_area = Column(String(100), nullable=False)
    side = Column(String(50), default="not_applicable")  # left, right, both, bilateral, not_applicable
    primary_concern = Column(String(100), nullable=False)  # pain, stiffness, reduced_mobility, weakness, numbness, tingling
    duration = Column(String(100), nullable=False)  # today, days, weeks, months, chronic
    severity = Column(Integer, nullable=False)  # 0 to 10
    onset = Column(String(50), default="gradual")  # sudden, gradual, post_activity
    worsened_by = Column(Text, nullable=True)
    improved_by = Column(Text, nullable=True)
    user_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="symptom_response")


class MovementMeasurement(Base):
    __tablename__ = "movement_measurements"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    movement_type = Column(String(100), nullable=False)  # standing_neutral, arm_raise, squat, neck_mobility
    shoulder_alignment_deg = Column(Float, nullable=True)
    hip_alignment_deg = Column(Float, nullable=True)
    symmetry_score = Column(Float, nullable=True)  # 0-100%
    spine_flexion_deg = Column(Float, nullable=True)
    knee_flexion_deg = Column(Float, nullable=True)
    head_tilt_deg = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)  # average landmark visibility
    observations = Column(JSON, nullable=True)  # list of textual observations
    limitations = Column(JSON, nullable=True)   # camera angle/coverage limitations
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="movement_measurements")


class SafetyScreening(Base):
    __tablename__ = "safety_screenings"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, unique=True)
    is_safe_for_exercise = Column(Boolean, default=True)
    red_flags_present = Column(Boolean, default=False)
    red_flag_items = Column(JSON, default=list)  # list of identified red-flag symptoms
    referral_urgency = Column(String(50), default="self_care")  # emergency, urgent_physician, physiotherapist, self_care
    guidance_message = Column(Text, nullable=False)
    emergency_contact_advised = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    assessment = relationship("Assessment", back_populates="safety_screening")
