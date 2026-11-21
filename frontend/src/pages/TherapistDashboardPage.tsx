import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  FileSignature,
  Eye,
  TrendingUp,
  Play,
  MoreVertical,
  ChevronDown,
  Camera,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface TherapistDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const TherapistDashboardPage: React.FC<TherapistDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [selectedRowMenu, setSelectedRowMenu] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queueData = await api.getTherapistQueue();
        if (queueData && queueData.length > 0) {
          const mapped = queueData.map((q: any, i: number) => ({
            id: String(q.id || i + 1),
            name: q.patient_name || `Patient ${i + 1}`,
            time: q.time_slot || '10:00 AM',
            status: q.status === 'in_consultation' ? 'In Clinic' : q.status === 'completed' ? 'Completed' : 'Next',
            statusType: q.status === 'in_consultation' ? 'in_clinic' : q.status === 'completed' ? 'completed' : 'next',
            complaint: q.chief_complaint,
            avatar: (q.patient_name || 'PT')
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase(),
          }));
          setAppointments(mapped);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string, newType: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus, statusType: newType } : app
      )
    );
    setSelectedRowMenu(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ================= TOP BENTO ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: Today's OPD Appointments (Spans 6 or 7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            {/* Card Header with Dropdown */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white tracking-tight">
                Today's OPD Appointments
              </h2>

              <div className="relative">
                <button
                  onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081525] hover:bg-[#0c1e33] border border-slate-700/60 text-xs text-slate-300 font-medium transition"
                >
                  <span>All Action</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {actionDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-40 p-1.5 bg-[#09192c] border border-teal-500/30 rounded-xl shadow-2xl z-30 text-xs space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('therapist-schedule');
                        setActionDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      View Full Schedule
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('therapist-biomechanics');
                        setActionDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      Webcam Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Table or Empty State */}
            {appointments.length === 0 ? (
              <div className="py-14 flex flex-col items-center justify-center text-center space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.15)]">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">No OPD Appointments Booked Yet</p>
                <p className="text-xs text-slate-400 max-w-sm">
                  Real-time patient bookings for <span className="text-teal-300 font-semibold">{user?.full_name || 'Dr. Rajesh Kumar Sharma'}</span> will automatically appear here once scheduled.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-medium border-b border-slate-800/50">
                      <th className="py-2.5 font-normal">Patient Name</th>
                      <th className="py-2.5 font-normal">Appointment</th>
                      <th className="py-2.5 font-normal">Status</th>
                      <th className="py-2.5 text-right font-normal"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 font-medium">
                    {appointments.map((patient) => {
                      const isInClinic = patient.statusType === 'in_clinic';
                      const isNext = patient.statusType === 'next';
                      const isCompleted = patient.statusType === 'completed';

                      return (
                        <tr key={patient.id} className="hover:bg-slate-800/30 transition group">
                          {/* Name with Avatar */}
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500/40 to-cyan-500/30 border border-teal-400/30 text-teal-200 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                {patient.avatar}
                              </div>
                              <span className="font-semibold text-white group-hover:text-teal-300 transition">
                                {patient.name}
                              </span>
                            </div>
                          </td>

                          {/* Appointment Time */}
                          <td className="py-3 text-slate-300 font-mono text-[11px]">
                            {patient.time}
                          </td>

                          {/* Status Pill */}
                          <td className="py-3">
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
                              <span>{patient.status}</span>
                            </span>
                          </td>

                          {/* Row Action Menu */}
                          <td className="py-3 text-right relative">
                            <button
                              onClick={() =>
                                setSelectedRowMenu(selectedRowMenu === patient.id ? null : patient.id)
                              }
                              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>

                            {selectedRowMenu === patient.id && (
                              <div className="absolute right-0 mt-1 w-36 p-1 bg-[#0a1829] border border-teal-500/30 rounded-xl shadow-2xl z-30 text-xs space-y-0.5 text-left">
                                <button
                                  onClick={() => handleUpdateStatus(patient.id, 'In Clinic', 'in_clinic')}
                                  className="w-full px-2.5 py-1.5 rounded-lg text-teal-300 hover:bg-teal-950/40 transition"
                                >
                                  Call Patient
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(patient.id, 'Completed', 'completed')}
                                  className="w-full px-2.5 py-1.5 rounded-lg text-emerald-300 hover:bg-emerald-950/40 transition"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => onNavigate('therapist-biomechanics')}
                                  className="w-full px-2.5 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
                                >
                                  Biomechanics Scan
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Footer Action */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Room #304 • Attending Orthopaedic Specialist</span>
            <button
              onClick={() => onNavigate('therapist-patients')}
              className="text-teal-400 hover:text-teal-300 font-bold transition flex items-center gap-1"
            >
              <span>Full EMR Registry</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 2: Posture & Alignment Analysis (Spans 5 cols) */}
        {/* Exact match with Reference Image: Anatomical human spine visual with glowing callout pills */}
        <div className="lg:col-span-5 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Card Header with Dropdown */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white tracking-tight">
              Posture & Alignment Analysis
            </h2>
            <button
              onClick={() => onNavigate('therapist-biomechanics')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081525] hover:bg-[#0c1e33] border border-slate-700/60 text-xs text-slate-300 font-medium transition"
            >
              <span>By Action</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Center Anatomical Wireframe Illustration & Callout Pills */}
          <div className="relative h-64 sm:h-72 w-full flex items-center justify-center my-2">
            {/* Background Anatomical Spine Illustration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-48 sm:w-56 h-full glow-spine-pulse overflow-visible" viewBox="0 0 200 280">
                <defs>
                  <linearGradient id="spineGlowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.9" />
                  </linearGradient>
                  <radialGradient id="jointPointGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Cybernetic Human Skeleton Outline */}
                {/* Cervical & Head Silhouette */}
                <path
                  d="M 100 20 Q 88 40, 85 60 L 115 60 Q 112 40, 100 20 Z"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Shoulder Girdle / Clavicle Line */}
                <path
                  d="M 30 75 Q 70 70, 100 75 Q 130 70, 170 75"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Ribcage Outline Arcs */}
                {[90, 105, 120, 135, 150].map((y, idx) => (
                  <g key={idx} opacity={0.35 + idx * 0.08}>
                    <path
                      d={`M ${100 - (18 + idx * 8)} ${y} Q 100 ${y - 4}, ${100 + (18 + idx * 8)} ${y}`}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.2"
                    />
                  </g>
                ))}

                {/* Central Glowing Spine Column */}
                <path
                  d="M 100 65 Q 101 120, 100 170 T 100 215"
                  fill="none"
                  stroke="url(#spineGlowGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Vertebrae Segment Beads */}
                {[65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215].map((y, i) => (
                  <rect
                    key={i}
                    x={96}
                    y={y - 3}
                    width={8}
                    height={6}
                    rx={2}
                    fill="#2dd4bf"
                    className="shadow-[0_0_8px_#2dd4bf]"
                  />
                ))}

                {/* Pelvic Basin Outline */}
                <path
                  d="M 55 210 Q 75 195, 100 215 Q 125 195, 145 210 Q 135 245, 100 240 Q 65 245, 55 210 Z"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  opacity="0.6"
                />

                {/* Key Articular Joint Glow Nodes */}
                {/* Left Shoulder */}
                <circle cx="45" cy="76" r="6" fill="#2dd4bf" />
                <circle cx="45" cy="76" r="12" fill="url(#jointPointGlow)" />

                {/* Right Shoulder */}
                <circle cx="155" cy="76" r="6" fill="#2dd4bf" />
                <circle cx="155" cy="76" r="12" fill="url(#jointPointGlow)" />

                {/* Left Elbow */}
                <circle cx="35" cy="135" r="5" fill="#22d3ee" />

                {/* Right Elbow */}
                <circle cx="165" cy="135" r="5" fill="#22d3ee" />

                {/* Pelvis ASIS Joints */}
                <circle cx="68" cy="215" r="5.5" fill="#38bdf8" />
                <circle cx="132" cy="215" r="5.5" fill="#38bdf8" />
              </svg>
            </div>

            {/* CALLOUT PILLS (Exact reproduction from reference image) */}
            {/* Top-Left Callout: Shoulder Tilt: 0.8° */}
            <div className="absolute top-2 left-1 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg shadow-black/40 text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Shoulder Tilt:</span>
              <span className="text-teal-300 font-bold font-mono">0.8°</span>
            </div>

            {/* Middle-Left Callout: Symmetry: 94% */}
            <div className="absolute top-[40%] left-0 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg shadow-black/40 text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Symmetry:</span>
              <span className="text-teal-300 font-bold font-mono">94%</span>
            </div>

            {/* Bottom-Left Callout: Spine Alignment: Optimal */}
            <div className="absolute bottom-2 left-1 sm:left-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg shadow-black/40 text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Spine Alignment:</span>
              <span className="text-emerald-400 font-bold">Optimal</span>
            </div>

            {/* Top-Right Callout: Shoulder Tilt: 0.8° */}
            <div className="absolute top-2 right-1 sm:right-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg shadow-black/40 text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Shoulder Tilt:</span>
              <span className="text-teal-300 font-bold font-mono">0.8°</span>
            </div>

            {/* Middle-Right Callout: Spine Alignment: 100% */}
            <div className="absolute top-[40%] right-0 sm:right-2 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#091a2c]/85 border border-teal-500/35 backdrop-blur-md shadow-lg shadow-black/40 text-[11px] font-semibold text-slate-200">
              <span className="text-slate-400 block text-[10px]">Spine Alignment:</span>
              <span className="text-teal-300 font-bold font-mono">100%</span>
            </div>
          </div>

          {/* Bottom Action Pill */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Telemetry: Real-Time Coronal Vector</span>
            <button
              onClick={() => onNavigate('therapist-biomechanics')}
              className="px-3 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch Live Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BENTO ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 3: Patient Recovery Progress (Dual Charts: Wave Area + ROM Bars) (Spans 8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h2 className="text-base font-bold text-white tracking-tight">
                Patient Recovery Progress
              </h2>

              <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#081525] hover:bg-[#0c1e33] border border-slate-700/60 text-xs text-slate-300 font-medium transition">
                <span>More Results</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Dual Charts Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
              {/* Left Sub-chart: Smooth Wave Area Chart (Healing vs Motion) */}
              <div className="md:col-span-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Healing</span>
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

                {/* SVG Area Chart matching reference */}
                <div className="h-44 w-full relative flex items-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 260 140">
                    <defs>
                      <linearGradient id="healingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="motionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Grid Lines & Labels */}
                    {[
                      { y: 15, label: '100' },
                      { y: 45, label: '75' },
                      { y: 75, label: '50' },
                      { y: 105, label: '25' },
                      { y: 130, label: '0' },
                    ].map((g, idx) => (
                      <g key={idx}>
                        <text x="0" y={g.y + 3} fill="#64748b" fontSize="8" fontFamily="monospace">
                          {g.label}
                        </text>
                        <line x1="24" y1={g.y} x2="260" y2={g.y} stroke="#1e293b" strokeDasharray="2 3" />
                      </g>
                    ))}

                    {/* Motion Curve Area Fill */}
                    <path
                      d="M 28 130 Q 70 120, 100 80 T 170 65 T 230 45 L 255 35 L 255 130 Z"
                      fill="url(#motionGradient)"
                    />

                    {/* Healing Curve Area Fill */}
                    <path
                      d="M 28 130 Q 60 100, 100 90 T 160 70 T 210 50 L 255 20 L 255 130 Z"
                      fill="url(#healingGradient)"
                    />

                    {/* Motion Stroke Line (Teal) */}
                    <path
                      d="M 28 130 Q 70 120, 100 80 T 170 65 T 230 45 L 255 35"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2.2"
                    />

                    {/* Healing Stroke Line (Cyan) */}
                    <path
                      d="M 28 130 Q 60 100, 100 90 T 160 70 T 210 50 L 255 20"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                {/* X-Axis Months */}
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

              {/* Right Sub-chart: Range-of-Motion Dual Bar Chart */}
              <div className="md:col-span-6 space-y-2 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-6 pt-3 md:pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Range-of-Motion Metrics</span>
                  <span className="text-[10px] text-teal-400 font-mono font-semibold">+18% Flexion</span>
                </div>

                {/* Dual Vertical Bar Chart */}
                <div className="h-44 w-full relative flex items-end justify-between pl-6 pr-2 pb-1">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[8px] text-slate-500 font-mono">
                    <span>150</span>
                    <span>100</span>
                    <span>50</span>
                    <span>0</span>
                  </div>

                  {/* Monthly Bars */}
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
                        {/* Cyan Bar */}
                        <div
                          className="w-2 rounded-t bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.3)] transition-all hover:brightness-125"
                          style={{ height: `${(bar.h1 / 150) * 100}%` }}
                        />
                        {/* Teal Bar */}
                        <div
                          className="w-2 rounded-t bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.3)] transition-all hover:brightness-125"
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
            Clinical Adherence: <strong>92.4%</strong> • Recovery velocity exceeds standard protocol timeline
          </div>
        </div>

        {/* CARD 4: Rehab Plan Completion (Circular Progress Rings) (Spans 4 cols) */}
        {/* Exact match with reference image: Dual circular glowing rings (30% Movings, 90% Progress) */}
        <div className="lg:col-span-4 p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight pb-3 border-b border-slate-800/80">
              Rehab Plan Completion
            </h2>

            <p className="text-xs text-slate-400 mt-3 font-medium">Rehab Plan Completion</p>

            {/* Circular Rings Row */}
            <div className="grid grid-cols-2 gap-4 my-4 py-2">
              {/* Ring 1: 30% Movings */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#13273e"
                      strokeWidth="8"
                    />
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

              {/* Ring 2: 90% Progress */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#13273e"
                      strokeWidth="8"
                    />
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
            onClick={() => onNavigate('therapist-prescriptions')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500/25 to-cyan-400/20 hover:from-teal-500/35 hover:to-cyan-400/30 text-teal-300 border border-teal-400/40 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <FileSignature className="w-3.5 h-3.5" />
            <span>Customize 3-Day Protocols</span>
          </button>
        </div>
      </div>
    </div>
  );
};
