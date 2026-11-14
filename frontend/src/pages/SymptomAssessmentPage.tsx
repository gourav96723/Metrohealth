import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  Pill,
  History,
  Stethoscope,
  FileText
} from 'lucide-react';
import { SymptomInput, MovementInput, SafetyScreeningData } from '../types';
import { api } from '../services/api';
import { SafetyAlertModal } from '../components/SafetyAlertModal';

interface SymptomAssessmentPageProps {
  movementData: MovementInput | null;
  targetArea: string;
  targetSide: string;
  onNavigate: (page: string, params?: any) => void;
}

export const SymptomAssessmentPage: React.FC<SymptomAssessmentPageProps> = ({
  movementData,
  targetArea,
  targetSide,
  onNavigate,
}) => {
  const [bodyArea] = useState<string>(targetArea || 'neck');
  const [side] = useState<string>(targetSide || 'both');

  // The 8 Clinical Health Questions
  const [duration, setDuration] = useState<string>('weeks'); // Q1
  const [severity, setSeverity] = useState<number>(4); // Q2
  const [timing, setTiming] = useState<string>('sitting'); // Q3: When does pain occur?
  const [onset, setOnset] = useState<string>('gradual'); // Q4: Sudden or gradual?
  const [previousEpisodes, setPreviousEpisodes] = useState<string>('recurring'); // Q5: Had this before?
  const [takingMedication, setTakingMedication] = useState<boolean>(false); // Q6: Taking medication?
  const [medicationDetails, setMedicationDetails] = useState<string>('');
  const [medicalConditions, setMedicalConditions] = useState<string>(''); // Q7: Previous injuries/conditions
  const [consultedDoctor, setConsultedDoctor] = useState<boolean>(false); // Q8: Consulted doctor before?

  // Movement Follow-up Question
  const [movementPainTriggered, setMovementPainTriggered] = useState<boolean>(false);

  // Red Flags
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState<string>('');

  // Workflow State
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Safety Modal State
  const [safetyModalOpen, setSafetyModalOpen] = useState<boolean>(false);
  const [triggeredSafety, setTriggeredSafety] = useState<SafetyScreeningData | null>(null);
  const [savedAssessmentId, setSavedAssessmentId] = useState<number | null>(null);

  const toggleRedFlag = (flagId: string) => {
    if (redFlags.includes(flagId)) {
      setRedFlags(redFlags.filter((f) => f !== flagId));
    } else {
      setRedFlags([...redFlags, flagId]);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    const descriptionCombined = [
      userNotes ? `Patient Notes: ${userNotes}` : '',
      `Timing: ${timing}`,
      `History: ${previousEpisodes}`,
      takingMedication ? `Medication: Yes (${medicationDetails || 'unspecified'})` : 'Medication: None',
      medicalConditions ? `Past Medical/Injuries: ${medicalConditions}` : '',
      consultedDoctor ? 'Previously consulted a doctor: Yes' : 'Previously consulted a doctor: No',
      movementPainTriggered ? 'Movement Scan Observation: Pain/stiffness worsened during active movement test.' : 'Movement Scan Observation: No acute pain increase during movement test.',
    ]
      .filter(Boolean)
      .join(' | ');

    const symptomPayload: SymptomInput = {
      body_area: bodyArea,
      side,
      primary_concern: `${bodyArea.replace('_', ' ').toUpperCase()} Postural Strain & Discomfort`,
      duration,
      severity,
      onset,
      worsened_by: timing === 'sitting' ? 'Prolonged sitting & desk posture' : timing === 'movement' ? 'Active movement & load' : 'Morning stiffness',
      improved_by: 'Rest, postural breaks, and targeted mobility',
      user_description: descriptionCombined,
      red_flag_symptoms: redFlags,
    };

    try {
      const assessment = await api.createAssessment({
        title: `${bodyArea.replace('_', ' ').toUpperCase()} Comprehensive Assessment`,
        symptom: symptomPayload,
        movement: movementData || undefined,
      });

      if (assessment.safety_screening && assessment.safety_screening.red_flags_present) {
        setTriggeredSafety(assessment.safety_screening);
        setSavedAssessmentId(assessment.id);
        setSafetyModalOpen(true);
      } else {
        onNavigate('results', { assessmentId: assessment.id });
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please check inputs and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSafetyModalClose = () => {
    setSafetyModalOpen(false);
    if (savedAssessmentId) {
      onNavigate('results', { assessmentId: savedAssessmentId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Progress Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('assessment')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              Step 2 of 3 • Structured Health Questionnaire
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Assessment for {bodyArea.replace('_', ' ').toUpperCase()}
            </h1>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold capitalize">
          Area: {bodyArea.replace('_', ' ')} ({side})
        </div>
      </div>

      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {submitError}
        </div>
      )}

      {/* Main Questionnaire Cards */}
      <div className="space-y-6">
        {/* Q1 & Q2: Pain Severity & Duration */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. How severe is your discomfort? (0 to 10 Scale)
              </h3>
              <span
                className={`text-sm font-extrabold px-3 py-1 rounded-xl font-mono ${
                  severity <= 3
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : severity <= 6
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {severity} / 10 {severity <= 3 ? '• Mild' : severity <= 6 ? '• Moderate' : '• Severe'}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0 (None)</span>
              <span>3 (Mild Strain)</span>
              <span>6 (Noticeable Pain)</span>
              <span>10 (Severe Pain)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. How long have you been experiencing this problem?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'today', label: 'Today (New)' },
                { id: 'days', label: 'A few days' },
                { id: 'weeks', label: '1 - 4 weeks' },
                { id: 'months', label: 'Over 1 month' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDuration(item.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    duration === item.id
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q3 & Q4: Timing & Onset */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. When does the discomfort occur or worsen?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sitting', label: 'Prolonged sitting' },
                  { id: 'morning', label: 'Morning upon waking' },
                  { id: 'movement', label: 'During movement' },
                  { id: 'evening', label: 'End of day / Night' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTiming(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      timing === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                4. Was it a sudden onset or gradual?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gradual', label: 'Gradual / Postural' },
                  { id: 'sudden', label: 'Sudden onset' },
                  { id: 'post_lifting', label: 'After lifting' },
                  { id: 'post_exercise', label: 'After workout' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOnset(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      onset === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Q5, Q6, Q7, Q8: History, Meds, Consultations */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                5. Have you had this issue before?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'first_time', label: 'First Episode' },
                  { id: 'recurring', label: 'Occasional Flare-up' },
                  { id: 'chronic', label: 'Chronic / Persistent' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreviousEpisodes(item.id)}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition ${
                      previousEpisodes === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                6. Are you taking medication for this?
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setTakingMedication(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    takingMedication
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setTakingMedication(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    !takingMedication
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  No
                </button>
              </div>
              {takingMedication && (
                <input
                  type="text"
                  value={medicationDetails}
                  onChange={(e) => setMedicationDetails(e.target.value)}
                  placeholder="e.g. Ibuprofen 400mg, muscle relaxant..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                7. Previous injuries or medical conditions?
              </label>
              <input
                type="text"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="e.g. Rotator cuff strain in 2022, mild scoliosis..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                8. Have you consulted a doctor about this before?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConsultedDoctor(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    consultedDoctor
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Yes, consulted before
                </button>
                <button
                  type="button"
                  onClick={() => setConsultedDoctor(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                    !consultedDoctor
                      ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  No, first consultation
                </button>
              </div>
            </div>
          </div>

          {/* Follow-up question on active movement assessment */}
          {movementData && (
            <div className="pt-4 border-t border-slate-100 bg-teal-50/50 p-4 rounded-2xl border border-teal-200/60">
              <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider mb-1.5">
                Movement Follow-up: Did you feel increased pain or resistance during the camera scan?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMovementPainTriggered(true)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                    movementPainTriggered ? 'bg-teal-700 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  Yes, movement provoked strain
                </button>
                <button
                  type="button"
                  onClick={() => setMovementPainTriggered(false)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
                    !movementPainTriggered ? 'bg-teal-700 text-white' : 'bg-white border text-slate-700'
                  }`}
                >
                  No, movement felt comfortable
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Safety Red Flags Screening */}
        <div className="bg-rose-50/70 rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
              Safety Red-Flag Screening (Clinical Safeguard)
            </h3>
          </div>
          <p className="text-xs text-rose-800 leading-relaxed">
            Check any of the following if experienced. If marked, active exercises are paused and immediate medical guidance is advised.
          </p>

          <div className="space-y-2 pt-1">
            {[
              { id: 'chest_pain_shortness_breath', label: 'Chest tightness, shortness of breath, or radiating left arm/jaw pain' },
              { id: 'stroke_fast_signs', label: 'Sudden facial droop, speech difficulty, or arm/leg weakness (FAST signs)' },
              { id: 'saddle_anesthesia_incontinence', label: 'Numbness around groin/buttocks or sudden loss of bowel/bladder control' },
              { id: 'major_trauma', label: 'Recent severe collision, high fall, or bone fracture' },
            ].map((flag) => (
              <label
                key={flag.id}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                  redFlags.includes(flag.id)
                    ? 'bg-rose-100 border-rose-300 text-rose-950 font-medium'
                    : 'bg-white border-rose-100 text-slate-700 hover:bg-rose-50/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={redFlags.includes(flag.id)}
                  onChange={() => toggleRedFlag(flag.id)}
                  className="mt-0.5 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs leading-snug">{flag.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Back to Movement Scan
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition transform hover:-translate-y-0.5 disabled:bg-slate-300"
          >
            <span>{submitting ? 'Generating AI Clinical Report...' : 'Generate 3-Day Plan & Report'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Alert Modal */}
      {triggeredSafety && (
        <SafetyAlertModal
          safetyData={triggeredSafety}
          isOpen={safetyModalOpen}
          onClose={handleSafetyModalClose}
        />
      )}
    </div>
  );
};
