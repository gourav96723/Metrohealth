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
      const res = await api.updateExerciseProgress(latestAssessment.id, newCompleted);
      if (res && res.completed_exercise_ids) {
        setCompletedIds(res.completed_exercise_ids);
      }
    } catch (err) {
      console.error('Failed to sync exercise progress', err);
    } finally {
      setUpdating(false);
    }
  };

  // Group exercises across Day 1, Day 2, Day 3
  const exercises = latestAssessment?.educational_exercises || [];
  
  const getDayExercises = (day: number) => {
    if (exercises.length === 0) return [];
    if (exercises.length === 1) return exercises;
    if (day === 1) return [exercises[0]];
    if (day === 2) return exercises.length > 1 ? [exercises[1]] : [exercises[0]];
    return exercises.length > 2 ? [exercises[2]] : exercises;
  };

  const currentDayExercises = getDayExercises(activeDay);
  const totalCompleted = exercises.filter((e) => completedIds.includes(e.id)).length;
  const progressPercent = exercises.length > 0 ? Math.round((totalCompleted / exercises.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c1626] via-[#0b1d30] to-[#0c1626] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Prescribed Physiotherapy Regimen (India)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            My 3-Day Personalized Exercise Plan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Evidence-based therapeutic exercises designed from your clinical AI assessment to improve
            joint range of motion, postural stability, and alleviate strain safely.
          </p>
        </div>

        {/* Progress Metric in Banner */}
        {latestAssessment && exercises.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center font-black text-lg text-cyan-300 shadow-md">
                {progressPercent}%
              </div>
              <div>
                <p className="text-xs font-bold text-white">Overall Plan Completion</p>
                <p className="text-[11px] text-teal-300">
                  {totalCompleted} of {exercises.length} prescribed movements mastered
                </p>
              </div>
            </div>

            {/* Redirection to Book Doctor if still in pain */}
            <button
              onClick={() => onNavigate('appointments', { reason: `Persistent discomfort in ${latestAssessment.body_area || 'posture'}` })}
              className="px-4 py-2 rounded-xl bg-[#060e1a] hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition flex items-center gap-2"
            >
              <span>Still experiencing pain? Consult Specialist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-[#0c1626]/85 rounded-3xl p-12 text-center border border-slate-800 text-slate-400">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading your active physiotherapy plan...</p>
        </div>
      ) : !latestAssessment || exercises.length === 0 ? (
        /* Empty State for New Patients */
        <div className="bg-[#0c1626]/85 rounded-3xl p-8 sm:p-12 text-center border border-slate-800 shadow-xl max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/20 text-cyan-300 flex items-center justify-center mx-auto shadow-md">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">No Active Exercise Plan Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't completed a posture assessment yet. Start your first AI posture and movement
            scan to receive your tailored 3-day recovery routine.
          </p>
          <button
            onClick={() => onNavigate('assessment')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition"
          >
            <span>Start My Assessment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day 1 / Day 2 / Day 3 Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3 flex-wrap">
            {[1, 2, 3].map((dayNum) => {
              const isActive = activeDay === dayNum;
              return (
                <button
                  key={dayNum}
                  onClick={() => setActiveDay(dayNum)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/20'
                      : 'bg-[#0c1626] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day {dayNum} Protocol</span>
                </button>
              );
            })}

            <div className="ml-auto text-[11px] text-slate-400 hidden sm:block">
              Target Area: <strong className="text-cyan-400 capitalize">{latestAssessment.body_area?.replace('_', ' ')}</strong>
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 gap-6">
            {currentDayExercises.map((exercise) => {
              const isDone = completedIds.includes(exercise.id);

              return (
                <div
                  key={exercise.id}
                  className={`bg-[#0c1626]/85 rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all shadow-xl ${
                    isDone
                      ? 'border-teal-500/40 bg-teal-950/20 shadow-sm'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-300 font-bold text-[10px] border border-teal-500/30 uppercase tracking-wide">
                          {exercise.category}
                        </span>
                        <span className="text-[11px] text-slate-500">•</span>
                        <span className="text-xs font-semibold text-slate-400">
                          {exercise.difficulty} Level
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">{exercise.name}</h3>
                      <p className="text-xs text-slate-300 mt-0.5">{exercise.purpose}</p>
                    </div>

                    {/* Completion Checkbox */}
                    <button
                      onClick={() => handleToggleExercise(exercise.id)}
                      disabled={updating}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition self-start sm:self-auto ${
                        isDone
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 font-black'
                          : 'bg-[#060e1a] text-slate-300 border border-slate-700 hover:border-cyan-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-slate-950' : 'text-slate-500'}`} />
                      <span>{isDone ? 'Completed' : 'Mark as Completed'}</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
                    {/* Step-by-step instructions */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Instructions
                      </h4>
                      <ol className="space-y-2">
                        {exercise.instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-teal-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-teal-500/30">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>

                      {exercise.evidence_note && (
                        <div className="p-3 bg-[#060e1a]/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span><strong className="text-white">Evidence Standard:</strong> {exercise.evidence_note}</span>
                        </div>
                      )}
                    </div>

                    {/* Dosage, Precautions & Stop Conditions */}
                    <div className="space-y-3 bg-[#060e1a]/80 p-4 rounded-2xl border border-slate-800">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          <span>Prescribed Dosage</span>
                        </div>
                        <p className="text-xs text-cyan-300 font-semibold">{exercise.suggested_dosage}</p>
                      </div>

                      {exercise.precautions?.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                          <p className="text-[11px] font-bold text-slate-300 mb-1">Precautions</p>
                          <ul className="text-[11px] text-slate-400 space-y-1">
                            {exercise.precautions.map((prec, i) => (
                              <li key={i}>• {prec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {exercise.stop_conditions?.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                          <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Stop Conditions</span>
                          </p>
                          <ul className="text-[11px] text-rose-300 space-y-1">
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
          <div className="bg-[#0c1626]/85 p-6 rounded-3xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center flex-shrink-0 font-bold shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Still experiencing discomfort or reduced mobility?
                </h3>
                <p className="text-xs text-slate-400">
                  Book a consultation with our hospital orthopedic and physiotherapy team for a complete physical exam.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('appointments', { reason: `Follow-up on ${latestAssessment.body_area || 'posture'} exercises` })}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 shadow-md shadow-teal-500/20"
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
