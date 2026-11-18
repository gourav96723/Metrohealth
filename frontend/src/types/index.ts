export interface User {
  id: number;
  email: string;
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
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SymptomInput {
  body_area: string;
  side: string;
  primary_concern: string;
  duration: string;
  severity: number;
  onset: string;
  worsened_by?: string;
  improved_by?: string;
  user_description?: string;
  red_flag_symptoms: string[];
}

export interface SymptomData extends SymptomInput {
  id: number;
  created_at: string;
}

export interface MovementInput {
  movement_type: string;
  shoulder_alignment_deg?: number;
  hip_alignment_deg?: number;
  symmetry_score?: number;
  spine_flexion_deg?: number;
  knee_flexion_deg?: number;
  head_tilt_deg?: number;
  confidence_score?: number;
  observations: string[];
  limitations: string[];
}

export interface MovementData extends MovementInput {
  id: number;
  created_at: string;
}

export interface SafetyScreeningData {
  is_safe_for_exercise: boolean;
  red_flags_present: boolean;
  red_flag_items: string[];
  referral_urgency: 'emergency' | 'urgent_physician' | 'physiotherapist' | 'self_care';
  guidance_message: string;
  emergency_contact_advised: boolean;
}

export interface ExerciseRecommendation {
  id: string;
  name: string;
  category: string;
  body_area: string;
  purpose: string;
  difficulty: string;
  instructions: string[];
  suggested_dosage: string;
  precautions: string[];
  stop_conditions: string[];
  evidence_note: string;
}

export interface AssessmentRecord {
  id: number;
  user_id: number;
  status: string;
  title: string;
  primary_concern?: string;
  body_area?: string;
  overall_risk_level: string;
  summary?: string;
  is_demo: boolean;
  created_at: string;
  symptom_response?: SymptomData;
  movement_measurements: MovementData[];
  safety_screening?: SafetyScreeningData;
  educational_exercises: ExerciseRecommendation[];
  completed_exercise_ids?: string[];
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseAnalysisResponse {
  is_valid_pose: boolean;
  movement_type: string;
  shoulder_alignment_deg: number;
  hip_alignment_deg: number;
  symmetry_score: number;
  spine_flexion_deg: number;
  left_arm_elevation_deg?: number;
  right_arm_elevation_deg?: number;
  knee_flexion_deg?: number;
  confidence_score: number;
  observations: string[];
  limitations: string[];
  disclaimer: string;
}

export interface ProviderInfo {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  experience_years: number;
  available_days: string[];
  time_slots: string[];
  is_demo: boolean;
}

export interface AppointmentRecord {
  id: number;
  user_id: number;
  provider_name: string;
  provider_specialty: string;
  clinic_name: string;
  appointment_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  consultation_type: string;
  reason?: string;
  notes?: string;
  is_demo: boolean;
  created_at: string;
}
