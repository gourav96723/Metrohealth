# MetroHealth AI – AI-Powered Hospital Physiotherapy & Posture Assessment Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%206-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/UI-Tailwind%20CSS%203-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MediaPipe](https://img.shields.io/badge/Vision-MediaPipe%20Pose-FF6F00.svg?logo=google&logoColor=white)](https://developers.google.com/mediapipe)
[![Python](https://img.shields.io/badge/Language-Python%203.10%2B-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-SQLite%20%2F%20SQLAlchemy-003B57.svg?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

**MetroHealth AI** ek enterprise-grade digital health application hai jo real-time **AI Computer-Vision Posture Analysis**, **Voice-Guided Movement Scanning**, **Clinical Red-Flag Safety Screening**, **Personalized 3-Day Physiotherapy Regimens**, aur **Hospital Specialist Consultation Scheduling** ko ek smooth healthcare workflow me jodta hai.

---

## 🛠️ Technologies Used & Unka Purpose (Kya Use Kiya & Kyun Kiya)

Is project me use hone wali har ek technology, library aur framework ka exact purpose aur reason neeche explain kiya gaya hai:

### 1. Frontend Technologies (Client-Side)

| Technology / Tool | Version | Kiske Liye Use Kiya (Purpose & Reason) |
|---|---|---|
| **React 18** | `^18.3.1` | **Dynamic SPA UI:** Single Page Application (SPA) banane ke liye. Isse bina page reload huye instant routing, live real-time state updates, aur reusable UI components milte hain. |
| **TypeScript** | `^5.7.3` | **Type-Safety & Bug Prevention:** JavaScript ko strictly typed banane ke liye. Isse clinical data models (angles, joint symmetry, patient records) ke interfaces strictly define hote hain aur compile-time pe hi errors pakad aate hain. |
| **Vite 6** | `^6.1.0` | **Next-Gen Build Tool & Dev Server:** Instant Hot Module Replacement (HMR) aur ultra-fast production bundling ke liye. Isme API reverse proxy configured hai jo local development me CORS issues khatam karta hai. |
| **Tailwind CSS 3** | `^3.4.17` | **Modern Healthcare Dark UI:** Deep medical dark cyan/navy theme (`#060e19`), glassmorphism cards (`backdrop-blur`), neon glow indicators, aur fully responsive layouts banane ke liye. |
| **Google MediaPipe Pose** | `^0.5.1` | **AI Skeletal Landmark Detection:** Browser ke andar webcam video stream se real-time 33 3D skeletal body landmarks (shoulders, spine, hips, knees, ankles) track karta hai. **100% Client-Side Privacy:** Koi bhi video ya picture server par nahi bheji jaati, sirf calculated mathematical angles send hote hain. |
| **HTML5 Canvas API** | Native | **Visual Skeletal Overlay:** Webcam video ke upar real-time joint skeleton lines, glowing posture nodes, aur angular tracking arcs draw karne ke liye. |
| **Web Speech Synthesis API** | Native | **Real-Time Voice Assistant:** Computer vision scan ke dauran patient ko live bolkar instructions deta hai (e.g. *"Stand straight facing camera"*, *"Raise both arms slowly"*, *"Hold position for scan"*). |
| **Lucide React** | `^0.475.0` | **Medical & Hospital Icons:** Crisp vector icons (Stethoscope, Activity, Dumbbell, ShieldCheck, Calendar, etc.) ke liye. |

---

### 2. Backend Technologies (Server-Side)

| Technology / Tool | Version | Kiske Liye Use Kiya (Purpose & Reason) |
|---|---|---|
| **Python** | `3.10+` | **Core Backend Language:** AI algorithms, biomechanical joint trigonometry, aur structured healthcare logic implement karne ke liye sabse reliable language. |
| **FastAPI** | `^0.115.0` | **High-Performance REST API:** Asynchronous Python web framework jo ultra-low latency REST endpoints provide karta hai aur automatic interactive OpenAPI documentation (`/docs`) generate karta hai. |
| **Uvicorn (ASGI)** | `^0.30.0` | **Production Web Server:** Lightning-fast asynchronous server jo FastAPI application ko serve karta hai with auto-reload capabilities. |
| **SQLAlchemy ORM** | `^2.0.0` | **Database Abstraction & ORM:** SQL queries ko Python classes aur objects ke roop me map karta hai. Complex joins, JSON storage (completed exercise IDs), aur transaction integrity maintain karta hai. |
| **SQLite (`healthsense.db`)** | Native | **Relational Database:** Lightweight, zero-configuration relational database jo hospital patient profiles, clinical assessment history, aur appointment records ko securely store karta hai. |
| **Pydantic (v2)** | `^2.0.0` | **Data Validation & Serialization:** Frontend se aane wale har request payload aur database response ko validate karta hai taaki invalid data database me enter na ho sake. |
| **Passlib & PBKDF2** | `^1.7.4` | **Cryptographic Password Hashing:** User passwords ko raw format me save karne ke bajaye industry-standard salt + PBKDF2-SHA256 se irreversibly hash karta hai. |
| **PyJWT (JSON Web Tokens)** | `^2.8.0` | **Stateless Authentication & Session Security:** Secure, digitally signed JWT tokens generate karta hai. User login ke baad authorize hota hai aur token expire hone tak authenticated rehta hai. |
| **Pytest** | `^8.0.0` | **Automated Testing:** Backend REST endpoints, authorization rules, red-flag screening logic, aur clinical exercise recommendations ko automatically test karne ke liye. |

---

### 3. DevOps, Orchestration & Tooling

| Technology / Tool | Kiske Liye Use Kiya (Purpose & Reason) |
|---|---|
| **Docker & Dockerfile** | Backend (Python) aur Frontend (Node/Nginx) ko isolated, reproducible containers me pack karne ke liye. |
| **Docker Compose** | Ek single command (`docker compose up`) se poori stack (backend + frontend + network) ko ek sath start karne ke liye. |
| **Git & GitHub** | Distributed source code management, version control, aur cloud repository backup ke liye. |

---

## 🏛️ Application Modules & Features (Kya-Kya Hai aur Kis Kaam Ka Hai)

### 1. AI Biomechanical Posture Scan (`PostureCanvas.tsx` & `cv_analyzer.py`)
- **Kis Kaam Ka Hai:** Webcam ke samne khade patient ki body posture ko analyze karna.
- **Kya Measure Karta Hai:**
  - **Shoulder Horizontal Tilt:** Dono shoulder landmarks ke beech ka tilt angle (normal: < 2.0°).
  - **Cervical Forward Head Alignment:** Ear aur shoulder midline ke beech forward head angle.
  - **Spinal Lateral Symmetry:** Upper spine aur pelvic midline ke beech balance percentage (0-100%).
  - **Pelvic / Hip Balance:** Left aur right hip joint levelness.
- **Voice Guidance:** In-browser Speech Synthesis engine scan shuru hone se end hone tak patient ko voice prompts bolkar guide karta hai.

### 2. 8-Point Clinical Symptom Assessment (`SymptomAssessmentPage.tsx`)
- **Kis Kaam Ka Hai:** Patient ki physical complaint ka accurate context lena.
- **Kya Record Karta Hai:**
  - Affected body region (*Neck, Shoulder, Upper Back, Lower Back, Hip, Knee, Ankle*).
  - Side specification (*Left, Right, Both*).
  - Duration (*Acute < 48 hrs, Sub-acute 1-4 weeks, Chronic > 1 month*).
  - Visual Analogue Scale (VAS) pain severity (0 to 10).
  - Aggravating factors (*Prolonged sitting, bending, lifting, typing*).

### 3. Clinical Red-Flag Safety Screening Engine (`safety_engine.py`)
- **Kis Kaam Ka Hai:** Dangerous medical emergencies ko filter karke patient ki safety ensure karna.
- **Rules Evaluated:**
  - Cardiac / Chest pain radiating to left arm.
  - FAST stroke symptoms (sudden facial drop, arm weakness, speech difficulty).
  - Neurological compression (progressive numbness, loss of bladder/bowel control, cauda equina).
- **Outcome:** Agar red flag detect hota hai, to exercises block ho jaati hain aur emergency helpline numbers (**100 / 112 / 108**) show hote hain. Agar safe hai, to educational exercises unlock ho jaati hain.

### 4. Personalized 3-Day Physiotherapy Regimen (`MyExercisesPage.tsx` & `exercise_service.py`)
- **Kis Kaam Ka Hai:** Pain area ke basis par safe recovery routine provide karna.
- **Features:**
  - Target area ke anusaar exercises ka 3-Day schedule (Day 1, Day 2, Day 3).
  - Step-by-step instructions, dosage (e.g. *2 sets of 10 reps*), precautions aur stop conditions.
  - Interactive checkboxes: Mark as complete karne par database me progress persist hoti hai (0%, 33%, 67%, 100%).

### 5. Indian Doctor Directory & Consultation Booking (`ConsultantsPage.tsx` & `AppointmentsPage.tsx`)
- **Kis Kaam Ka Hai:** Hospital ke verified orthopedic aur physiotherapy specialists se consult karna.
- **Specialists Available:**
  - **Dr. Rajesh Sharma, MS (Ortho):** Senior Orthopaedic & Sports Physiotherapist, MetroHealth New Delhi (₹999/session).
  - **Dr. Priya Nair, MPT (Neuro-Spine):** Chief Spine Rehabilitation Specialist, MetroHealth Mumbai (₹1,199/session).
  - **Dr. Amitav Ghosh, MBBS, D.Ortho:** Consultant Ergonomics Physician, MetroHealth Bengaluru (₹899/session).
  - **Dr. Ananya Mukherjee, MPT, MIAP:** Joint Mobility Specialist, MetroHealth Jaipur (₹799/session).
- **Features:** Telehealth video call ya in-person hospital visit booking, automated conflict checking, rescheduling, aur past visit tracking (*"Visit Done"* status).

### 6. Multi-Tenant Data Isolation & Security (`deps.py` & `auth.py`)
- **Kis Kaam Ka Hai:** Complete medical privacy maintain karna.
- **Security Protections:**
  - Ek patient dusre patient ke records kabhi nahi dekh sakta (server-side IDOR check).
  - Har database query `current_user.id` se strictly scoped hai.
  - PBKDF2 hashed passwords aur signed JWT tokens.

---

## 📁 Project Architecture & File Hierarchy

```
HealthSense AI/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── api/              # REST Endpoints (auth, assessments, appointments, cv, exercises, safety)
│   │   ├── core/             # Database (SQLAlchemy), Security (PBKDF2/JWT) & Config
│   │   ├── models/           # SQLAlchemy DB Models (User, Assessment, Appointment)
│   │   ├── schemas/          # Pydantic Request/Response Validation Schemas
│   │   ├── services/         # CV Trigonometry, Safety Triage Engine, Exercise Generator
│   │   └── main.py           # FastAPI Application Entrypoint
│   ├── tests/                # Automated pytest suite
│   ├── init_db.py            # Database Seed Script (Indian Doctors & Sample User)
│   ├── requirements.txt      # Python Backend Dependencies
│   └── healthsense.db        # SQLite Database File
│
├── frontend/                 # React 18 + Vite + TypeScript Frontend
│   ├── public/assets/        # High-res 3D biomechanical medical wallpapers & assets
│   ├── src/
│   │   ├── components/       # PostureCanvas (Webcam+Voice), Sidebar, HospitalHeader, ExerciseCard
│   │   ├── context/          # AuthContext (JWT Authentication Session)
│   │   ├── pages/            # LoginPage, DashboardPage, AppointmentsPage, ConsultantsPage, etc.
│   │   ├── services/         # Typed API Client (Fetch with JWT Authorization)
│   │   ├── types/            # TypeScript Interfaces (Assessment, Provider, Appointment)
│   │   ├── App.tsx           # Main Application Router & Layout
│   │   └── index.css         # Tailwind CSS & Custom Keyframe Animations
│   ├── package.json          # Node Dependencies
│   └── vite.config.ts        # Vite Server & Reverse Proxy Configuration
│
├── .gitignore                # Version control exclusions
├── docker-compose.yml        # Docker Multi-Container Configuration
├── Dockerfile.backend        # Backend Docker container spec
├── Dockerfile.frontend       # Frontend Docker container spec
└── README.md                 # Complete Project Documentation
```

---

## ⚡ Quick Start: How to Run in VS Code

### 1. Terminal 1: Backend Run Karein
VS Code me terminal kholkar run karein:
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- **API Base:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Terminal 2: Frontend Run Karein
VS Code me dusra terminal kholkar run karein:
```bash
cd frontend
npm run dev
```
- **Web App:** [http://localhost:5173](http://localhost:5173)

---

## 📞 Hospital Helpline & Emergency Contacts
- **MetroHealth Clinic Helpline:** `+91 9653766889`
- **National Emergency Services (India):** `100` (Police) / `112` (Unified Emergency) / `108` (Medical Ambulance)
