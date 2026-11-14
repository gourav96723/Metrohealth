from fastapi import APIRouter, HTTPException, status
from typing import Any
from ..schemas.cv import PoseAnalysisRequest, PoseAnalysisResponse, LandmarkPoint
from ..services.cv_analyzer import CVAnalyzer

router = APIRouter(prefix="/cv", tags=["Computer Vision & Posture"])

@router.post("/analyze-pose", response_model=PoseAnalysisResponse)
def analyze_pose(request: PoseAnalysisRequest):
    """
    Analyzes normalized landmark coordinates sent from the user's browser webcam stream.
    No raw image or video frames are transmitted or stored, preserving user privacy.
    """
    if len(request.landmarks) < 15:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least 15 key landmark points are required for biomechanical analysis."
        )
    
    return CVAnalyzer.analyze_landmarks(request.landmarks, request.movement_type)


@router.get("/demo-samples")
def get_demo_samples():
    """
    Provides pre-calculated benchmark landmark frames representing realistic posture movements:
    1. Neutral standing posture (slight mild right shoulder elevation)
    2. Bilateral arm raise
    3. Squat knee flexion
    Enables faculty evaluators or users without webcam access to test the pipeline.
    """
    def generate_sample_landmarks(shoulder_tilt_y: float = 0.0, arm_elevated: bool = False, knee_bent: bool = False):
        landmarks = []
        for i in range(33):
            # Base synthetic normalized coordinates
            x, y, z = 0.5, 0.5, 0.0
            
            # Key anatomical offsets
            if i == 0: # Nose
                x, y = 0.50, 0.20
            elif i == 11: # Left Shoulder
                x, y = 0.42, 0.35
            elif i == 12: # Right Shoulder
                x, y = 0.58, 0.35 + shoulder_tilt_y
            elif i == 13: # Left Elbow
                x, y = 0.38, 0.20 if arm_elevated else 0.48
            elif i == 14: # Right Elbow
                x, y = 0.62, 0.20 if arm_elevated else 0.48
            elif i == 15: # Left Wrist
                x, y = 0.36, 0.12 if arm_elevated else 0.60
            elif i == 16: # Right Wrist
                x, y = 0.64, 0.12 if arm_elevated else 0.60
            elif i == 23: # Left Hip
                x, y = 0.44, 0.58
            elif i == 24: # Right Hip
                x, y = 0.56, 0.58
            elif i == 25: # Left Knee
                x, y = 0.43, 0.68 if knee_bent else 0.75
            elif i == 26: # Right Knee
                x, y = 0.57, 0.68 if knee_bent else 0.75
            elif i == 27: # Left Ankle
                x, y = 0.43, 0.90
            elif i == 28: # Right Ankle
                x, y = 0.57, 0.90
            elif i == 7: # Left Ear
                x, y = 0.47, 0.21
            elif i == 8: # Right Ear
                x, y = 0.53, 0.21
                
            landmarks.append({"x": x, "y": y, "z": z, "visibility": 0.98})
        return landmarks

    return {
        "neutral_standing": {
            "title": "Standing Posture Sample",
            "movement_type": "standing_neutral",
            "description": "Upright standing posture demonstrating mild 2.8° right shoulder elevation.",
            "landmarks": generate_sample_landmarks(shoulder_tilt_y=0.015)
        },
        "arm_raise": {
            "title": "Bilateral Arm Elevation Sample",
            "movement_type": "arm_raise",
            "description": "Symmetrical overhead shoulder flexion demonstrating balanced bilateral range of motion.",
            "landmarks": generate_sample_landmarks(arm_elevated=True)
        },
        "squat_movement": {
            "title": "Controlled Squat Depth Sample",
            "movement_type": "squat",
            "description": "Functional lower-body mobility check demonstrating knee flexion.",
            "landmarks": generate_sample_landmarks(knee_bent=True)
        }
    }
