# 🩺 MetroHealth AI – Enterprise Digital Physiotherapy & Posture Assessment Platform

<div align="center">

![MetroHealth Platform](https://img.shields.io/badge/Platform-MetroHealth%20AI-061222?style=for-the-badge&logo=medscape&logoColor=2DD4BF)
![UI Design](https://img.shields.io/badge/Design-Midnight%20Navy%20%26%20Teal%20Glassmorphism-0B1E33?style=for-the-badge&logo=figma&logoColor=2DD4BF)
![Status](https://img.shields.io/badge/Production-Ready-14B8A6?style=for-the-badge)

<br/>

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20CSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe%20Pose-FF6F00.svg?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Vercel](https://img.shields.io/badge/Frontend%20Host-Vercel-000000.svg?logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Backend%20Host-Render-46E3B7.svg?logo=render&logoColor=black)](https://render.com)

<p align="center">
  <b>A modern, clinical-grade digital health application combining real-time computer-vision biomechanical posture scans, browser voice guidance, clinical red-flag safety screening, personalized 3-day recovery protocols, and a multi-role hospital OPD management suite.</b>
</p>

</div>

---

## 🌌 Platform Overview & Architecture

MetroHealth AI adopts a **100% Client-Side Privacy Architecture**:
- **Zero Video Streaming:** Patient webcam frames are analyzed directly inside the browser using Google MediaPipe Pose models. No raw images or video streams ever touch external servers.
- **Biomechanical Telemetry:** Only client-calculated geometric angle measurements (cervical tilt, shoulder levelness, spinal lateral flexion, lumbar-pelvic symmetry, and knee flexion depth) are transmitted.
- **Strict Role Isolation:** Complete separation between Patients, Specialist Doctors, and Hospital Administrators.

```
                              ┌─────────────────────────────────────────┐
                              │          METROHEALTH FRONTEND           │
                              │        (React 18 + Vite 6 + TS)         │
                              │   Hosted on Vercel Global Edge CDN      │
                              └────────────────────┬────────────────────┘
                                                   │
                  ┌────────────────────────────────┼────────────────────────────────┐
                  │                                │                                │
                  ▼                                ▼                                ▼
      🧑‍🦱 PATIENT PORTAL              👨‍⚕️ DOCTOR CLINICAL OPD          🏥 HOSPITAL ADMIN PORTAL
   • 60s Webcam AI Posture Scan      • Live OPD Token Queue (Confirmed)  • All Patients Master Registry
   • Voice-Guided Movement Scan      • Patient EMR Dossiers & Angles     • Medical Staff Operations
   • Red-Flag Emergency Triage       • WebRTC Telehealth Video Consult   • Self-Care / Exercise Tracking
   • Personalized 3-Day Exercises    • Digital Prescription Builder      • Hospital System Health
                  │                                │                                │
                  └────────────────────────────────┼────────────────────────────────┘
                                                   │ Encrypted JWT Auth & REST APIs
                                                   ▼
                              ┌─────────────────────────────────────────┐
                              │           FASTAPI BACKEND API           │
                              │       (Python 3.10+ / SQLAlchemy)       │
                              │   Hosted on Render.com Web Service      │
                              └────────────────────┬────────────────────┘
                                                   │
                                                   ▼
                              ┌─────────────────────────────────────────┐
                              │            SQLITE / POSTGRES            │
                              │         Strict Multi-Tenant DB          │
                              └─────────────────────────────────────────┘
```

---

## 🌟 Key Functional Modules

### 1. 🧑‍🦱 Patient Portal & Recovery Suite
- **Problem-First Assessment:** Pinpoint exact anatomical focus areas (*Neck, Shoulders, Upper Back, Lower Back, Hips, Knees, Ankles*) with left/right/bilateral specification.
- **Webcam AI Biomechanical Scan:** 33-point skeletal landmark detection with real-time browser voice guidance. Evaluates symmetry score and angular deviations.
- **Clinical Safety Screening:** Red-flag evaluation halts exercises and alerts national emergency hotlines (**100 / 112 / 108**) if dangerous signs (neurological, spinal, or cardiac) are indicated.
- **Personalized 3-Day Exercises:** Area-targeted therapeutic exercises with interactive daily completion checkoffs and compliance tracking.
- **Specialist Appointment Booking:** Select from MetroHealth Super Speciality Hospital faculty with automated conflict-free scheduling.

### 2. 👨‍⚕️ Doctor & Specialist Clinical Station
- **Strict Doctor-Patient Isolation:** Each doctor only sees appointments booked under their name. If no appointments are scheduled, views render an elegant empty state.
- **Real-Time OPD Queue:** Live patient call buttons, in-clinic statuses, and chief complaint triage.
- **EMR Clinical Dossiers:** In-depth patient history, measured joint kinematics (degrees of tilt and symmetry percentages), and doctor clinical notes.
- **Exercise Prescription Builder:** Select registered patients under care, customize 3-day/7-day/14-day rehabilitation regimens, and issue digitally signed protocols directly to the patient's portal.
- **Telehealth Video Consultations:** Integrated consultation room with live clinical note-taking.

### 3. 🏥 Hospital Administrator Hub
- **Central Patient Registry:** Monitors all registered users, including self-care patients who complete 3-day exercises without booking a physician.
- **Medical Faculty Staffing:** Full directory of active hospital therapists and orthopaedic specialists.
- **System Metrics:** Real-time counts of active consults, registered patients, and clinical safety compliance.

---

## 👥 Active Hospital Accounts (India)

| Role | Specialist Name | Login Email | Password | Hospital / Facility |
|---|---|---|---|---|
| **Senior Orthopaedic Specialist** | Dr. Rajesh Kumar Sharma | `dr.rajesh@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Chief Spine & Posture Specialist** | Dr. Rashmi Sharma | `dr.rashmi@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Consultant Joint Mobility** | Dr. Ganpat Yadav | `dr.ganpat@metrohealth.ai` | `Doctor2026!` | MetroHealth Hospital, New Delhi |
| **Hospital Administrator** | Admin Operations Hub | `admin@metrohealth.ai` | `Admin2026!` | MetroHealth Hospital, New Delhi |
| **Patient** | Register Any New Patient | *Via Register Tab* | *Your Password* | Patient Portal |

---

## 💻 Local Development Setup

### Terminal 1: Backend Server (FastAPI)
```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- **Local API:** `http://127.0.0.1:8000`
- **Interactive OpenAPI Docs:** `http://127.0.0.1:8000/docs`

### Terminal 2: Frontend Client (Vite + React)
```powershell
cd frontend
npm run dev
```
- **Local Web App:** `http://localhost:5173`

---

## 🚀 Step-by-Step Live Deployment Guide

A modern production deployment separates the **Frontend (Static/SPA on Vercel CDN)** from the **Backend (Long-Running Python Web Service on Render or Railway)**.

```
Frontend (Vercel)  ──────> API Requests (https://metrohealth-backend.onrender.com) ──────> Backend (Render)
```

---

### Step 1: Deploy Backend on Render (Free & Fast)

1. Go to [render.com](https://render.com) and sign in with your GitHub account.
2. Click **New +** ➔ **Web Service**.
3. Select your repository: `gourav96723/Metrohealth`.
4. Configure the Web Service settings:
   - **Name:** `metrohealth-backend` (or any name you choose)
   - **Region:** Singapore / Frankfurt / Oregon (any preferred region)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan Type:** `Free`
5. Click **Create Web Service**.
6. Render will build and deploy the backend. Once deployed, note down your live Backend URL:
   ```
   https://metrohealth-backend.onrender.com
   ```
7. Verify it is running by opening `https://metrohealth-backend.onrender.com/docs` in your browser.

---

### Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `gourav96723/Metrohealth`.
4. Configure the Project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click `Edit` and select `frontend` (or keep root, since root `vercel.json` is pre-configured).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables:**
   - Expand the **Environment Variables** section and add:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://metrohealth-backend.onrender.com` *(Use your actual Render backend URL from Step 1)*
6. Click **Deploy**.
7. In ~30 seconds, Vercel will provide your live URL:
   ```
   https://metrohealth-ai.vercel.app
   ```
8. Done! Your app is now fully live with real-time AI posture vision, clinical appointments, and doctor workflows.

---

## 🔒 Security & Privacy

- **Zero Monocular Recording:** Video frames are analyzed in-memory via WebGL / WASM and instantly discarded.
- **OWASP Compliance:** Passwords encrypted using industry-standard PBKDF2-SHA256.
- **IDOR Protection:** Backend validates token identity against accessed records, guaranteeing patient-record privacy.
- **CORS Configured:** Backend accepts requests from any Vercel domain or localhost.

---

## 📞 Hospital Helpdesk & Emergency Helplines

- **MetroHealth Clinic Helpline:** `1800-202-6000` (Toll-Free, 24/7)
- **National Emergency Helpline (India):** `112`
- **Medical Ambulance Services:** `108`
