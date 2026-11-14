from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

# --- Symptom Schemas ---
class SymptomCreate(BaseModel):
    body_area: str = Field(..., description="e.g. neck, shoulder, lower_back, knee, hip, ankle")
    side: str = Field("not_applicable", description="left, right, both, bilateral, not_applicable")
    primary_concern: str = Field(..., description="pain, stiffness, reduced_mobility, weakness, numbness, tingling")
    duration: str = Field(..., description="today, days, weeks, months, chronic")
    severity: int = Field(..., ge=0, le=10, description="0-10 VAS numerical score")
    onset: str = Field("gradual", description="sudden, gradual, post_activity")
    worsened_by: Optional[str] = None
    improved_by: Optional[str] = None
    user_description: Optional[str] = None
    red_flag_symptoms: list[str] = Field(default_factory=list, description="Checked warning signs")

class SymptomResponseSchema(BaseModel):
    id: int
    body_area: str
    side: str
    primary_concern: str
    duration: str
    severity: int
    onset: str
    worsened_by: Optional[str] = None
    improved_by: Optional[str] = None
    user_description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Movement Schemas ---
class MovementCreate(BaseModel):
    movement_type: str = Field(..., description="standing_neutral, arm_raise, squat, neck_mobility")
    shoulder_alignment_deg: Optional[float] = None
    hip_alignment_deg: Optional[float] = None
    symmetry_score: Optional[float] = Field(None, ge=0.0, le=100.0)
    spine_flexion_deg: Optional[float] = None
    knee_flexion_deg: Optional[float] = None
    head_tilt_deg: Optional[float] = None
    confidence_score: Optional[float] = None
    observations: list[str] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)

class MovementResponseSchema(BaseModel):
    id: int
    movement_type: str
    shoulder_alignment_deg: Optional[float] = None
    hip_alignment_deg: Optional[float] = None
    symmetry_score: Optional[float] = None
    spine_flexion_deg: Optional[float] = None
    knee_flexion_deg: Optional[float] = None
    head_tilt_deg: Optional[float] = None
    confidence_score: Optional[float] = None
    observations: Optional[list[str]] = None
    limitations: Optional[list[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Safety Schemas ---
class SafetyScreeningSchema(BaseModel):
    is_safe_for_exercise: bool
    red_flags_present: bool
    red_flag_items: list[str] = Field(default_factory=list)
    referral_urgency: str  # emergency, urgent_physician, physiotherapist, self_care
    guidance_message: str
    emergency_contact_advised: bool

    class Config:
        from_attributes = True

# --- Exercise Recommendation Schema ---
class ExerciseRecommendationSchema(BaseModel):
    id: str
    name: str
    category: str
    body_area: str
    purpose: str
    difficulty: str
    instructions: list[str]
    suggested_dosage: str
    precautions: list[str]
    stop_conditions: list[str]
    evidence_note: str

# --- Full Assessment Schemas ---
class AssessmentCreate(BaseModel):
    title: Optional[str] = "Posture & Movement Assessment"
    symptom: Optional[SymptomCreate] = None
    movement: Optional[MovementCreate] = None
    is_demo: bool = False

class AssessmentResponse(BaseModel):
    id: int
    user_id: int
    status: str
    title: str
    primary_concern: Optional[str] = None
    body_area: Optional[str] = None
    overall_risk_level: str
    summary: Optional[str] = None
    completed_exercise_ids: list[str] = []
    is_demo: bool
    created_at: datetime
    symptom_response: Optional[SymptomResponseSchema] = None
    movement_measurements: list[MovementResponseSchema] = []
    safety_screening: Optional[SafetyScreeningSchema] = None
    educational_exercises: list[ExerciseRecommendationSchema] = []

    class Config:
        from_attributes = True
