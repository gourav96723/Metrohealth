import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Activity,
  FileSignature,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Eye,
  FileText,
  Phone,
  Mail,
  User,
  X,
  Stethoscope,
  TrendingUp,
  Clock
} from 'lucide-react';
import { api } from '../services/api';

interface TherapistPatientsPageProps {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export const TherapistPatientsPage: React.FC<TherapistPatientsPageProps> = ({ onNavigate, params }) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // New Doctor Note state in dossier modal
  const [newDoctorNote, setNewDoctorNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.getTherapistPatients();
        setPatients(data);
        if (params?.patientId) {
          const match = data.find((p: any) => String(p.id) === String(params.patientId) || p.full_name.includes(params.patientId));
          if (match) setSelectedPatient(match);
        }
      } catch (err) {
        console.error('Failed to load patient registry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [params]);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.primary_condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone_number?.includes(searchQuery);
    const matchesArea = selectedArea === 'all' || patient.body_area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const handleSaveNote = () => {
    if (!newDoctorNote.trim() || !selectedPatient) return;
    selectedPatient.doctor_notes = `${selectedPatient.doctor_notes} • [${new Date().toLocaleDateString('en-IN')}]: ${newDoctorNote}`;
    setNoteSaved(true);
    setNewDoctorNote('');
    setTimeout(() => setNoteSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Patient EMR Records
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {patients.length} active clinical patient dossiers with posture angle measurements
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onNavigate('therapist-prescriptions')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <FileSignature className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, condition, or mobile..."
            className="w-full pl-10 pr-4 py-2 bg-[#0c1f35]/80 border border-teal-500/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/60 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'neck', 'lower_back', 'knees', 'shoulders', 'upper_back'] as const).map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition ${
                selectedArea === area
                  ? 'bg-teal-500/25 text-teal-300 border border-teal-400/40 shadow-sm'
                  : 'bg-[#0c1f35]/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {area.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 hover:border-teal-400/40 backdrop-blur-xl shadow-xl transition-all space-y-4 flex flex-col justify-between group"
          >
            {/* Top Card Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500/30 to-cyan-500/20 border border-teal-500/40 text-teal-300 font-bold text-sm flex items-center justify-center shadow-md">
                    {patient.full_name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition">
                      {patient.full_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {patient.age}y • {patient.gender} • {patient.phone_number}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    patient.severity_vas >= 6
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : patient.severity_vas >= 4
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  VAS {patient.severity_vas}/10
                </span>
              </div>

              {/* Diagnosed Condition */}
              <div className="p-2.5 rounded-xl bg-[#081525] border border-slate-800/80 space-y-0.5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Diagnosis
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {patient.primary_condition}
                </div>
              </div>

              {/* Biomechanical Telemetry Mini Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-[#071322] border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Symmetry</span>
                  <span className="text-xs font-bold text-teal-300">{patient.posture_score}%</span>
                </div>
                <div className="p-2 rounded-xl bg-[#071322] border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Shoulder Tilt</span>
                  <span className="text-xs font-bold text-cyan-300">{patient.shoulder_alignment_deg}°</span>
                </div>
                <div className="p-2 rounded-xl bg-[#071322] border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">Spine Dev</span>
                  <span className="text-xs font-bold text-amber-300">{patient.spine_lateral_deg}°</span>
                </div>
              </div>

              {/* Rehab Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Protocol</span>
                  <span className="font-semibold text-teal-300">
                    Day {patient.rehab_day} of {patient.total_rehab_days} ({patient.adherence_rate})
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-[0_0_8px_#2dd4bf]"
                    style={{
                      width: `${(patient.rehab_day / patient.total_rehab_days) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">
                {patient.last_scan_date}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>
                <button
                  onClick={() =>
                    onNavigate('therapist-prescriptions', { patientName: patient.full_name })
                  }
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 transition"
                  title="Prescribe Exercise Protocol"
                >
                  <FileSignature className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PATIENT EMR DOSSIER MODAL ================= */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b1626] max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-black text-lg flex items-center justify-center">
                  {selectedPatient.full_name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedPatient.full_name}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      ID: MH-P{selectedPatient.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.phone_number} • {selectedPatient.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Biomechanical Telemetry Findings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Biomechanical Joint Kinematics Telemetry (MediaPipe 33-Point Vision)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-[#070e1a] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Symmetry Index</span>
                  <span className="text-lg font-black text-cyan-300">{selectedPatient.posture_score}%</span>
                  <span className="text-[9px] text-slate-500 block">Baseline: &gt;85%</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#070e1a] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Acromion Shoulder Tilt</span>
                  <span className="text-lg font-black text-teal-300">{selectedPatient.shoulder_alignment_deg}°</span>
                  <span className="text-[9px] text-slate-500 block">Baseline: &lt;2.5°</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#070e1a] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Spine Lateral Flexion</span>
                  <span className="text-lg font-black text-amber-300">{selectedPatient.spine_lateral_deg}°</span>
                  <span className="text-[9px] text-slate-500 block">Baseline: &lt;3.0°</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#070e1a] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Craniovertebral Angle</span>
                  <span className="text-lg font-black text-purple-300">{selectedPatient.craniovertebral_angle}°</span>
                  <span className="text-[9px] text-slate-500 block">Baseline: &gt;50°</span>
                </div>
              </div>
            </div>

            {/* Clinical Screening & Prescribed Regimen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#070e1a] border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Clinical Red Flags Status
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">
                    {selectedPatient.red_flags}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  No neurological compression, cardiovascular symptoms, or severe motor deficit observed. Safe for physical therapy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070e1a] border border-slate-800 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current 3-Day Exercise Protocol
                </div>
                <div className="text-xs font-semibold text-cyan-300">
                  {selectedPatient.prescribed_regimen}
                </div>
                <p className="text-[11px] text-slate-400">
                  Adherence: {selectedPatient.adherence_rate} • Next review scheduled in 2 days.
                </p>
              </div>
            </div>

            {/* Doctor's Previous Notes */}
            <div className="p-4 rounded-2xl bg-[#0e1b2e] border border-cyan-500/25 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Stethoscope className="w-4 h-4" />
                <span>Attending Specialist Clinical Notes</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedPatient.doctor_notes}
              </p>
            </div>

            {/* Add New Doctor Note */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Add Clinical Note / Progress Observation
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDoctorNote}
                  onChange={(e) => setNewDoctorNote(e.target.value)}
                  placeholder="e.g. Advised patient to maintain cervical retraction during seated computer work..."
                  className="flex-1 px-4 py-2.5 bg-[#070e1a] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 outline-none transition"
                />
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition active:scale-95"
                >
                  Save Note
                </button>
              </div>
              {noteSaved && (
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clinical note appended successfully!
                </p>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Close Dossier
              </button>

              <button
                onClick={() => {
                  const patientName = selectedPatient.full_name;
                  setSelectedPatient(null);
                  onNavigate('therapist-prescriptions', { patientName });
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 transition flex items-center gap-2"
              >
                <FileSignature className="w-4 h-4" />
                <span>Adjust Exercise Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
