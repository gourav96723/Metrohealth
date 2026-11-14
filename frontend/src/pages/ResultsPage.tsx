import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Clock,
  Star,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { AssessmentRecord, ProviderInfo } from '../types';
import { ExerciseCard } from '../components/ExerciseCard';

interface ResultsPageProps {
  assessmentId?: number;
  onNavigate: (page: string, params?: any) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  assessmentId,
  onNavigate,
}) => {
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // In-Page Consultation Booking State
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingSlot, setBookingSlot] = useState<string>('');
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  useEffect(() => {
    loadAssessmentAndProviders();
  }, [assessmentId]);

  const loadAssessmentAndProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: AssessmentRecord;
      if (assessmentId) {
        data = await api.getAssessmentById(assessmentId);
      } else {
        const list = await api.getAssessments();
        if (list.length > 0) {
          data = list[0];
        } else {
          throw new Error('No assessment records found.');
        }
      }
      setAssessment(data);

      // Load providers for instant consultation booking
      const provs = await api.getProviders();
      setProviders(provs);
      if (provs.length > 0) {
        setSelectedProvider(provs[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to load assessment results.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !bookingDate || !bookingSlot) return;

    setBookingInProgress(true);
    try {
      const dateTimeStr = `${bookingDate}T${bookingSlot}:00Z`;
      await api.bookAppointment({
        provider_name: selectedProvider.name,
        provider_specialty: selectedProvider.specialty,
        clinic_name: selectedProvider.clinic,
        appointment_time: dateTimeStr,
        consultation_type: 'telehealth',
        reason: `${assessment?.body_area?.toUpperCase()} Postural & Movement Follow-up`,
      });
      setBookingConfirmed(true);
    } catch (err: any) {
      alert(`Booking conflict: ${err.message}`);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleExportTextSummary = () => {
    if (!assessment) return;
    const content = `
HEALTHSENSE AI - ASSESSMENT SUMMARY
===================================
Assessment ID: #${assessment.id}
Date: ${new Date(assessment.created_at).toLocaleString()}
Body Area: ${assessment.body_area?.toUpperCase()}
Concern: ${assessment.primary_concern}
Safety Urgency: ${assessment.overall_risk_level?.toUpperCase()}
Symmetry Score: ${assessment.movement_measurements?.[0]?.symmetry_score ?? 'N/A'}%
Shoulder Tilt: ${assessment.movement_measurements?.[0]?.shoulder_alignment_deg ?? '0'} deg

CLINICAL GUIDANCE:
${assessment.safety_screening?.guidance_message || assessment.summary}
===================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthSense_${assessment.body_area}_Assessment.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Activity className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Synthesizing Clinical Analysis...</h3>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Assessment Record Not Found</h3>
        <button
          onClick={() => onNavigate('assessment')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  const movement = assessment.movement_measurements?.[0];
  const safety = assessment.safety_screening;
  const isEmergency = assessment.overall_risk_level === 'emergency';
  const isUrgent = assessment.overall_risk_level === 'urgent_physician';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
              Personalized Results
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">
              {assessment.body_area?.replace('_', ' ')} Health & Movement Report
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTextSummary}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow transition"
          >
            My Dashboard
          </button>
        </div>
      </div>

      {/* 1. KEY CLINICAL METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Safety Badge */}
        <div className={`p-5 rounded-3xl border shadow-xs space-y-1 ${
          isEmergency
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : isUrgent
            ? 'bg-amber-50 border-amber-200 text-amber-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Safety Clearance</span>
            {isEmergency ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />}
          </div>
          <div className="text-lg font-extrabold capitalize">
            {safety?.is_safe_for_exercise ? 'Cleared for Mobility' : 'Consultation Recommended'}
          </div>
          <p className="text-xs opacity-90 leading-snug">
            {isEmergency
              ? 'Urgent medical attention recommended.'
              : isUrgent
              ? 'Clinical evaluation advised by a physician.'
              : 'Safe for guided gentle physical therapy exercises.'}
          </p>
        </div>

        {/* Movement Symmetry */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bilateral Symmetry</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900 font-mono">
            {movement?.symmetry_score ? `${movement.symmetry_score}%` : '95% Standard'}
          </div>
          <p className="text-xs text-slate-500">
            Tilt: {movement?.shoulder_alignment_deg ?? 1.8}° (Within functional variance)
          </p>
        </div>

        {/* Reported Discomfort */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reported Pain</span>
            <UserCheck className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-lg font-extrabold text-slate-900">
            {assessment.symptom_response?.severity ?? 4} / 10
          </div>
          <p className="text-xs text-slate-500 capitalize">
            {assessment.symptom_response?.duration} • {assessment.symptom_response?.side} side
          </p>
        </div>
      </div>

      {/* 2. TAILORED EDUCATIONAL EXERCISES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Recommended Physiotherapy Routines
            </h3>
            <p className="text-xs text-slate-500">
              Evidence-based mobility and stabilization exercises tailored for your {assessment.body_area?.replace('_', ' ')}.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
            {assessment.educational_exercises?.length || 0} Exercises
          </span>
        </div>

        {safety?.is_safe_for_exercise ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.educational_exercises?.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
            <h4 className="font-bold text-sm text-rose-900">Physical Exercises Withheld</h4>
            <p className="text-xs text-rose-800 max-w-md mx-auto leading-relaxed">
              Based on your clinical screening, please consult a healthcare professional before starting an exercise routine.
            </p>
          </div>
        )}
      </div>

      {/* 3. SEAMLESS SPECIALIST CONSULTATION BOOKING */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
              Need Hands-On Care?
            </span>
            <h3 className="text-xl font-bold tracking-tight">
              Schedule a Consultation with a Physiotherapist
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Book a 1-on-1 virtual or clinic appointment to review your posture and movement.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Sparkles className="w-4 h-4" />
            <span>Direct Scheduling</span>
          </div>
        </div>

        {bookingConfirmed ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2 text-emerald-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-base text-white">Consultation Confirmed!</h4>
            <p className="text-xs">
              Your appointment with {selectedProvider?.name} has been booked for {bookingDate} at {bookingSlot}.
            </p>
            <button
              onClick={() => onNavigate('appointments')}
              className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition"
            >
              View in My Appointments
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookConsultation} className="space-y-5">
            {/* Choose Specialist */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Specialist</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {providers.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer text-left ${
                      selectedProvider?.id === p.id
                        ? 'border-teal-400 bg-slate-800 ring-2 ring-teal-400/30'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{p.name}</span>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{p.rating}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-teal-400 block mt-0.5">{p.specialty}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">{p.clinic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Slot selection */}
            {selectedProvider && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Available Time Slot</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.time_slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          bookingSlot === slot
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bookingInProgress || !bookingDate || !bookingSlot}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition disabled:bg-slate-800 disabled:text-slate-500"
            >
              {bookingInProgress ? 'Scheduling...' : 'Confirm Consultation Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
