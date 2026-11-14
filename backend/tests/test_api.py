import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.services.safety_engine import SafetyEngine
from app.services.cv_analyzer import CVAnalyzer
from app.schemas.cv import LandmarkPoint

# In-memory SQLite for testing
TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_and_teardown_db():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

client = TestClient(app)

# --- 1. HEALTH CHECKS ---
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

# --- 2. AUTHENTICATION & SECURITY ---
def test_user_registration_and_login():
    # Register
    reg_payload = {
        "email": "sarah.patient@example.com",
        "password": "StrongPassword123!",
        "full_name": "Sarah Connor",
        "age": 34,
        "gender": "Female"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == "sarah.patient@example.com"
    token = reg_data["access_token"]

    # Duplicate registration fails
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": "sarah.patient@example.com",
        "password": "StrongPassword123!"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Wrong password fails
    bad_login = client.post("/api/auth/login", json={
        "email": "sarah.patient@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # Protected profile endpoint
    headers = {"Authorization": f"Bearer {token}"}
    profile_res = client.get("/api/auth/me", headers=headers)
    assert profile_res.status_code == 200
    assert profile_res.json()["full_name"] == "Sarah Connor"

# --- 3. SAFETY SCREENING ENGINE ---
def test_safety_screening_red_flags():
    # Emergency: chest pain
    res_chest = SafetyEngine.evaluate(
        body_area="upper_back",
        severity=7,
        duration="today",
        red_flag_symptoms=["chest_pain_shortness_breath"]
    )
    assert not res_chest.is_safe_for_exercise
    assert res_chest.red_flags_present
    assert res_chest.referral_urgency == "emergency"
    assert res_chest.emergency_contact_advised

    # Emergency: Cauda Equina saddle anesthesia
    res_cauda = SafetyEngine.evaluate(
        body_area="lower_back",
        severity=8,
        duration="today",
        red_flag_symptoms=["saddle_anesthesia_incontinence"]
    )
    assert not res_cauda.is_safe_for_exercise
    assert res_cauda.referral_urgency == "emergency"

    # Mild safe posture strain
    res_safe = SafetyEngine.evaluate(
        body_area="neck",
        severity=2,
        duration="days",
        red_flag_symptoms=[]
    )
    assert res_safe.is_safe_for_exercise
    assert not res_safe.red_flags_present
    assert res_safe.referral_urgency == "self_care"

# --- 4. BIOMECHANICAL CV CALCULATIONS ---
def test_cv_analyzer_calculations():
    # Construct 33 points
    landmarks = [LandmarkPoint(x=0.5, y=0.5, z=0.0, visibility=0.95) for _ in range(33)]
    # Set shoulders with 0.05 y-difference (tilt)
    landmarks[11] = LandmarkPoint(x=0.40, y=0.30, z=0.0, visibility=0.95) # Left shoulder
    landmarks[12] = LandmarkPoint(x=0.60, y=0.35, z=0.0, visibility=0.95) # Right shoulder (lower)

    result = CVAnalyzer.analyze_landmarks(landmarks, "standing_neutral")
    assert result.is_valid_pose
    assert result.shoulder_alignment_deg > 5.0
    assert result.symmetry_score < 95.0
    assert len(result.observations) > 0

# --- 5. ASSESSMENT WORKFLOW & USER ISOLATION ---
def test_assessment_ownership_isolation():
    # Create User A
    res_a = client.post("/api/auth/register", json={
        "email": "userA@test.com", "password": "Password123!", "full_name": "User A"
    })
    token_a = res_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Create User B
    res_b = client.post("/api/auth/register", json={
        "email": "userB@test.com", "password": "Password123!", "full_name": "User B"
    })
    token_b = res_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User A creates assessment
    assessment_payload = {
        "title": "Lower Back Assessment",
        "symptom": {
            "body_area": "lower_back",
            "side": "both",
            "primary_concern": "stiffness",
            "duration": "weeks",
            "severity": 4,
            "onset": "gradual",
            "user_description": "Stiff after sitting for long hours"
        },
        "movement": {
            "movement_type": "standing_neutral",
            "shoulder_alignment_deg": 1.5,
            "hip_alignment_deg": 1.2,
            "symmetry_score": 96.0,
            "observations": ["Shoulders level"]
        }
    }
    create_res = client.post("/api/assessments", json=assessment_payload, headers=headers_a)
    assert create_res.status_code == 201
    assessment_id = create_res.json()["id"]

    # User A can view assessment
    view_res = client.get(f"/api/assessments/{assessment_id}", headers=headers_a)
    assert view_res.status_code == 200
    assert view_res.json()["body_area"] == "lower_back"
    # Educational exercises should be included because it's safe
    assert len(view_res.json()["educational_exercises"]) > 0

    # User B CANNOT view User A's assessment (Forbidden)
    unauthorized_res = client.get(f"/api/assessments/{assessment_id}", headers=headers_b)
    assert unauthorized_res.status_code == 403

    # User B CANNOT delete User A's assessment
    unauth_del = client.delete(f"/api/assessments/{assessment_id}", headers=headers_b)
    assert unauth_del.status_code == 403

    # User A CAN delete their own assessment
    auth_del = client.delete(f"/api/assessments/{assessment_id}", headers=headers_a)
    assert auth_del.status_code == 200

    # Verification: assessment is gone
    not_found = client.get(f"/api/assessments/{assessment_id}", headers=headers_a)
    assert not_found.status_code == 404

# --- 6. APPOINTMENT CONFLICT HANDLING ---
def test_appointment_booking_and_conflict():
    res = client.post("/api/auth/register", json={
        "email": "patient.appt@test.com", "password": "Password123!", "full_name": "Booking Patient"
    })
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    appt_time = "2026-11-20T10:00:00Z"
    payload = {
        "provider_name": "Dr. Sarah Jenkins, DPT",
        "provider_specialty": "Musculoskeletal & Sports Physiotherapy",
        "clinic_name": "MotionCare Physical Therapy Clinic",
        "appointment_time": appt_time,
        "consultation_type": "telehealth",
        "reason": "Initial shoulder assessment"
    }

    # 1st booking succeeds
    book_res = client.post("/api/appointments", json=payload, headers=headers)
    assert book_res.status_code == 201
    appt_id = book_res.json()["id"]

    # 2nd booking at the exact same provider and time slot triggers conflict (409)
    conflict_res = client.post("/api/appointments", json=payload, headers=headers)
    assert conflict_res.status_code == 409

    # Cancellation works
    cancel_res = client.put(f"/api/appointments/{appt_id}/cancel", headers=headers)
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "cancelled"
