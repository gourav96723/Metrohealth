import {
  AuthResponse,
  User,
  AssessmentRecord,
  SymptomInput,
  MovementInput,
  PoseAnalysisResponse,
  LandmarkPoint,
  ProviderInfo,
  AppointmentRecord,
  ExerciseRecommendation,
  SafetyScreeningData
} from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('healthsense_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const errorJson = await res.json();
      errorDetail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = `${res.status} ${res.statusText}`;
    }
    throw new Error(errorDetail);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // --- AUTH ---
  async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
    role?: 'patient' | 'therapist';
    specialization?: string;
    license_number?: string;
    clinic_hospital?: string;
    experience_years?: number;
    age?: number;
    gender?: string;
    medical_notes?: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<User>(res);
  },

  async updateMe(data: {
    full_name?: string;
    phone_number?: string;
    age?: number;
    gender?: string;
    medical_notes?: string;
  }): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(res);
  },

  async deleteAccount(): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // --- ASSESSMENTS ---
  async createAssessment(payload: {
    title?: string;
    symptom?: SymptomInput;
    movement?: MovementInput;
    is_demo?: boolean;
  }): Promise<AssessmentRecord> {
    const res = await fetch(`${BASE_URL}/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return handleResponse<AssessmentRecord>(res);
  },

  async getAssessments(bodyArea?: string): Promise<AssessmentRecord[]> {
    const url = bodyArea ? `${BASE_URL}/assessments?body_area=${encodeURIComponent(bodyArea)}` : `${BASE_URL}/assessments`;
    const res = await fetch(url, {
      headers: getAuthHeader(),
    });
    return handleResponse<AssessmentRecord[]>(res);
  },

  async getAssessmentById(id: number): Promise<AssessmentRecord> {
    const res = await fetch(`${BASE_URL}/assessments/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<AssessmentRecord>(res);
  },

  async deleteAssessment(id: number): Promise<{ message: string }> {
    const res = await fetch(`${BASE_URL}/assessments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async updateExerciseProgress(
    id: number,
    completedExerciseIds: string[]
  ): Promise<AssessmentRecord> {
    const res = await fetch(`${BASE_URL}/assessments/${id}/exercise-progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({
        completed_ids: completedExerciseIds,
        completed_exercise_ids: completedExerciseIds,
      }),
    });
    return handleResponse<AssessmentRecord>(res);
  },

  // --- COMPUTER VISION ---
  async analyzePose(landmarks: LandmarkPoint[], movementType: string): Promise<PoseAnalysisResponse> {
    const res = await fetch(`${BASE_URL}/cv/analyze-pose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ landmarks, movement_type: movementType }),
    });
    return handleResponse<PoseAnalysisResponse>(res);
  },

  async getDemoSamples(): Promise<Record<string, { title: string; movement_type: string; description: string; landmarks: LandmarkPoint[] }>> {
    const res = await fetch(`${BASE_URL}/cv/demo-samples`);
    return handleResponse(res);
  },

  // --- SAFETY ---
  async quickScreen(payload: {
    body_area: string;
    severity: number;
    duration: string;
    red_flag_symptoms: string[];
    user_description?: string;
  }): Promise<SafetyScreeningData> {
    const res = await fetch(`${BASE_URL}/safety/screen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<SafetyScreeningData>(res);
  },

  async getEmergencyContacts(): Promise<{ emergency_phone: string; advice: string; disclaimer: string }> {
    const res = await fetch(`${BASE_URL}/safety/emergency-contacts`);
    return handleResponse(res);
  },

  // --- EXERCISES ---
  async getExercises(bodyArea?: string, isSafe: boolean = true): Promise<ExerciseRecommendation[]> {
    let url = `${BASE_URL}/exercises?is_safe=${isSafe}`;
    if (bodyArea) {
      url += `&body_area=${encodeURIComponent(bodyArea)}`;
    }
    const res = await fetch(url);
    return handleResponse<ExerciseRecommendation[]>(res);
  },

  // --- APPOINTMENTS ---
  async getProviders(): Promise<ProviderInfo[]> {
    const res = await fetch(`${BASE_URL}/appointments/providers`);
    return handleResponse<ProviderInfo[]>(res);
  },

  async getMyAppointments(): Promise<AppointmentRecord[]> {
    const res = await fetch(`${BASE_URL}/appointments`, {
      headers: getAuthHeader(),
    });
    return handleResponse<AppointmentRecord[]>(res);
  },

  async bookAppointment(data: {
    provider_name: string;
    provider_specialty: string;
    clinic_name: string;
    appointment_time: string;
    consultation_type?: string;
    reason?: string;
    notes?: string;
  }): Promise<AppointmentRecord> {
    const res = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AppointmentRecord>(res);
  },

  async cancelAppointment(id: number): Promise<AppointmentRecord> {
    const res = await fetch(`${BASE_URL}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return handleResponse<AppointmentRecord>(res);
  },

  async rescheduleAppointment(
    id: number,
    newAppointmentTime: string,
    notes?: string
  ): Promise<AppointmentRecord> {
    const res = await fetch(`${BASE_URL}/appointments/${id}/reschedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({
        new_appointment_time: newAppointmentTime,
        notes: notes || undefined,
      }),
    });
    return handleResponse<AppointmentRecord>(res);
  },

  // --- THERAPIST / CLINICAL PORTAL ---
  async getTherapistStats(): Promise<any> {
    const res = await fetch(`${BASE_URL}/therapist/dashboard-stats`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  async getTherapistQueue(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/therapist/opd-queue`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any[]>(res);
  },

  async getTherapistPatients(): Promise<any[]> {
    const res = await fetch(`${BASE_URL}/therapist/patients`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any[]>(res);
  },

  async prescribeRegimen(data: any): Promise<any> {
    const res = await fetch(`${BASE_URL}/therapist/prescribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },
};
