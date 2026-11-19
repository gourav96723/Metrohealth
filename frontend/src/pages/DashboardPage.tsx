import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Stethoscope,
  Activity,
  PlusCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronDown
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

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const assData = await api.getAssessments();
      setAssessments(assData);

      if (user) {
        const apptData = await api.getMyAppointments();
        setAppointments(apptData);
      }
    } catch (err: any) {
      console.warn('Dashboard data retrieve notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const completedExercises = latestAssessment?.completed_exercise_ids || [];
  const totalExercises = latestAssessment?.educational_exercises?.length || 3;
  const exercisesDoneCount = completedExercises.length;
  const completionPercentage = totalExercises > 0 ? Math.round((exercisesDoneCount / totalExercises) * 100) : 67;

  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(a.appointment_time) > now
  );

  const displayAppointments = [
    {
      id: '1',
      provider: 'Dr. Rajesh Sharma, MS (Ortho)',
      time: '09:00 PM',
      type: 'Telehealth Consult',
      status: 'Confirmed',
      statusType: 'in_clinic',
    },
    {
      id: '2',
      provider: 'Dr. Priya Nair, MPT',
      time: '09:00 PM',
      type: 'Posture Scan Review',
      status: 'Next',
      statusType: 'next',
    },
    {
      id: '3',
      provider: 'Dr. Amitav Ghosh, DPT',
      time: '12:30 PM',
      type: 'Follow-up Session',
      status: 'Completed',
      statusType: 'completed',
    },
  ];

  const handleToggleExercise = async (e: React.MouseEvent, exerciseId: string) => {
    e.stopPropagation();
    if (!latestAssessment) return;

    const currentCompleted = latestAssessment.completed_exercise_ids || [];
    const newCompleted = currentCompleted.includes(exerciseId)
      ? currentCompleted.filter((id) => id !== exerciseId)
      : [...currentCompleted, exerciseId];

    const updatedAssessment = {
      ...latestAssessment,
      completed_exercise_ids: newCompleted,
    };
    setAssessments(assessments.map((a) => (a.id === latestAssessment.id ? updatedAssessment : a)));

    try {
      await api.updateExerciseProgress(latestAssessment.id, newCompleted);
    } catch (err) {
      console.error('Failed to update exercise completion:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ================= TOP BENTO ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: Upcoming Consultations & Sessions (Spans 7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white tracking-tight">
                My Upcoming Consultations
              </h2>

              <button
                onClick={() => onNavigate('appointments')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081525] hover:bg-[#0c1e33] border border-slate-700/60 text-xs text-slate-300 font-medium transition"
              >
                <span>Book / Schedule</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-medium border-b border-slate-800/50">
                    <th className="py-2.5 font-normal">Specialist</th>
                    <th className="py-2.5 font-normal">Time</th>
                    <th className="py-2.5 font-normal">Session Type</th>
                    <th className="py-2.5 text-right font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 font-medium">
                  {displayAppointments.map((item) => {
                    const isInClinic = item.statusType === 'in_clinic';
                    const isNext = item.statusType === 'next';
                    const isCompleted = item.statusType === 'completed';

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                        <td className="py-3 text-white font-semibold flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] flex items-center justify-center font-bold">
                            DR
                          </div>
                          <span>{item.provider}</span>
                        </td>
                        <td className="py-3 text-slate-300 font-mono text-[11px]">{item.time}</td>
                        <td className="py-3 text-slate-400 text-[11px]">{item.type}</td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isInClinic
                                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-[0_0_8px_rgba(45,212,191,0.2)]'
                                : isNext
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/35'
                                : 'bg-slate-800/80 text-emerald-400 border border-emerald-500/25'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isInClinic
                                  ? 'bg-teal-400 animate-pulse'
                                  : isNext
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            />
                            <span>{item.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Clinic Helpline: +91 96537 66889</span>
            <button
              onClick={() => onNavigate('consultants')}
              className="text-teal-400 hover:text-teal-300 font-bold transition flex items-center gap-1"
            >
              <span>View Doctors Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 2: Personal Posture & Alignment Telemetry (Spans 5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white tracking-tight">
              Posture & Alignment Analysis
            </h2>
            <button
              onClick={() => onNavigate('assessment')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081525] hover:bg-[#0c1e33] border border-slate-700/60 text-xs text-slate-300 font-medium transition"
            >
              <span>Scan Again</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Center Anatomical Wireframe Illustration & Callout Pills */}
          <div className="relative h-64 sm:h-72 w-full flex items-center justify-center my-2">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-48 sm:w-56 h-full glow-spine-pulse overflow-visible" viewBox="0 0 200 280">
                <defs>
                  <linearGradient id="patientSpineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Silhouette */}
                <path
                  d="M 100 20 Q 88 40, 85 60 L 115 60 Q 112 40, 100 20 Z"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Clavicle Line */}
                <path
                  d="M 30 75 Q 70 70, 100 75 Q 130 70, 170 75"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Ribcage Arcs */}
                {[90, 105, 120, 135, 150].map((y, idx) => (
                  <path
                    key={idx}
                    d={`M ${100 - (18 + idx * 8)} ${y} Q 100 ${y - 4}, ${100 + (18 + idx * 8)} ${y}`}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.2"
                    opacity={0.35 + idx * 0.08}
                  />
                ))}

                {/* Spine Column */}
                <path
                  d="M 100 65 Q 101 120, 100 170 T 100 215"
                  fill="none"
                  stroke="url(#patientSpineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Vertebrae Beads */}
                {[65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215].map((y, i) => (
                  <rect
                    key={i}
                    x={96}
                    y={y - 3}
                    width={8}
                    height={6}
                    rx={2}
                    fill="#2dd4bf"
                  />
                ))}

                {/* Pelvis */}
                <path
                  d="M 55 210 Q 75 195, 100 215 Q 125 195, 145 210 Q 135 245, 100 240 Q 65 245, 55 210 Z"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  opacity="0.6"
                />

                <circle cx="45" cy="76" r="5" fill="#2dd4bf" />
                <circle cx="155" cy="76" r="5" fill="#2dd4bf" />
                <circle cx="68" cy="215" r="5" fill="#38bdf8" />
                <circle cx="132" cy="215" r="5" fill="#38bdf8" />
              </svg>
            </div>

            {/* CALLOUT PILLS */}
            <div className="absolute top-2 left-1 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Shoulder Tilt:</span>
              <span className="text-teal-300 font-bold font-mono">0.8°</span>
            </div>

            <div className="absolute top-[40%] left-0 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Symmetry:</span>
              <span className="text-teal-300 font-bold font-mono">94%</span>
            </div>

            <div className="absolute bottom-2 left-1 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Spine Alignment:</span>
              <span className="text-emerald-400 font-bold">Optimal</span>
            </div>

            <div className="absolute top-2 right-1 sm:right-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Shoulder Tilt:</span>
              <span className="text-teal-300 font-bold font-mono">0.8°</span>
            </div>

            <div className="absolute top-[40%] right-0 sm:right-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Spine Alignment:</span>
              <span className="text-teal-300 font-bold font-mono">100%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Client-Side AI Vision</span>
            <button
              onClick={() => onNavigate('assessment')}
              className="px-3 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Start Posture Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BENTO ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 3: Patient Recovery Progress (Dual Charts: Wave Area + ROM Bars) (Spans 8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white tracking-tight">
                My Recovery Progress
              </h2>
              <span className="text-xs text-teal-300 font-mono font-semibold">+18% Flexion</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              {/* Left Wave Chart */}
              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Healing Velocity</span>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Healing
                    </span>
                    <span className="flex items-center gap-1 text-teal-400">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      Motion
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full relative flex items-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 260 140">
                    <defs>
                      <linearGradient id="pHealingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="pMotionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {[15, 45, 75, 105, 130].map((y, idx) => (
                      <line key={idx} x1="24" y1={y} x2="260" y2={y} stroke="#1e293b" strokeDasharray="2 3" />
                    ))}

                    <path
                      d="M 28 130 Q 70 120, 100 80 T 170 65 T 230 45 L 255 35 L 255 130 Z"
                      fill="url(#pMotionGrad)"
                    />
                    <path
                      d="M 28 130 Q 60 100, 100 90 T 160 70 T 210 50 L 255 20 L 255 130 Z"
                      fill="url(#pHealingGrad)"
                    />
                    <path
                      d="M 28 130 Q 70 120, 100 80 T 170 65 T 230 45 L 255 35"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2.2"
                    />
                    <path
                      d="M 28 130 Q 60 100, 100 90 T 160 70 T 210 50 L 255 20"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                <div className="flex justify-between pl-6 text-[9px] text-slate-500 font-mono">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>July</span>
                </div>
              </div>

              {/* Right ROM Bars */}
              <div className="md:col-span-6 space-y-2 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 pt-3 md:pt-0">
                <span className="text-xs font-bold text-slate-200">Range-of-Motion Consistency</span>
                <div className="h-44 w-full relative flex items-end justify-between pl-6 pr-2 pb-1">
                  {[
                    { month: 'Jan', h1: 45, h2: 70 },
                    { month: 'Feb', h1: 65, h2: 85 },
                    { month: 'Mar', h1: 80, h2: 105 },
                    { month: 'Apr', h1: 75, h2: 115 },
                    { month: 'May', h1: 95, h2: 130 },
                    { month: 'Jun', h1: 110, h2: 145 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="flex items-end gap-1 h-36">
                        <div
                          className="w-2 rounded-t bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                          style={{ height: `${(bar.h1 / 150) * 100}%` }}
                        />
                        <div
                          className="w-2 rounded-t bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.3)]"
                          style={{ height: `${(bar.h2 / 150) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
            Exercise Compliance: <strong>88%</strong> • Assigned by Dr. Rajesh Sharma
          </div>
        </div>

        {/* CARD 4: 3-Day Plan Completion (Dual Progress Rings) (Spans 4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight pb-3 border-b border-slate-800/80">
              Rehab Plan Completion
            </h2>

            <p className="text-xs text-slate-400 mt-3 font-medium">Daily Recovery Protocol</p>

            <div className="grid grid-cols-2 gap-4 my-4 py-2">
              {/* Ring 1: Movings */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#13273e" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - 0.3)}
                      strokeLinecap="round"
                      className="shadow-[0_0_12px_#22d3ee]"
                    />
                  </svg>
                  <span className="absolute font-black text-xl text-white font-mono">30%</span>
                </div>
                <span className="text-xs font-semibold text-slate-300">Movings</span>
              </div>

              {/* Ring 2: Progress */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#13273e" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - 0.9)}
                      strokeLinecap="round"
                      className="shadow-[0_0_15px_#2dd4bf]"
                    />
                  </svg>
                  <span className="absolute font-black text-xl text-white font-mono">90%</span>
                </div>
                <span className="text-xs font-semibold text-teal-300">Progress</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('my-exercises')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500/25 to-cyan-400/20 hover:from-teal-500/35 hover:to-cyan-400/30 text-teal-300 border border-teal-400/40 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Open Today's 3-Day Exercises</span>
          </button>
        </div>
      </div>
    </div>
  );
};
