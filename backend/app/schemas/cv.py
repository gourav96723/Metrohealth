from pydantic import BaseModel, Field
from typing import Optional

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: Optional[float] = 0.0
    visibility: Optional[float] = 1.0

class PoseAnalysisRequest(BaseModel):
    movement_type: str = Field("standing_neutral", description="standing_neutral, arm_raise, squat, neck_mobility")
    landmarks: list[LandmarkPoint] = Field(..., min_length=15, description="MediaPipe normalized 33 landmarks")

class PoseAnalysisResponse(BaseModel):
    is_valid_pose: bool
    movement_type: str
    shoulder_alignment_deg: float
    hip_alignment_deg: float
    symmetry_score: float
    spine_flexion_deg: float
    left_arm_elevation_deg: Optional[float] = None
    right_arm_elevation_deg: Optional[float] = None
    knee_flexion_deg: Optional[float] = None
    confidence_score: float
    observations: list[str]
    limitations: list[str]
    disclaimer: str = "Webcam-based posture estimation is for educational observation only and is not a medical diagnosis."
