from fastapi import APIRouter, Query
from typing import Optional
from ..schemas.assessment import ExerciseRecommendationSchema
from ..services.exercise_service import ExerciseService

router = APIRouter(prefix="/exercises", tags=["Educational Exercise Library"])

@router.get("", response_model=list[ExerciseRecommendationSchema])
def get_exercises(
    body_area: Optional[str] = Query(None, description="Filter by body region: neck, shoulder, upper_back, lower_back, hip, knee, ankle"),
    is_safe: bool = Query(True, description="Safety flag from clinical screening")
):
    """
    Returns evidence-based educational exercise guides.
    Safety rule: If is_safe is False, no exercises are provided to protect the user.
    """
    return ExerciseService.get_exercises_for_assessment(body_area=body_area, is_safe_for_exercise=is_safe)
