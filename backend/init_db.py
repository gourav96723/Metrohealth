"""
HealthSense AI - Database Initialization & Seed Script
Creates tables and populates a safe demonstration account for evaluation.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone, timedelta
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.assessment import Assessment, SymptomResponse, MovementMeasurement, SafetyScreening
from app.models.appointment import Appointment

def init_database():
    print("Initializing HealthSense AI database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if demo user already exists
        demo_email = "demo@healthsense.ai"
        user = db.query(User).filter(User.email == demo_email).first()

        if not user:
            print("Creating demo user account...")
            user = User(
                email=demo_email,
                hashed_password=hash_password("HealthSense2026!"),
                full_name="Alex Morgan",
                age=28,
                gender="Non-Binary",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Demo user created: {demo_email} (Password: HealthSense2026!)")

            # Seed sample completed assessment
            print("Seeding sample demonstration assessment...")
            sample_assessment = Assessment(
                user_id=user.id,
                status="completed",
                title="Baseline Neck & Shoulder Posture Review",
                primary_concern="stiffness",
                body_area="neck",
                overall_risk_level="self_care",
                summary="Reported mild neck stiffness (3/10 severity). Posture analysis observed balanced shoulder horizontal alignment (2.1° tilt). Safe for gentle educational cervical mobility routines.",
                is_demo=True,
                created_at=datetime.now(timezone.utc) - timedelta(days=2)
            )
            db.add(sample_assessment)
            db.commit()
            db.refresh(sample_assessment)

            # Seed symptom details
            symptom = SymptomResponse(
                assessment_id=sample_assessment.id,
                body_area="neck",
                side="both",
                primary_concern="stiffness",
                duration="weeks",
                severity=3,
                onset="gradual",
                worsened_by="Prolonged desk work and laptop use without breaks",
                improved_by="Warm shower and gentle neck movements",
                user_description="Noticeable stiffness and fatigue at the base of the neck by afternoon."
            )
            db.add(symptom)

            # Seed movement measurements
            movement = MovementMeasurement(
                assessment_id=sample_assessment.id,
                movement_type="standing_neutral",
                shoulder_alignment_deg=2.1,
                hip_alignment_deg=1.4,
                symmetry_score=94.5,
                spine_flexion_deg=1.8,
                head_tilt_deg=3.2,
                confidence_score=0.96,
                observations=[
                    "Shoulder levelness is well balanced (tilt: 2.1°).",
                    "Pelvic alignment is level (tilt: 1.4°).",
                    "Mild forward head posture observed relative to upper torso midline."
                ],
                limitations=[
                    "Captured via frontal 2D webcam perspective.",
                    "Lighting conditions were adequate with high landmark confidence."
                ]
            )
            db.add(movement)

            # Seed safety screening
            safety = SafetyScreening(
                assessment_id=sample_assessment.id,
                is_safe_for_exercise=True,
                red_flags_present=False,
                red_flag_items=[],
                referral_urgency="self_care",
                guidance_message="GENERAL WELLNESS GUIDANCE: Reported discomfort appears mild and typical of common mechanical postural strain. You may explore the gentle educational movement exercises below.",
                emergency_contact_advised=False
            )
            db.add(safety)

            # Seed sample demonstration appointment
            appointment = Appointment(
                user_id=user.id,
                provider_name="Dr. Sarah Jenkins, DPT",
                provider_specialty="Musculoskeletal & Sports Physiotherapy",
                clinic_name="MotionCare Physical Therapy Clinic",
                appointment_time=datetime.now(timezone.utc) + timedelta(days=3, hours=4),
                status="confirmed",
                consultation_type="telehealth",
                reason="Follow-up ergonomics and neck mobility consultation",
                notes="Patient requested advice on ergonomic workstation adjustments.",
                is_demo=True
            )
            db.add(appointment)

            db.commit()
            print("Database seeding completed successfully.")
        else:
            print("Demo user account already present.")

    finally:
        db.close()

if __name__ == "__main__":
    init_database()
