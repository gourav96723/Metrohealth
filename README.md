# MetroHealth AI – AI-Powered Physiotherapy & Posture Assessment Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20CSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe%20Pose-FF6F00.svg?logo=google&logoColor=white)](https://developers.google.com/mediapipe)

**MetroHealth AI** is an enterprise-grade digital physiotherapy and clinical rehabilitation platform. It combines real-time computer-vision biomechanical posture scans, voice-guided movement assessments, automated clinical red-flag symptom screening, personalized 3-day recovery protocols, and a comprehensive hospital OPD doctor portal.

---

## 🌟 Key Capabilities

- **AI Biomechanical Posture Scan:** Client-side 33-point skeletal landmark tracking via Google MediaPipe. Calculates cervical tilt, shoulder levelness, spinal lateral flexion, and pelvic symmetry in real time with zero video frames sent to servers.
- **Voice-Guided Instructions:** In-browser Speech Synthesis engine delivers real-time voice prompts to guide patients through postural assessments.
- **Clinical Red-Flag Safety Screening:** Intelligent triage engine detects critical cardiovascular, neurological, or spinal warning signs and redirects patients to emergency care when needed.
- **Personalized 3-Day Physiotherapy:** Custom rehabilitation regimens tailored to specific pain regions with interactive daily progress tracking.
- **Doctor & Clinical OPD Station:** Dedicated practitioner portal featuring live OPD queues, EMR records, tele-consultation scheduling, webcam biomechanics assessment, and instant e-prescription authoring.
- **Enterprise Security & Privacy:** PBKDF2 password hashing, JWT stateless authorization, and strict server-side multi-tenant IDOR protection.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS 3, MediaPipe Pose, Lucide Icons |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2 |
| **Database** | SQLite (`healthsense.db`) |
| **Security** | Passlib (PBKDF2-SHA256), PyJWT |

---

## 🚀 Quick Start Guide

### 1. Backend Server (Terminal 1)
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- **API URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend Application (Terminal 2)
```bash
cd frontend
npm run dev
```
- **Web App URL:** [http://localhost:5173](http://localhost:5173)

---

## 👤 Active Hospital Accounts

| Role | Name | Email / Identifier | Password | Hospital |
|---|---|---|---|---|
| **Doctor / Specialist** | Dr. Rajesh Kumar Sharma | `dr.rajesh@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Doctor / Specialist** | Dr. Rashmi Sharma | `dr.rashmi@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Doctor / Specialist** | Dr. Ganpat Yadav | `dr.ganpat@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Hospital Administrator** | Admin Operations Hub | `admin@metrohealth.ai` | `Admin2026!` | MetroHealth Hospital, New Delhi |
| **Patient** | Register Any New Patient | *Via Register Tab* | *Your Password* | MetroHealth Portal |

---

## 📞 Hospital Helpline & Emergency Contacts
- **MetroHealth Clinic Helpline:** `+91 9653766889`
- **National Emergency (India):** `100` (Police) / `112` (Unified Emergency) / `108` (Ambulance)
