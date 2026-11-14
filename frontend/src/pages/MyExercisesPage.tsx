import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Info,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AssessmentRecord, ExerciseRecommendation } from '../types';

interface MyExercisesPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MyExercisesPage: React.FC<MyExercisesPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [latestAssessment, setLatestAssessment] = useState<AssessmentRecord | null>(null);
  const [allAssessments, setAllAssessments] = useState<AssessmentRecord[]>([]);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLatestPlan();
  }, []);

  const fetchLatestPlan = async () => {
    setLoading(true);
    try {
      const data = await api.getAssessments();
      setAllAssessments(data);
      if (data.length > 0) {
        const latest = data[0];
        setLatestAssessment(latest);
        setCompletedIds(latest.completed_exercise_ids || []);
      }
    } catch (err) {
      console.error('Failed to fetch exercise plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExercise = async (exerciseId: string) => {
    if (!latestAssessment) return;

    const newCompleted = completedIds.includes(exerciseId)
      ? completedIds.filter((id) => id !== exerciseId)
      : [...completedIds, exerciseId];

    setCompletedIds(newCompleted);
    setUpdating(true);

    try {
      await api.updateExerciseProgress(latestAssessment.id, newCompleted);
    } catch (err) {
      console.error('Failed to sync exercise progress', err);
    } finally {
      setUpdating(false);
    }
  };

  // Group exercises or spread across Day 1, Day 2, Day 3
  const exercises = latestAssessment?.educational_exercises || [];
  
  // If we have exercises, assign them to days
  const getDayExercises = (day: number) => {
    if (exercises.length === 0) return [];
    if (exercises.length === 1) return exercises;
    if (day === 1) return [exercises[0]];
    if (day === 2) return exercises.length > 1 ? [exercises[1]] : [exercises[0]];
    // Day 3 includes combination or remaining
    return exercises.length > 2 ? [exercises[2]] : exercises;
  };

  const currentDayExercises = getDayExercises(activeDay);
  const totalCompleted = exercises.filter((e) => completedIds.includes(e.id)).length;
  const progressPercent = exercises.length > 0 ? Math.round((totalCompleted / exercises.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prescribed Physiotherapy Regimen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My 3-Day Personalized Exercise Plan
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Evidence-based therapeutic exercises designed from your clinical assessment to improve
            joint range of motion, postural stability, and alleviate strain safely.
          </p>
        </div>

        {/* Progress Metric in Banner */}
        {latestAssessment && exercises.length > 0 && (
          <div className="mt-6 pt-6 border-t border-teal-600/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-lg text-teal-200 border border-white/10">
                {progressPercent}%
              </div>
              <div>
                <p className="text-xs font-bold text-white">Overall Plan Completion</p>
                <p className="text-[11px] text-teal-200">
                  {totalCompleted} of {exercises.length} prescribed movements mastered
                </p>
              </div>
            </div>

            {/* Redirection to Book Doctor if still in pain */}
            <button
              onClick={() => onNavigate('appointments', { reason: `Persistent discomfort in ${latestAssessment.body_area || 'posture'}` })}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <span>Still experiencing pain? Consult Specialist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 text-slate-500">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading your active physiotherapy plan...</p>
        </div>
      ) : !latestAssessment || exercises.length === 0 ? (
        /* Empty State for New Patients */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Active Exercise Plan Found</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You haven't completed a posture assessment yet. Start your first AI posture and movement
            scan to receive your tailored 3-day recovery routine.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/20 transition"
          >
            <span>Start My Assessment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day 1 / Day 2 / Day 3 Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-200/90 pb-3">
            {[1, 2, 3].map((dayNum) => {
              const isActive = activeDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day {dayNum} Protocol</span>
                </button>
              );
            })}

            <div className="ml-auto text-[11px] text-slate-500 hidden sm:block">
              Target Area: <strong className="text-slate-800 capitalize">{latestAssessment.body_area?.replace('_', ' ')}</strong>
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 gap-6">
            {currentDayExercises.map((exercise) => {
              const isDone = completedIds.includes(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all ${
                    isDone
                      ? 'border-teal-300 bg-teal-50/20 shadow-xs'
                      : 'border-slate-200/90 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold text-[10px] border border-teal-200 uppercase tracking-wide">
                          {exercise.category}
                        </span>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {exercise.difficulty} Level
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">{exercise.name}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{exercise.purpose}</p>
                    </div>

                    {/* Completion Checkbox */}
                    <button
                      onClick={() => handleToggleExercise(exercise.id)}
                      disabled={updating}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition self-start sm:self-auto ${
                        isDone
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-white' : 'text-slate-400'}`} />
                      <span>{isDone ? 'Completed' : 'Mark as Completed'}</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                    {/* Step-by-step instructions */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Instructions
                      </h4>
                      <ol className="space-y-2">
                        {exercise.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {exercise.evidence_note && (
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-[11px] text-slate-600 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                          <span><strong>Evidence Standard:</strong> {exercise.evidence_note}</span>
                        </div>
                      )}
                    </div>

                    {/* Dosage, Precautions & Stop Conditions */}
                    <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span>Prescribed Dosage</span>
                        </div>
                        <p className="text-xs text-slate-700 font-semibold">{exercise.suggested_dosage}</p>
                      </div>

                      {exercise.precautions?.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <p className="text-[11px] font-bold text-slate-800 mb-1">Precautions</p>
                          <ul className="text-[11px] text-slate-600 space-y-1">
                            {exercise.precautions.map((prec, i) => (
                              <li key={i}>• {prec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exercise.stop_conditions?.length > 0 && (
                        <div className="pt-2 border-t border-slate-200/60">
                          <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Stop Conditions</span>
                          </p>
                          <ul className="text-[11px] text-rose-700 space-y-1">
                            {exercise.stop_conditions.map((stop, i) => (
                              <li key={i}>• {stop}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Need Doctor Support Banner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Still experiencing discomfort or reduced mobility?
                </h3>
                <p className="text-xs text-slate-500">
                  Book a consultation with our hospital orthopedic and physiotherapy team for a complete physical exam.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('appointments', { reason: `Follow-up on ${latestAssessment.body_area || 'posture'} exercises` })}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0"
            >
              <span>Schedule Doctor Visit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
