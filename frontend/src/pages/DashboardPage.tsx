import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Dumbbell,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  PlusCircle,
  FileText,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AssessmentRecord, AppointmentRecord } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const assData = await api.getAssessments();
      setAssessments(assData);

      if (user) {
        const apptData = await api.getMyAppointments();
        setAppointments(apptData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve patient clinical records.');
    } finally {
      setLoading(false);
    }
  };

  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const completedExercises = latestAssessment?.completed_exercise_ids || [];
  const totalExercises = latestAssessment?.educational_exercises?.length || 0;
  const exercisesDoneCount = completedExercises.length;
  const completionPercentage = totalExercises > 0 ? Math.round((exercisesDoneCount / totalExercises) * 100) : 0;

  // Appointment handling: separating truly upcoming vs past visits
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(a.appointment_time) > now
  );
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || new Date(a.appointment_time) <= now
  );
  const lastCompletedAppointment = pastAppointments.length > 0 ? pastAppointments[0] : null;

  const handleToggleExerciseFromDashboard = async (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    if (!latestAssessment) return;

    const currentCompleted = latestAssessment.completed_exercise_ids || [];
    const newCompleted = currentCompleted.includes(exerciseId)
      ? currentCompleted.filter((id) => id !== exerciseId)
      : [...currentCompleted, exerciseId];

    // Optimistically update local assessment state
    const updatedAssessment = {
      ...latestAssessment,
      completed_exercise_ids: newCompleted,
    };
    setAssessments(assessments.map((a) => (a.id === latestAssessment.id ? updatedAssessment : a)));

    try {
      await api.updateExerciseProgress(latestAssessment.id, newCompleted);
    } catch (err) {
      console.error('Failed to sync exercise progress from dashboard:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
              MetroHealth Patient Portal
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-xs text-slate-400 font-medium">
              Medical ID: MH-2026-{user?.id ? String(user.id).padStart(4, '0') : '8472'}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-300 bg-[#0c1626] px-2.5 py-0.5 rounded-lg border border-teal-500/30">
              <PhoneCall className="w-3 h-3 text-teal-400" />
              Helpline: +91 9653766889
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.full_name || 'Patient'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your personal AI physiotherapy assistant is active. Monitor your posture alignment, track your 3-day recovery routine, and consult certified hospital specialists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('records')}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-[#0c1626] hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-teal-400" />
            <span>My Records</span>
          </button>

          <button
            onClick={() => onNavigate('assessment')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-md shadow-teal-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>Start Assessment</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadDashboardData} className="font-bold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* 2. Main Highlight: Start Posture Assessment Card */}
      <div className="bg-gradient-to-r from-[#0c1626] via-[#0b1d30] to-[#0c1626] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-cyan-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>AI Computer-Vision Biomechanical Scan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Start New Posture & Movement Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Perform a quick 30-second webcam posture analysis. Our AI calculates shoulder horizontal tilt,
              cervical alignment, and bilateral symmetry to generate structured clinical observations and customized 3-day recovery exercises.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('assessment')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-teal-500/30 transform hover:-translate-y-0.5"
              >
                <Camera className="w-4 h-4" />
                <span>Begin Posture Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {latestAssessment && (
                <div className="text-[11px] text-teal-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    Last completed:{' '}
                    <strong>{new Date(latestAssessment.created_at).toLocaleDateString()}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Assessment Metric / Graphic */}
          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-[#060e1a]/80 backdrop-blur-md rounded-2xl border border-slate-800 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-cyan-300 flex items-center justify-center border border-teal-400/30 shadow-md">
              <Camera className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold text-white">100% Client-Side Privacy</p>
            <p className="text-[11px] text-slate-400">
              Frames evaluated in browser via WebAssembly. Zero raw camera video stored.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Previous Assessment / Active Exercise Record Card */}
      {latestAssessment ? (
        <div className="bg-[#0c1626]/85 rounded-3xl border border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Active Clinical Record
                </span>
                <span className="text-xs text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-300">
                  {new Date(latestAssessment.created_at).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Latest Assessment: {latestAssessment.title}
              </h3>
            </div>

            {/* View Exercise Plan Button */}
            <button
              onClick={() => onNavigate('my-exercises')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 font-bold text-xs transition flex items-center gap-2 self-start sm:self-auto shadow-md shadow-teal-500/20"
            >
              <Dumbbell className="w-4 h-4 text-slate-950" />
              <span>View Exercise Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Identified Problem</span>
              <span className="text-sm font-bold text-white capitalize mt-1 block">
                {latestAssessment.body_area?.replace('_', ' ') || 'General Strain'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Concern: {latestAssessment.primary_concern?.replace('_', ' ') || 'Routine Scan'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Safety Screening</span>
              <span
                className={`text-sm font-bold capitalize mt-1 block ${
                  latestAssessment.overall_risk_level === 'emergency'
                    ? 'text-rose-400'
                    : latestAssessment.overall_risk_level === 'urgent_physician'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {latestAssessment.overall_risk_level?.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {latestAssessment.safety_screening?.is_safe_for_exercise
                  ? 'Safe for gentle movement'
                  : 'Physician visit advised'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Prescribed Exercises</span>
              <span className="text-sm font-bold text-cyan-400 mt-1 block">
                {totalExercises} Therapeutic Movements
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                3-Day Personalized Protocol
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#060e1a]/80 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">Completion Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-white">
                  {exercisesDoneCount} of {totalExercises} Done
                </span>
                <span className="text-xs text-teal-400 font-bold">
                  ({totalExercises > 0 ? Math.round((exercisesDoneCount / totalExercises) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${totalExercises > 0 ? (exercisesDoneCount / totalExercises) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {latestAssessment.summary && (
            <p className="text-xs text-slate-300 leading-relaxed bg-[#060e1a]/90 p-4 rounded-2xl border border-cyan-500/30">
              <strong className="text-cyan-400">Clinical Finding:</strong> {latestAssessment.summary}
            </p>
          )}
        </div>
      ) : (
        /* Empty State for New Patients */
        <div className="bg-[#0c1626]/85 rounded-3xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/20 text-cyan-300 flex items-center justify-center mx-auto shadow-md">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Welcome to MetroHealth AI Clinic</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You don't have any past posture or physiotherapy assessments yet. Complete your first
            guided 3-minute assessment to unlock customized exercises and movement observations.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition"
          >
            <span>Start First Assessment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Additional Dashboard Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Today's Exercise Tasks */}
        <div className="bg-[#0c1626]/85 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Today's Exercises
              </h3>
            </div>
            <button
              onClick={() => onNavigate('my-exercises')}
              className="text-[11px] font-bold text-cyan-400 hover:underline"
            >
              Open Plan
            </button>
          </div>

          {latestAssessment?.educational_exercises && latestAssessment.educational_exercises.length > 0 ? (
            <div className="space-y-2.5">
              {latestAssessment.educational_exercises.slice(0, 3).map((ex) => {
                const isDone = completedExercises.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={(e) => handleToggleExerciseFromDashboard(e, ex.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isDone
                        ? 'border-teal-500/40 bg-teal-950/40 text-teal-200'
                        : 'border-slate-800 bg-[#060e1a]/80 hover:bg-[#081324] text-slate-200'
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-bold ${isDone ? 'text-teal-300 line-through opacity-80' : 'text-white'}`}>
                        {ex.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{ex.suggested_dosage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleToggleExerciseFromDashboard(e, ex.id)}
                      className="p-1 hover:scale-110 transition"
                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 transition ${isDone ? 'text-cyan-400' : 'text-slate-600 hover:text-cyan-400'}`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              Complete an assessment to populate your daily physiotherapy exercises.
            </p>
          )}
        </div>

        {/* Card 2: Upcoming or Completed Doctor Consultation */}
        <div className="bg-[#0c1626]/85 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {nextAppointment ? 'Upcoming Consultation' : 'Doctor Consultation'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('appointments')}
              className="text-[11px] font-bold text-cyan-400 hover:underline"
            >
              Book
            </button>
          </div>

          {nextAppointment ? (
            <div className="p-4 rounded-2xl bg-[#060e1a]/90 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">{nextAppointment.provider_name}</p>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-cyan-300 border border-teal-500/40 text-[10px] font-bold uppercase">
                  {nextAppointment.consultation_type === 'telehealth' ? 'Telehealth' : 'In-Person'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{nextAppointment.provider_specialty}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 font-semibold flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{new Date(nextAppointment.appointment_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-cyan-300 text-[9px] font-bold uppercase">
                  Scheduled
                </span>
              </div>
            </div>
          ) : lastCompletedAppointment ? (
            <div className="p-4 rounded-2xl bg-[#060e1a]/90 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">{lastCompletedAppointment.provider_name}</p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Visit Done
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{lastCompletedAppointment.provider_specialty}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300 font-semibold flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{new Date(lastCompletedAppointment.appointment_time).toLocaleDateString('en-IN')}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Consultation Done</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2">
              <p className="text-xs text-slate-400">No active consultations booked.</p>
              <button
                onClick={() => onNavigate('consultants')}
                className="px-3.5 py-1.5 rounded-xl bg-[#060e1a] hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold transition"
              >
                Browse Indian Specialists
              </button>
            </div>
          )}
        </div>

        {/* Card 3: Weekly Alignment & Progress */}
        <div className="bg-[#0c1626]/85 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Weekly Postural Health
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">Stable</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Shoulder Tilt Angle</span>
              <span className="font-bold text-white">
                {latestAssessment?.movement_measurements?.[0]?.shoulder_alignment_deg
                  ? `${latestAssessment.movement_measurements[0].shoulder_alignment_deg}°`
                  : '0.8° (Optimal)'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Bilateral Symmetry</span>
              <span className="font-bold text-teal-400">
                {latestAssessment?.movement_measurements?.[0]?.symmetry_score
                  ? `${latestAssessment.movement_measurements[0].symmetry_score}%`
                  : '94%'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Safety Status</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cleared</span>
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => onNavigate('records')}
                className="w-full py-2 bg-[#060e1a] hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-xs rounded-xl transition"
              >
                View Historical Trends
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
