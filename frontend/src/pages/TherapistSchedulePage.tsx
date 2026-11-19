import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  User,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileSignature,
  Eye,
  X,
  Mic,
  MicOff,
  VideoOff,
  Stethoscope,
  Activity
} from 'lucide-react';

interface ConsultationSlot {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  timeSlot: string;
  type: 'Telehealth Video Consult' | 'In-Clinic Biomechanical Exam' | 'Post-Op Follow-up';
  chiefComplaint: string;
  status: 'waiting' | 'in_consultation' | 'confirmed' | 'completed';
  roomUrl?: string;
}

const INITIAL_SCHEDULE: ConsultationSlot[] = [
  {
    id: 'C-01',
    patientName: 'Aarav Sharma',
    age: 28,
    gender: 'Male',
    phone: '+91 96537 66889',
    timeSlot: '09:30 AM',
    type: 'Telehealth Video Consult',
    chiefComplaint: 'Cervical Spine Stiffness & Ergonomic Review',
    status: 'completed',
  },
  {
    id: 'C-02',
    patientName: 'Neha Gupta',
    age: 34,
    gender: 'Female',
    phone: '+91 98112 34567',
    timeSlot: '10:00 AM',
    type: 'In-Clinic Biomechanical Exam',
    chiefComplaint: 'Acute Lumbar-Pelvic Asymmetry (L4-L5 Strain)',
    status: 'in_consultation',
  },
  {
    id: 'C-03',
    patientName: 'Vikram Malhotra',
    age: 45,
    gender: 'Male',
    phone: '+91 99201 88341',
    timeSlot: '10:30 AM',
    type: 'In-Clinic Biomechanical Exam',
    chiefComplaint: 'Patellofemoral Knee Tracking & Extension Deficit',
    status: 'waiting',
  },
  {
    id: 'C-04',
    patientName: 'Priya Patel',
    age: 29,
    gender: 'Female',
    phone: '+91 97234 11098',
    timeSlot: '11:00 AM',
    type: 'Telehealth Video Consult',
    chiefComplaint: 'Thoracic Kyphosis & Scapular Dyskinesis',
    status: 'confirmed',
  },
  {
    id: 'C-05',
    patientName: 'Rohan Verma',
    age: 52,
    gender: 'Male',
    phone: '+91 98450 77213',
    timeSlot: '11:30 AM',
    type: 'Telehealth Video Consult',
    chiefComplaint: 'Right Rotator Cuff Impingement & Night Pain',
    status: 'confirmed',
  },
  {
    id: 'C-06',
    patientName: 'Ananya Mukherjee',
    age: 31,
    gender: 'Female',
    phone: '+91 98300 45678',
    timeSlot: '12:00 PM',
    type: 'Post-Op Follow-up',
    chiefComplaint: 'Bilateral Ankle Pronation & Achilles Tendon Protocol',
    status: 'confirmed',
  },
];

export const TherapistSchedulePage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [schedule, setSchedule] = useState<ConsultationSlot[]>(INITIAL_SCHEDULE);
  const [activeVideoCall, setActiveVideoCall] = useState<ConsultationSlot | null>(null);
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [liveConsultNotes, setLiveConsultNotes] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Consultations & Telehealth Schedule
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Active OPD sessions and encrypted telehealth video consultations
          </p>
        </div>

        <button
          onClick={() => onNavigate('therapist-dashboard')}
          className="px-3.5 py-1.5 rounded-xl bg-[#0c1f35] hover:bg-[#122b49] text-teal-300 text-xs font-semibold border border-teal-500/25 transition self-start sm:self-auto"
        >
          Return to Dashboard
        </button>
      </div>

      {/* Consultations List */}
      <div className="space-y-3.5">
        {schedule.map((slot) => {
          const isTelehealth = slot.type.includes('Telehealth');
          return (
            <div
              key={slot.id}
              className={`p-4 sm:p-5 rounded-[18px] border transition-all ${
                slot.status === 'in_consultation'
                  ? 'bg-[#0c1f35]/90 border-teal-500/50 shadow-xl'
                  : slot.status === 'completed'
                  ? 'bg-[#081525]/60 border-slate-800/60 opacity-70'
                  : 'bg-[#0c1f35]/70 border-teal-500/20 hover:border-teal-400/35'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Time & Type Indicator */}
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#08101d] border border-slate-700/80 text-center min-w-[90px]">
                    <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-white font-mono block">
                      {slot.timeSlot}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">IST</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white">{slot.patientName}</h3>
                      <span className="text-xs text-slate-400">
                        ({slot.age}y • {slot.gender})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isTelehealth
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {slot.type}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          slot.status === 'in_consultation'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                            : slot.status === 'completed'
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : slot.status === 'waiting'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {slot.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      Chief Complaint: <span className="text-slate-100">{slot.chiefComplaint}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">Mobile: {slot.phone}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isTelehealth && slot.status !== 'completed' && (
                    <button
                      onClick={() => setActiveVideoCall(slot)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Video Consult</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('therapist-patients', { patientId: slot.patientName })}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>EMR History</span>
                  </button>

                  <button
                    onClick={() =>
                      onNavigate('therapist-prescriptions', { patientName: slot.patientName })
                    }
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Prescribe</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= TELEHEALTH VIDEO CONSULT MODAL ================= */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08101d] max-w-4xl w-full rounded-3xl border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col text-white max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#0c1626] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-sm font-bold">
                  Telehealth Live: {activeVideoCall.patientName} ({activeVideoCall.timeSlot})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  AES-256 Encrypted
                </span>
              </div>

              <button
                onClick={() => setActiveVideoCall(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Simulation Canvas & Telemetry HUD */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto">
              {/* Left 2 Cols: Main Video Screen */}
              <div className="lg:col-span-2 relative aspect-video bg-[#040810] rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-black text-2xl flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/30">
                    {activeVideoCall.patientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeVideoCall.patientName}</h3>
                    <p className="text-xs text-slate-400 font-mono">Patient Camera Active • HD 1080p</p>
                  </div>
                </div>

                {/* Overlaid Live Posture Kinematics HUD */}
                <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono space-y-1">
                  <p className="text-cyan-300 font-bold flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    LIVE SKELETAL ANGLES
                  </p>
                  <p className="text-slate-300">Shoulder Tilt: 2.4° (Balanced)</p>
                  <p className="text-slate-300">Cervical Tilt: 12.8° (Forward)</p>
                  <p className="text-slate-300">Spine Flexion: 1.8°</p>
                </div>

                {/* Floating Doctor Preview Window */}
                <div className="absolute bottom-3 right-3 w-28 h-20 bg-[#0d182b] rounded-xl border border-cyan-500/40 p-1 flex items-center justify-center shadow-lg">
                  <span className="text-[9px] text-cyan-300 font-bold text-center">Dr. Rajesh (You)</span>
                </div>
              </div>

              {/* Right 1 Col: Live Doctor Consultation Notes */}
              <div className="p-4 rounded-2xl bg-[#0c1626] border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-time Clinical Notes</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Record observations while evaluating patient's movement screen live:
                  </p>
                  <textarea
                    value={liveConsultNotes}
                    onChange={(e) => setLiveConsultNotes(e.target.value)}
                    rows={6}
                    placeholder="Patient demonstrated restricted cervical rotation to the right by 15°..."
                    className="w-full p-2.5 bg-[#080d1a] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-400 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onNavigate('therapist-prescriptions', { patientName: activeVideoCall.patientName });
                      setActiveVideoCall(null);
                    }}
                    className="w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Prescribe Protocol</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-[#0a1220] border-t border-slate-800 flex items-center justify-center gap-4">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3 rounded-full transition ${
                  micMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Toggle Microphone"
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCamOff(!camOff)}
                className={`p-3 rounded-full transition ${
                  camOff ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title="Toggle Camera"
              >
                {camOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveVideoCall(null)}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition"
              >
                End Consultation Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
