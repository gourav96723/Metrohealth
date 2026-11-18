import React, { useState, useEffect } from 'react';
import {
  FileText,
  Trash2,
  Eye,
  Filter,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Printer,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  X,
  Dumbbell,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { AssessmentRecord, AppointmentRecord } from '../types';
import { useAuth } from '../context/AuthContext';

interface HistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'assessments' | 'consultations'>('assessments');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Selected record for details modal
  const [viewRecord, setViewRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [selectedArea, user]);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssessments(selectedArea === 'all' ? undefined : selectedArea);
      setAssessments(data);

      if (user) {
        const apptData = await api.getMyAppointments();
        setAppointments(apptData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load clinical records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete Assessment #${id}? This clinical record will be removed.`
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await api.deleteAssessment(id);
      setAssessments(assessments.filter((a) => a.id !== id));
      if (viewRecord?.id === id) setViewRecord(null);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase mb-1">
              <FileText className="w-3 h-3 text-teal-400" />
              <span>Hospital Electronic Medical Record</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              My Clinical Records & History
            </h1>
            <p className="text-xs text-slate-400">
              Access and export your full timeline of AI posture evaluations and doctor consultations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-[#0c1626] hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>Print Clinical Record</span>
          </button>

          <button
            onClick={() => onNavigate('assessment')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition"
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'assessments'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Posture & Symptom Assessments ({assessments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'consultations'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-black shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Doctor Consultations ({appointments.length})</span>
        </button>
      </div>

      {activeTab === 'assessments' ? (
        <div className="space-y-6">
          {/* Region Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Area:</span>
            </span>
            {['all', 'neck', 'shoulder', 'upper_back', 'lower_back', 'hip', 'knee', 'ankle'].map(
              (area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                    selectedArea === area
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-[#0c1626] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {area.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="bg-[#0c1626]/85 rounded-3xl p-12 text-center border border-slate-800 text-slate-400">
              <div className="w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Retrieving hospital records...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="bg-[#0c1626]/85 rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Assessment Records Found</h3>
              <p className="text-xs text-slate-400">
                {selectedArea === 'all'
                  ? "You haven't completed any assessments yet."
                  : `No assessments recorded for ${selectedArea.replace('_', ' ')}.`}
              </p>
              <button
                onClick={() => onNavigate('assessment')}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Start Assessment
              </button>
            </div>
          ) : (
            <div className="bg-[#0c1626]/85 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-xl overflow-hidden">
              <div className="divide-y divide-slate-800/80">
                {assessments.map((record) => {
                  const m = record.movement_measurements?.[0];
                  return (
                    <div
                      key={record.id}
                      className="p-5 sm:p-6 hover:bg-[#0f1d33]/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{record.title}</h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              record.overall_risk_level === 'emergency'
                                ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                                : record.overall_risk_level === 'urgent_physician'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                : 'bg-teal-950/60 text-teal-300 border border-teal-500/40'
                            }`}
                          >
                            {record.overall_risk_level?.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span>
                            Date: <strong className="text-slate-200">{new Date(record.created_at).toLocaleDateString()}</strong>
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            Focus: <strong className="text-cyan-400">{record.body_area?.replace('_', ' ')}</strong>
                          </span>
                          {m?.symmetry_score !== undefined && (
                            <>
                              <span>•</span>
                              <span>
                                Symmetry: <strong className="text-teal-400">{m.symmetry_score}%</strong>
                              </span>
                            </>
                          )}
                          {record.educational_exercises?.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                Exercises: <strong className="text-white">{record.educational_exercises.length} prescribed</strong>
                              </span>
                            </>
                          )}
                        </div>

                        {record.summary && (
                          <p className="text-xs text-slate-300 line-clamp-1">{record.summary}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => setViewRecord(record)}
                          className="px-3.5 py-2 rounded-xl bg-[#060e1a] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>View Report</span>
                        </button>

                        <button
                          onClick={() => onNavigate('results', { assessmentId: record.id })}
                          className="px-3.5 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-cyan-300 border border-teal-500/30 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>Exercises</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Delete Assessment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Consultations Tab */
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-[#0c1626]/85 rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Doctor Consultations Scheduled</h3>
              <p className="text-xs text-slate-400">
                You haven't booked any physiotherapy appointments yet.
              </p>
              <button
                onClick={() => onNavigate('appointments')}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 rounded-xl text-xs font-bold"
              >
                Book Consultation
              </button>
            </div>
          ) : (
            <div className="bg-[#0c1626]/85 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-xl divide-y divide-slate-800/80">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{appt.provider_name}</h3>
                      <span className="text-xs text-teal-400 font-semibold">({appt.provider_specialty})</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          appt.status === 'confirmed'
                            ? 'bg-teal-950/60 text-teal-300 border border-teal-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {new Date(appt.appointment_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST • {appt.clinic_name} •{' '}
                      {appt.consultation_type === 'telehealth' ? 'Telehealth Video' : 'In-Person Hospital'}
                    </p>

                    {appt.reason && (
                      <p className="text-xs text-slate-300">Reason: {appt.reason}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('appointments')}
                    className="px-4 py-2 rounded-xl bg-[#060e1a] hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-bold transition self-start sm:self-center"
                  >
                    Manage / Reschedule
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Full Report Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c1626] max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto text-white">
            <button
              onClick={() => setViewRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                Official Clinical Summary
              </span>
              <h2 className="text-xl font-bold text-white mt-2">{viewRecord.title}</h2>
              <p className="text-xs text-slate-400">
                Recorded on {new Date(viewRecord.created_at).toLocaleString('en-IN')} IST • Patient:{' '}
                {user?.full_name}
              </p>
            </div>

            {/* Safety & Risk */}
            <div className="p-4 rounded-2xl bg-[#060e1a]/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Safety Referral Urgency</span>
                <span className="text-xs font-bold capitalize text-teal-400">
                  {viewRecord.overall_risk_level?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{viewRecord.summary}</p>
            </div>

            {/* Biomechanical measurements */}
            {viewRecord.movement_measurements?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Biomechanical Posture Observations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#060e1a]/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 block">Symmetry Score</span>
                    <span className="font-bold text-teal-400 text-sm">
                      {viewRecord.movement_measurements[0].symmetry_score ?? 'N/A'}%
                    </span>
                  </div>

                  <div className="p-3 bg-[#060e1a]/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 block">Shoulder Alignment</span>
                    <span className="font-bold text-white text-sm">
                      {viewRecord.movement_measurements[0].shoulder_alignment_deg ?? '0'}° tilt
                    </span>
                  </div>

                  <div className="p-3 bg-[#060e1a]/80 rounded-xl border border-slate-800 text-xs">
                    <span className="text-slate-400 block">Movement Type</span>
                    <span className="font-bold text-cyan-400 text-sm capitalize">
                      {viewRecord.movement_measurements[0].movement_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescribed Exercises */}
            {viewRecord.educational_exercises?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Prescribed 3-Day Exercises ({viewRecord.educational_exercises.length})
                </h4>
                <div className="space-y-2">
                  {viewRecord.educational_exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl bg-[#060e1a]/80 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white">{ex.name}</span>
                        <p className="text-[11px] text-slate-400">{ex.suggested_dosage}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                        {ex.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                <span>Print Document</span>
              </button>

              <button
                onClick={() => setViewRecord(null)}
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
