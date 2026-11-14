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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase mb-1">
              <FileText className="w-3 h-3 text-teal-600" />
              <span>Hospital Electronic Medical Record</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              My Clinical Records & History
            </h1>
            <p className="text-xs text-slate-500">
              Access and export your full timeline of AI posture evaluations and doctor consultations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Clinical Record</span>
          </button>

          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition"
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'assessments'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Posture & Symptom Assessments ({assessments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'consultations'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
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
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Area:</span>
            </span>
            {['all', 'neck', 'shoulder', 'upper_back', 'lower_back', 'hip', 'knee', 'ankle'].map(
              (area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition ${
                    selectedArea === area
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {area.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 text-slate-500">
              <div className="w-7 h-7 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold">Retrieving hospital records...</p>
            </div>
          ) : assessments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 max-w-md mx-auto space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Assessment Records Found</h3>
              <p className="text-xs text-slate-500">
                {selectedArea === 'all'
                  ? "You haven't completed any assessments yet."
                  : `No assessments recorded for ${selectedArea.replace('_', ' ')}.`}
              </p>
              <button
                onClick={() => onNavigate('assessment')}
                className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Start Assessment
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="divide-y divide-slate-100">
                {assessments.map((record) => {
                  const m = record.movement_measurements?.[0];
                  return (
                    <div
                      key={record.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{record.title}</h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              record.overall_risk_level === 'emergency'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : record.overall_risk_level === 'urgent_physician'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-teal-50 text-teal-800 border border-teal-200'
                            }`}
                          >
                            {record.overall_risk_level?.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>
                            Date: <strong>{new Date(record.created_at).toLocaleDateString()}</strong>
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            Focus: <strong>{record.body_area?.replace('_', ' ')}</strong>
                          </span>
                          {m?.symmetry_score !== undefined && (
                            <>
                              <span>•</span>
                              <span>
                                Symmetry: <strong className="text-teal-700">{m.symmetry_score}%</strong>
                              </span>
                            </>
                          )}
                          {record.educational_exercises?.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                Exercises: <strong>{record.educational_exercises.length} prescribed</strong>
                              </span>
                            </>
                          )}
                        </div>

                        {record.summary && (
                          <p className="text-xs text-slate-600 line-clamp-1">{record.summary}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          onClick={() => setViewRecord(record)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>

                        <button
                          onClick={() => onNavigate('results', { assessmentId: record.id })}
                          className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>Exercises</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deletingId === record.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 max-w-md mx-auto space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Doctor Consultations Scheduled</h3>
              <p className="text-xs text-slate-500">
                You haven't booked any physiotherapy appointments yet.
              </p>
              <button
                onClick={() => onNavigate('appointments')}
                className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Book Consultation
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-100">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{appt.provider_name}</h3>
                      <span className="text-xs text-teal-700 font-semibold">({appt.provider_specialty})</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          appt.status === 'confirmed'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      {new Date(appt.appointment_time).toLocaleString()} • {appt.clinic_name} •{' '}
                      {appt.consultation_type === 'telehealth' ? 'Telehealth Video' : 'In-Person Clinic'}
                    </p>

                    {appt.reason && (
                      <p className="text-xs text-slate-600">Reason: {appt.reason}</p>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('appointments')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition self-start sm:self-center"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Official Clinical Summary
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{viewRecord.title}</h2>
              <p className="text-xs text-slate-500">
                Recorded on {new Date(viewRecord.created_at).toLocaleString()} • Patient:{' '}
                {user?.full_name}
              </p>
            </div>

            {/* Safety & Risk */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Safety Referral Urgency</span>
                <span className="text-xs font-bold capitalize text-teal-700">
                  {viewRecord.overall_risk_level?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{viewRecord.summary}</p>
            </div>

            {/* Biomechanical measurements */}
            {viewRecord.movement_measurements?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Biomechanical Posture Observations
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-500 block">Symmetry Score</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {viewRecord.movement_measurements[0].symmetry_score ?? 'N/A'}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-500 block">Shoulder Alignment</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {viewRecord.movement_measurements[0].shoulder_alignment_deg ?? '0'}° tilt
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-500 block">Movement Type</span>
                    <span className="font-bold text-slate-900 text-sm capitalize">
                      {viewRecord.movement_measurements[0].movement_type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescribed Exercises */}
            {viewRecord.educational_exercises?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prescribed 3-Day Exercises ({viewRecord.educational_exercises.length})
                </h4>
                <div className="space-y-2">
                  {viewRecord.educational_exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 rounded-xl bg-teal-50/50 border border-teal-200/60 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{ex.name}</span>
                        <p className="text-[11px] text-slate-500">{ex.suggested_dosage}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
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
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>

              <button
                onClick={() => setViewRecord(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
