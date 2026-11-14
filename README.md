# MetroHealth AI – AI-Powered Hospital Physiotherapy & Posture Assessment Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20CSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe%20Pose-FF6F00.svg?logo=google&logoColor=white)](https://developers.google.com/mediapipe)

**MetroHealth AI** is a modern, enterprise-grade digital health application combining computer-vision posture assessments, voice-guided movement scans, clinical red-flag symptom screening, personalized 3-day physiotherapy regimens, and hospital specialist appointment scheduling.

---

## 🌟 Key Features

1. **Problem-First Assessment Workflow:**
   - Patient first pinpoints exact pain areas (*Neck, Shoulders, Upper Back, Lower Back, Hips, Knees, Ankles*) with left/right/bilateral side specification.
   - Intelligent questionnaire captures duration, severity (VAS 0–10 scale), and aggravating factors.

2. **Webcam AI Biomechanical Scan with Voice Guidance:**
   - Client-side 33-point skeletal landmark detection powered by MediaPipe.
   - Integrated browser **Speech Synthesis Voice Assistant** speaks movement instructions out loud in real time.
   - Calculates area-specific joint kinematics: *Cervical Head Tilt, Shoulder Alignment, Spinal Lateral Flexion, Lumbar-Pelvic Symmetry, and Knee Flexion Depth*.
   - **100% Client-Side Privacy:** No video or image frames are sent to servers; only client-evaluated joint angles are submitted.

3. **Clinical Red-Flag Safety Screening:**
   - Automatic triage engine evaluates emergency symptoms (cardiovascular, FAST stroke indicators, neurological compression, cauda equina).
   - Instantly halts exercise recommendations if dangerous signs are detected and prompts immediate contact with emergency helplines (**100 / 112 / 108**).

4. **Personalized 3-Day Physiotherapy Protocol:**
   - Dynamic exercise recommendations tailored to the patient's selected problem area.
   - Interactive daily completion checkboxes with instant progress tracking stored in the patient's record.

5. **Multi-User Data Isolation & Enterprise Security:**
   - Secure PBKDF2 password hashing and PyJWT token authentication.
   - Strict server-side object ownership (IDOR-protected): patients can only access and modify their own records.
   - Full OWASP-compliant password reset protection.

6. **Hospital Specialist Consultation Scheduling:**
   - In-app booking with physical therapists and orthopedic spine specialists.
   - Automated double-booking conflict detection, rescheduling, and cancellation management.

---

## 📁 Project Structure

```
HealthSense AI/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # REST Endpoints (auth, assessments, appointments, cv, exercises, safety)
│   │   ├── core/             # Config, Database (SQLAlchemy), Security & JWT dependencies
│   │   ├── models/           # User, Assessment, Appointment SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── services/         # CV Analyzer, Safety Engine, Exercise Service
│   │   └── main.py           # FastAPI application entrypoint
│   ├── tests/                # Automated pytest suite
│   ├── init_db.py            # Database schema initialization & demo seed script
│   ├── requirements.txt      # Python dependencies
│   └── healthsense.db        # SQLite database
│
├── frontend/                 # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/       # PostureCanvas (Webcam + Voice), Sidebar, Header, BodyMapSelector, etc.
│   │   ├── context/          # AuthContext (JWT session management)
│   │   ├── pages/            # Dashboard, Login, Register, CameraAssessment, MyExercises, etc.
│   │   ├── services/         # Typed API client
│   │   ├── types/            # TypeScript interfaces & types
│   │   └── App.tsx           # Application router & layout
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Vite configuration with API reverse proxy
│
├── .gitignore                # Production git ignore configuration
├── docker-compose.yml        # Multi-container orchestration
├── Dockerfile.backend        # Docker image for FastAPI
├── Dockerfile.frontend       # Docker image for React/Nginx
├── start_app.bat             # One-click Windows development launcher
└── README.md                 # Complete documentation
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (v18 or higher) and **npm**
- **Python** (v3.10 or higher)
- **Git**

---

### Step 1: Open in VS Code
Open your terminal and navigate to the project directory:
```bash
cd "C:\Users\gourav sharma\Downloads\HealthSense AI"
code .
```
*(Or launch VS Code and click **File > Open Folder...**, then select this directory).*

---

### Step 2: Start the Backend (Terminal 1)

```bash
# Navigate to the backend folder
cd backend

# (Optional) Create & activate a Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

# Initialize / Seed the database (creates tables & initial data)
python init_db.py

# Launch the FastAPI server with live reload
python -m uvicorn app.main:app --port 8000 --reload
```

Backend API will be running at:
- **API Base:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

---

### Step 3: Start the Frontend (Terminal 2)

Open a second terminal in VS Code:
```bash
# Navigate to the frontend folder
cd frontend

# Install npm packages
npm install

# Start the Vite development server
npm run dev
```

Frontend will be running at:
- **Web App:** `http://localhost:5173`

---

### Quick Launch (Windows Users)
You can simply double-click **`start_app.bat`** in the root folder to start both frontend and backend automatically!

---

## 🔒 Default Test Accounts

| Account | Email / Phone | Password | Role |
|---|---|---|---|
| **Patient Account** | `adamcarter32@gmai.com` / `9653766889` | `HealthSense2026!` | Registered Patient |
| **New Patient** | Click **"Register Patient Record"** on the login screen to register your own account |

---

## 📤 How to Push to GitHub

Follow these exact steps in your VS Code terminal to publish this project to GitHub:

### 1. Initialize Git & Create Initial Commit
```bash
# Ensure you are at the project root directory:
cd "C:\Users\gourav sharma\Downloads\HealthSense AI"

# Initialize git repository
git init

# Add all files (sensitive & build files are automatically excluded by .gitignore)
git add .

# Create the initial commit
git commit -m "feat: complete MetroHealth AI physiotherapy and posture assessment platform"

# Set default branch to main
git branch -M main
```

### 2. Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `metrohealth-ai` or `HealthSense-AI`).
3. Keep it **Public** or **Private**.
4. **Do NOT** check *"Initialize with README"* (we already have one).
5. Click **Create repository**.

### 3. Link Remote & Push
Copy the commands from GitHub and run:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

## 🌐 Deployment & Publishing Guide

### Option A: Cloud Deployment (Vercel + Render)
1. **Frontend (Vercel):**
   - Import your GitHub repo into [Vercel](https://vercel.com).
   - Set Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable: `VITE_API_URL=https://your-backend.onrender.com`
2. **Backend (Render):**
   - Create a Web Service on [Render](https://render.com).
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && python init_db.py`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option B: Docker Deployment
Run the complete stack with Docker Compose:
```bash
docker compose up --build -d
```
- Access Frontend: `http://localhost:5173`
- Access Backend API: `http://localhost:8000/docs`

---

## 📞 Hospital Contacts & Safety Helplines
- **MetroHealth Clinic Helpline:** `+91 9653766889`
- **National Emergency Services (India):** `100` (Police) / `112` (Unified Emergency) / `108` (Ambulance)

---

## 📄 License
This project is licensed for healthcare educational, research, and non-commercial development evaluation.
