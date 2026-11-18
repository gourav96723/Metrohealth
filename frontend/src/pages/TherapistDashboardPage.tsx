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
  ArrowRight
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
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCallPatient = (token: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.token === token ? { ...p, status: 'in_consultation' } : p))
    );
  };

  const handleCompletePatient = (token: string) => {
    setQueue((prev) =>
      prev.map((p) => (p.token === token ? { ...p, status: 'completed' } : p))
    );
  };

  const filteredQueue = queue.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Clean Minimal Header (No bloated essay) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Doctor OPD Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {user?.full_name || 'Dr. Rajesh Sharma'} • {user?.license_number || 'MCI-84729-D'} • Room 304
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('therapist-biomechanics')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Webcam Assessment</span>
          </button>
          <button
            onClick={() => onNavigate('therapist-prescriptions')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <FileSignature className="w-3.5 h-3.5 text-cyan-400" />
            <span>Prescribe</span>
          </button>
        </div>
      </div>

      {/* Crisp KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-[#0b1626]/85 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Seen Today</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white">18</p>
          <p className="text-[10px] text-emerald-400 font-medium">+4 vs yesterday</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0b1626]/85 border border-cyan-500/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>In Queue</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <p className="text-xl font-bold text-amber-300">6</p>
          <p className="text-[10px] text-slate-400 font-medium">Avg wait: ~12m</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0b1626]/85 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>High-Risk Posture</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-bold text-rose-300">3</p>
          <p className="text-[10px] text-rose-400 font-medium">&gt;6° deviation</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0b1626]/85 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Active Protocols</span>
            <FileSignature className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-cyan-300">38</p>
          <p className="text-[10px] text-slate-400 font-medium">3-Day Regimens</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0b1626]/85 border border-slate-800 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Recovery Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-emerald-300">92.4%</p>
          <p className="text-[10px] text-emerald-400 font-medium">Top compliance</p>
        </div>
      </div>

      {/* Main Grid: Queue & Quick Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 8 Cols: OPD Queue */}
        <div className="lg:col-span-8 bg-[#0b1626]/85 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Live OPD Patient Queue</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                {queue.length} Total
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#070e1a] p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'waiting', 'in_consultation', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition text-[11px] font-semibold ${
                    activeTab === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Rows */}
          <div className="space-y-2.5">
            {filteredQueue.map((p) => (
              <div
                key={p.token}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  p.status === 'in_consultation'
                    ? 'bg-cyan-950/30 border-cyan-500/40 shadow-sm'
                    : p.status === 'completed'
                    ? 'bg-[#08101d]/60 border-slate-800/60 opacity-60'
                    : 'bg-[#091322] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {p.token}
                    </span>
                    <span className="text-xs font-bold text-white">{p.patient_name}</span>
                    <span className="text-[11px] text-slate-400">
                      ({p.age}y • {p.gender})
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        p.triage_priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {p.triage_priority}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 capitalize">
                      {p.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 truncate">{p.chief_complaint}</p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                    <span>
                      VAS: <strong className="text-slate-200">{p.severity_vas}/10</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Tilt: <strong className="text-cyan-300">{p.shoulder_tilt}</strong>
                    </span>
                    <span>•</span>
                    <span>Slot: {p.time_slot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.status === 'waiting' && (
                    <button
                      onClick={() => handleCallPatient(p.token)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Call</span>
                    </button>
                  )}

                  {p.status === 'in_consultation' && (
                    <button
                      onClick={() => handleCompletePatient(p.token)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('therapist-biomechanics')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium transition"
                    title="Live Webcam Scan"
                  >
                    Scan
                  </button>

                  <button
                    onClick={() => onNavigate('therapist-patients', { patientId: p.token })}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                  >
                    EMR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Alerts & Today's Schedule */}
        <div className="lg:col-span-4 space-y-5">
          {/* Triage Alert */}
          <div className="p-4 rounded-3xl bg-rose-950/30 border border-rose-500/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Posture Alerts</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#08101d] border border-rose-500/20 text-xs space-y-1">
              <div className="flex justify-between font-bold text-white">
                <span>Neha Gupta (34y)</span>
                <span className="text-rose-400 font-mono">9.4° Tilt</span>
              </div>
              <p className="text-[11px] text-slate-400">Lumbar-Pelvic Asymmetry • VAS 7/10</p>
              <button
                onClick={() => onNavigate('therapist-biomechanics')}
                className="text-[10px] text-cyan-400 hover:underline font-bold pt-1 block"
              >
                Launch Webcam Scan →
              </button>
            </div>
          </div>

          {/* Quick Schedule */}
          <div className="p-4 rounded-3xl bg-[#0b1626]/85 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Today's Schedule</span>
              <span className="text-cyan-400 font-mono text-[10px]">18 Nov</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#070e1a] border border-slate-800 flex justify-between">
                <div>
                  <p className="font-semibold text-white">Aarav Sharma</p>
                  <p className="text-[10px] text-slate-400">Cervical Follow-up</p>
                </div>
                <span className="font-mono text-cyan-400 text-[11px]">11:30 AM</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#070e1a] border border-slate-800 flex justify-between">
                <div>
                  <p className="font-semibold text-white">Vikram Malhotra</p>
                  <p className="text-[10px] text-slate-400">Knee Tracking Exam</p>
                </div>
                <span className="font-mono text-cyan-400 text-[11px]">12:15 PM</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('therapist-schedule')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition text-center"
            >
              Full Schedule →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
