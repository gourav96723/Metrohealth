from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone

from ..core.database import get_db
from ..core.deps import get_current_user
from ..models.user import User
from ..models.assessment import Assessment, SymptomResponse, MovementMeasurement, SafetyScreening
from ..schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    SymptomResponseSchema,
    MovementResponseSchema,
    SafetyScreeningSchema,
    ExerciseRecommendationSchema
)
from ..services.safety_engine import SafetyEngine
from ..services.exercise_service import ExerciseService

router = APIRouter(prefix="/assessments", tags=["Assessments"])

def _build_assessment_response(assessment: Assessment) -> AssessmentResponse:
    symptom_data = None
    if assessment.symptom_response:
        symptom_data = SymptomResponseSchema.model_validate(assessment.symptom_response)

    movements_data = [
        MovementResponseSchema.model_validate(m) for m in assessment.movement_measurements
    ]

    safety_data = None
    if assessment.safety_screening:
        safety_data = SafetyScreeningSchema.model_validate(assessment.safety_screening)

    # Educational exercises determined by safety screening outcome
    is_safe = safety_data.is_safe_for_exercise if safety_data else True
    body_area = assessment.body_area or (symptom_data.body_area if symptom_data else "general")
    exercises = ExerciseService.get_exercises_for_assessment(body_area=body_area, is_safe_for_exercise=is_safe)

    return AssessmentResponse(
        id=assessment.id,
        user_id=assessment.user_id,
        status=assessment.status,
        title=assessment.title,
        primary_concern=assessment.primary_concern,
        body_area=assessment.body_area,
        overall_risk_level=assessment.overall_risk_level,
        summary=assessment.summary,
        completed_exercise_ids=assessment.completed_exercise_ids or [],
        is_demo=assessment.is_demo,
        created_at=assessment.created_at,
        symptom_response=symptom_data,
        movement_measurements=movements_data,
        safety_screening=safety_data,
        educational_exercises=exercises
    )

@router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    data: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates and evaluates a complete assessment:
    1. Evaluates reported symptoms through the transparent SafetyEngine.
    2. Stores any movement posture measurements.
    3. Categorizes overall urgency level and saves to the database.
    """
    body_area = data.symptom.body_area if data.symptom else "general"
    primary_concern = data.symptom.primary_concern if data.symptom else "general_check"
    
    # 1. Run Clinical Safety Screening
    if data.symptom:
        safety_result = SafetyEngine.evaluate(
            body_area=data.symptom.body_area,
            severity=data.symptom.severity,
            duration=data.symptom.duration,
            red_flag_symptoms=data.symptom.red_flag_symptoms,
            user_description=data.symptom.user_description or ""
        )
    else:
        safety_result = SafetyEngine.evaluate(
            body_area="general",
            severity=0,
            duration="today",
            red_flag_symptoms=[]
        )

    # 2. Determine Summary
    summary_parts = []
    if data.symptom:
        summary_parts.append(f"Reported {data.symptom.primary_concern} in {data.symptom.body_area} ({data.symptom.severity}/10 intensity).")
    if data.movement:
        summary_parts.append(f"Movement analysis ({data.movement.movement_type}): symmetry score {data.movement.symmetry_score or 'N/A'}%.")
    summary_parts.append(f"Safety screening status: {safety_result.referral_urgency.replace('_', ' ').title()}.")
    full_summary = " ".join(summary_parts)

    # 3. Create Assessment Record
    assessment = Assessment(
        user_id=current_user.id,
        status="completed",
        title=data.title or f"Assessment - {body_area.replace('_', ' ').title()}",
        primary_concern=primary_concern,
        body_area=body_area,
        overall_risk_level=safety_result.referral_urgency,
        summary=full_summary,
        is_demo=data.is_demo
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 4. Attach Symptom Response
    if data.symptom:
        symptom_record = SymptomResponse(
            assessment_id=assessment.id,
            body_area=data.symptom.body_area,
            side=data.symptom.side,
            primary_concern=data.symptom.primary_concern,
            duration=data.symptom.duration,
            severity=data.symptom.severity,
            onset=data.symptom.onset,
            worsened_by=data.symptom.worsened_by,
            improved_by=data.symptom.improved_by,
            user_description=data.symptom.user_description
        )
        db.add(symptom_record)

    # 5. Attach Movement Measurement
    if data.movement:
        movement_record = MovementMeasurement(
            assessment_id=assessment.id,
            movement_type=data.movement.movement_type,
            shoulder_alignment_deg=data.movement.shoulder_alignment_deg,
            hip_alignment_deg=data.movement.hip_alignment_deg,
            symmetry_score=data.movement.symmetry_score,
            spine_flexion_deg=data.movement.spine_flexion_deg,
            knee_flexion_deg=data.movement.knee_flexion_deg,
            head_tilt_deg=data.movement.head_tilt_deg,
            confidence_score=data.movement.confidence_score,
            observations=data.movement.observations,
            limitations=data.movement.limitations
        )
        db.add(movement_record)

    # 6. Attach Safety Screening
    safety_record = SafetyScreening(
        assessment_id=assessment.id,
        is_safe_for_exercise=safety_result.is_safe_for_exercise,
        red_flags_present=safety_result.red_flags_present,
        red_flag_items=safety_result.red_flag_items,
        referral_urgency=safety_result.referral_urgency,
        guidance_message=safety_result.guidance_message,
        emergency_contact_advised=safety_result.emergency_contact_advised
    )
    db.add(safety_record)

    db.commit()
    db.refresh(assessment)

    return _build_assessment_response(assessment)


@router.get("", response_model=list[AssessmentResponse])
def get_user_assessments(
    body_area: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all past assessments for the authenticated user only."""
    query = db.query(Assessment).filter(Assessment.user_id == current_user.id)
    if body_area:
        query = query.filter(Assessment.body_area == body_area)
    
    assessments = query.order_by(Assessment.created_at.desc()).all()
    return [_build_assessment_response(a) for a in assessments]


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment_by_id(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enforces strict server-side ownership. Users can only view their own records."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found."
        )
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to view this assessment."
        )
    return _build_assessment_response(assessment)


class ExerciseProgressUpdate(BaseModel):
    completed_ids: list[str]

@router.put("/{assessment_id}/exercise-progress", response_model=AssessmentResponse)
def update_exercise_progress(
    assessment_id: int,
    req: ExerciseProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates the patient's completed exercise tasks."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found."
        )
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden."
        )
    
    assessment.completed_exercise_ids = req.completed_ids
    db.commit()
    db.refresh(assessment)
    return _build_assessment_response(assessment)

@router.delete("/{assessment_id}", status_code=status.HTTP_200_OK)
def delete_assessment(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enforces strict server-side ownership. Permanently removes an assessment and all associated data."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment record not found."
        )
    if assessment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to delete this assessment."
        )
    db.delete(assessment)
    db.commit()
    return {"message": f"Assessment #{assessment_id} successfully deleted."}
