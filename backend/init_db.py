"""
HealthSense AI - Database Initialization & Seed Script
Creates tables and populates a safe demonstration account for evaluation.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timezone, timedelta
from sqlalchemy import text
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.assessment import Assessment, SymptomResponse, MovementMeasurement, SafetyScreening
from app.models.appointment import Appointment

def migrate_columns():
    """Ensure newly added columns exist in SQLite users table."""
    columns_to_add = [
        ("role", "VARCHAR(50) DEFAULT 'patient'"),
        ("specialization", "VARCHAR(255)"),
        ("license_number", "VARCHAR(100)"),
        ("clinic_hospital", "VARCHAR(255)"),
        ("experience_years", "INTEGER")
    ]
    with engine.connect() as conn:
        try:
            res = conn.execute(text("PRAGMA table_info(users)")).fetchall()
            existing_cols = [r[1] for r in res]
            for col_name, col_type in columns_to_add:
                if col_name not in existing_cols:
                    print(f"Adding column '{col_name}' to users table...")
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
            conn.commit()
        except Exception as e:
            print(f"Column migration check: {e}")

def init_database():
    print("Initializing HealthSense AI database tables...")
    Base.metadata.create_all(bind=engine)
    migrate_columns()
    db = SessionLocal()

    try:
        # 1. Seed or update demo therapist/doctor account
        therapist_email = "dr.rajesh@metrohealth.ai"
        therapist = db.query(User).filter(User.email == therapist_email).first()
        if not therapist:
            print("Creating doctor/therapist account...")
            therapist = User(
                email=therapist_email,
                hashed_password=hash_password("Doctor2026!"),
                full_name="Dr. Rajesh Sharma, MS (Ortho)",
                role="therapist",
                specialization="Chief Orthopaedic & Sports Physical Rehabilitation Specialist",
                license_number="MCI-84729-D / DPT-9921",
                clinic_hospital="MetroHealth Super Speciality Hospital, New Delhi",
                experience_years=14,
                phone_number="+91 96537 66889",
                is_active=True
            )
            db.add(therapist)
            db.commit()
            print(f"Therapist created: {therapist_email} (Password: Doctor2026!)")
        else:
            therapist.role = "therapist"
            therapist.specialization = "Chief Orthopaedic & Sports Physical Rehabilitation Specialist"
            therapist.license_number = "MCI-84729-D / DPT-9921"
            therapist.clinic_hospital = "MetroHealth Super Speciality Hospital, New Delhi"
            therapist.experience_years = 14
            db.commit()

        # 2. Check if demo user already exists
        demo_email = "demo@healthsense.ai"
        user = db.query(User).filter(User.email == demo_email).first()

        if not user:
            print("Creating demo patient account...")
            user = User(
                email=demo_email,
                hashed_password=hash_password("HealthSense2026!"),
                full_name="Aarav Sharma",
                age=28,
                gender="Male",
                phone_number="+91 96537 66889",
                role="patient",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Demo patient created: {demo_email} (Password: HealthSense2026!)")

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
                provider_name="Dr. Rajesh Sharma, MS (Ortho)",
                provider_specialty="Senior Orthopaedic & Sports Physiotherapy",
                clinic_name="MetroHealth Super Speciality Hospital, New Delhi",
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
