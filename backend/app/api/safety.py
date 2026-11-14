from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ..schemas.assessment import SafetyScreeningSchema
from ..services.safety_engine import SafetyEngine, RED_FLAG_DEFINITIONS
from ..core.config import settings

router = APIRouter(prefix="/safety", tags=["Clinical Safety Screening"])

class QuickScreenRequest(BaseModel):
    body_area: str = "general"
    severity: int = 0
    duration: str = "days"
    red_flag_symptoms: list[str] = []
    user_description: Optional[str] = ""

@router.post("/screen", response_model=SafetyScreeningSchema)
def screen_safety(request: QuickScreenRequest):
    """
    Transparent rule-based safety screening.
    Checks for red flags and provides referral urgency guidance.
    """
    return SafetyEngine.evaluate(
        body_area=request.body_area,
        severity=request.severity,
        duration=request.duration,
        red_flag_symptoms=request.red_flag_symptoms,
        user_description=request.user_description or ""
    )

@router.get("/red-flags")
def get_red_flag_definitions():
    """Lists transparently all clinical warning signs screened by the system."""
    return RED_FLAG_DEFINITIONS

@router.get("/emergency-contacts")
def get_emergency_contacts():
    return {
        "emergency_phone": settings.EMERGENCY_PHONE,
        "advice": "If you or someone around you has chest pain, sudden difficulty speaking or moving, or loss of bowel/bladder control, contact emergency medical services immediately.",
        "disclaimer": "HealthSense AI is an educational guidance tool and cannot replace formal emergency triage."
    }
