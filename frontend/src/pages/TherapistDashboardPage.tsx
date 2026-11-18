import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  FileSignature,
  Video,
  Eye,
  TrendingUp,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Search,
  Filter,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface TherapistDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const TherapistDashboardPage: React.FC<TherapistDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'waiting' | 'in_consultation' | 'completed'>('all');
  const [currentCallingToken, setCurrentCallingToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, queueData] = await Promise.all([
          api.getTherapistStats(),
          api.getTherapistQueue(),
        ]);
        setStats(statsData);
        setQueue(queueData);
      } catch (err) {
        console.error('Failed to load therapist dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCallPatient = (token: string, patientName: string) => {
    setCurrentCallingToken(token);
    // Update queue status locally
    setQueue((prev) =>
      prev.map((p) =>
        p.token === token ? { ...p, status: 'in_consultation' } : p
      )
    );
  };

  const handleCompletePatient = (token: string) => {
    setQueue((prev) =>
      prev.map((p) =>
        p.token === token ? { ...p, status: 'completed' } : p
      )
    );
    if (currentCallingToken === token) {
      setCurrentCallingToken(null);
    }
  };

  const filteredQueue = queue.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Top Banner: Doctor Credentials & Clinical Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0c1a2e] via-[#091526] to-[#07111e] border border-cyan-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              <span>Attending Specialist Station</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good Morning, {user?.full_name || 'Dr. Rajesh Sharma, MS (Ortho)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {user?.specialization || 'Chief Orthopaedic & Sports Physical Rehabilitation Specialist'} •{' '}
              <span className="text-cyan-300 font-mono">Reg: {user?.license_number || 'MCI-84729-D'}</span> •{' '}
              {user?.clinic_hospital || 'MetroHealth Super Speciality Hospital, New Delhi'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('therapist-prescriptions')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
            >
              <FileSignature className="w-4 h-4" />
              <span>Write Digital Prescription</span>
            </button>
            <button
              onClick={() => onNavigate('therapist-biomechanics')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Biomechanics Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-slate-800/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Patients Seen Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">18</span>
            <span className="text-[11px] text-emerald-400 font-semibold">+4 vs yesterday</span>
          </div>
          <p className="text-[10px] text-slate-500">Morning Shift (09:00 - 14:00)</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-cyan-500/30 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Waiting in OPD</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-300">6</span>
            <span className="text-[11px] text-amber-400 font-semibold">Live Queue</span>
          </div>
          <p className="text-[10px] text-slate-500">Avg wait: ~12 mins</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-slate-800/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High-Risk Posture Triage</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-300">3</span>
            <span className="text-[11px] text-rose-400 font-semibold">&gt;6° deviation</span>
          </div>
          <p className="text-[10px] text-slate-500">Requires clinical review</p>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-slate-800/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Rehab Plans</span>
            <FileSignature className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-300">38</span>
            <span className="text-[11px] text-cyan-400 font-semibold">3-Day Protocols</span>
          </div>
          <p className="text-[10px] text-slate-500">Tracked via client AI</p>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-slate-800/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Recovery Adherence</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-300">92.4%</span>
            <span className="text-[11px] text-emerald-400 font-semibold">Top 5%</span>
          </div>
          <p className="text-[10px] text-slate-500">Based on patient check-ins</p>
        </div>
      </div>

      {/* Main Grid: Live OPD Queue & Clinical Triage Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Today's Live OPD Queue */}
        <div className="lg:col-span-8 bg-[#0b1626]/85 border border-slate-800/80 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Live OPD Patient Queue
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {queue.length} Total Registered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time patient check-ins, biomechanical scan status & pain severity triage
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#070e1a] p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'waiting', 'in_consultation', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition text-[11px] font-semibold ${
                    activeTab === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Items List */}
          <div className="space-y-3">
            {filteredQueue.map((patient) => {
              const isCalling = currentCallingToken === patient.token;
              return (
                <div
                  key={patient.token}
                  className={`p-4 rounded-2xl border transition-all ${
                    patient.status === 'in_consultation'
                      ? 'bg-gradient-to-r from-cyan-950/40 to-[#0e1d33] border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : patient.status === 'completed'
                      ? 'bg-[#08111e]/60 border-slate-800/60 opacity-70'
                      : 'bg-[#091322] border-slate-800/80 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Patient Overview */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {patient.token}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">
                          {patient.patient_name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          ({patient.age}y • {patient.gender})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            patient.triage_priority === 'High'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : patient.triage_priority === 'Moderate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {patient.triage_priority} Triage
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            patient.status === 'in_consultation'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                              : patient.status === 'completed'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {patient.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        Chief Complaint: <span className="text-slate-100">{patient.chief_complaint}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
                        <span>
                          VAS Pain:{' '}
                          <strong className={patient.severity_vas >= 6 ? 'text-rose-400' : 'text-amber-400'}>
                            {patient.severity_vas}/10
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Posture Score: <strong className="text-cyan-300">{patient.posture_score}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Shoulder Tilt: <strong className="text-teal-300">{patient.shoulder_tilt}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">Slot: {patient.time_slot}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {patient.status === 'waiting' && (
                        <button
                          onClick={() => handleCallPatient(patient.token, patient.patient_name)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Call Patient</span>
                        </button>
                      )}

                      {patient.status === 'in_consultation' && (
                        <button
                          onClick={() => handleCompletePatient(patient.token)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      )}

                      <button
                        onClick={() => onNavigate('therapist-patients', { patientId: patient.token })}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>EMR</span>
                      </button>

                      <button
                        onClick={() => onNavigate('therapist-prescriptions', { patientName: patient.patient_name })}
                        className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-teal-400 hover:text-teal-300 border border-slate-700 transition"
                        title="Prescribe Exercises"
                      >
                        <FileSignature className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Triage Alerts & Today's Clinical Schedule */}
        <div className="lg:col-span-4 space-y-6">
          {/* High-Risk Biomechanical Triage Alert Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#180f1d] to-[#0f0a14] border border-rose-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Biomechanical Triage Alerts</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Automated computer-vision scans flagged <strong>2 patients</strong> with high asymmetrical lateral spine tilt (&gt;6°) and acute lumbar loading.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Neha Gupta (34y, F)</span>
                  <span className="text-rose-400 font-mono">9.4° Tilt</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Lumbar-Pelvic Asymmetry • VAS 7/10 • L4-L5 Compression risk
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onNavigate('therapist-biomechanics')}
                    className="text-[10px] text-rose-300 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View Spine Angle Scan</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Rohan Verma (52y, M)</span>
                  <span className="text-amber-400 font-mono">8.4° Tilt</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Rotator Cuff Impingement • Right Shoulder Elevation
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => onNavigate('therapist-biomechanics')}
                    className="text-[10px] text-amber-300 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View Shoulder Scan</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Doctor Consultation Schedule */}
          <div className="p-5 rounded-3xl bg-[#0b1626]/85 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Today's Schedule</h4>
              </div>
              <span className="text-[11px] text-cyan-300 font-mono">18 Nov 2026</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#08111e] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Telehealth Video Consult</p>
                  <p className="text-[10px] text-slate-400">Aarav Sharma • Cervical Review</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-cyan-400 font-bold">11:30 AM</span>
                  <span className="block text-[9px] text-emerald-400">Confirmed</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08111e] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">In-Clinic Biomechanical Exam</p>
                  <p className="text-[10px] text-slate-400">Vikram Malhotra • Knee Tracking</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-cyan-400 font-bold">12:15 PM</span>
                  <span className="block text-[9px] text-amber-400">Waiting in OPD</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08111e] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Post-Op Mobility Assessment</p>
                  <p className="text-[10px] text-slate-400">Priya Patel • Scapular Rehab</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-cyan-400 font-bold">01:00 PM</span>
                  <span className="block text-[9px] text-slate-500">Upcoming</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('therapist-schedule')}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700 text-xs font-semibold transition text-center flex items-center justify-center gap-1.5"
            >
              <span>View Full Clinical Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
