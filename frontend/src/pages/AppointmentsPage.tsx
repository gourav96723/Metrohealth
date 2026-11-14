import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Star,
  MapPin,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Video,
  Building,
  RotateCcw,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ProviderInfo, AppointmentRecord } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppointmentsPageProps {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ onNavigate, params }) => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [myAppointments, setMyAppointments] = useState<AppointmentRecord[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderInfo | null>(null);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [consultationType, setConsultationType] = useState<string>('telehealth');
  const [reason, setReason] = useState<string>(params?.reason || '');
  const [notes, setNotes] = useState<string>('');

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Rescheduling Modal State
  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentRecord | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('');
  const [rescheduleLoading, setRescheduleLoading] = useState<boolean>(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  useEffect(() => {
    loadProvidersAndBookings();
  }, [user]);

  const loadProvidersAndBookings = async () => {
    try {
      const provData = await api.getProviders();
      setProviders(provData);

      if (provData.length > 0) {
        if (params?.doctorName) {
          const match = provData.find((p) => p.name.includes(params.doctorName.split(' ')[1]));
          setSelectedProvider(match || provData[0]);
        } else {
          setSelectedProvider(provData[0]);
        }
      }

      if (user) {
        const apptData = await api.getMyAppointments();
        setMyAppointments(apptData);
      }
    } catch (err) {
      console.error('Failed to load appointments data:', err);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in or register to schedule an appointment.');
      onNavigate('login');
      return;
    }
    if (!selectedProvider || !selectedDate || !selectedSlot) {
      setBookingError('Please choose a date and time slot.');
      return;
    }

    setBookingError(null);
    setLoading(true);
    try {
      const dateTimeStr = `${selectedDate}T${selectedSlot}:00Z`;
      const newAppt = await api.bookAppointment({
        provider_name: selectedProvider.name,
        provider_specialty: selectedProvider.specialty,
        clinic_name: selectedProvider.clinic,
        appointment_time: dateTimeStr,
        consultation_type: consultationType,
        reason: reason || 'Posture and movement consultation',
        notes: notes || undefined,
      });

      setBookingSuccess(true);
      setMyAppointments([newAppt, ...myAppointments]);
      setReason('');
      setNotes('');
    } catch (err: any) {
      setBookingError(err.message || 'Appointment booking failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this hospital appointment?')) return;
    try {
      const updated = await api.cancelAppointment(id);
      setMyAppointments(myAppointments.map((a) => (a.id === id ? updated : a)));
    } catch (err: any) {
      alert(`Cancellation failed: ${err.message}`);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppt || !rescheduleDate || !rescheduleSlot) {
      setRescheduleError('Please choose a new date and time slot.');
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError(null);
    try {
      const newDateTimeStr = `${rescheduleDate}T${rescheduleSlot}:00Z`;
      const updated = await api.rescheduleAppointment(
        reschedulingAppt.id,
        newDateTimeStr,
        'Patient requested time adjustment'
      );

      setMyAppointments(
        myAppointments.map((a) => (a.id === reschedulingAppt.id ? updated : a))
      );
      setReschedulingAppt(null);
      alert('Appointment successfully rescheduled.');
    } catch (err: any) {
      setRescheduleError(err.message || 'Rescheduling failed. The slot may be already taken.');
    } finally {
      setRescheduleLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>MetroHealth Clinical Scheduling</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Schedule Physiotherapy & Posture Consultation
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Connect with certified physiotherapy specialists and orthopedic consultants. Your AI assessment
              history, posture measurements, and exercise progress are pre-synced to your consultation.
            </p>
          </div>

          <button
            onClick={() => onNavigate('consultants')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>View Doctor Profiles</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Providers & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Providers List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Specialist
            </h3>
            <span className="text-[11px] text-teal-700 font-semibold">
              {providers.length} Available
            </span>
          </div>

          <div className="space-y-3">
            {providers.map((prov) => (
              <div
                key={prov.id}
                onClick={() => {
                  setSelectedProvider(prov);
                  setBookingSuccess(false);
                  setBookingError(null);
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedProvider?.id === prov.id
                    ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200/90 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{prov.name}</h4>
                    <span className="text-xs text-teal-700 font-semibold block">{prov.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{prov.rating}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prov.clinic}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Days: {prov.available_days.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Booking Form & Slots */}
        <div className="lg:col-span-2">
          {selectedProvider ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs text-teal-700 font-semibold block">Schedule Consultation with</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedProvider.name}</h3>
                <p className="text-xs text-slate-500">{selectedProvider.clinic}</p>
              </div>

              {bookingSuccess && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span>
                    Appointment successfully scheduled! A confirmation has been registered to your portal records.
                  </span>
                </div>
              )}

              {bookingError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                {/* Consultation Mode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Consultation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultationType('telehealth')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        consultationType === 'telehealth'
                          ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Video className="w-4 h-4 text-teal-600" />
                      <span>Telehealth Video Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationType('in_person')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                        consultationType === 'in_person'
                          ? 'border-teal-500 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Building className="w-4 h-4 text-cyan-600" />
                      <span>In-Person Hospital Clinic</span>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Select Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Time Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.time_slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            selectedSlot === slot
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reason & Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reason for Consultation (Optional)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Neck stiffness and follow-up on 3-day exercise plan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedSlot}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition disabled:bg-slate-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{loading ? 'Confirming Appointment...' : 'Confirm Hospital Appointment'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-xs text-slate-400">
              <span>Select a healthcare specialist on the left to schedule an appointment.</span>
            </div>
          )}
        </div>
      </div>

      {/* User's Existing Appointments with Reschedule */}
      {user && myAppointments.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Your Scheduled Consultations
            </h3>
            <span className="text-xs text-slate-500">{myAppointments.length} Active Records</span>
          </div>

          <div className="divide-y divide-slate-100">
            {myAppointments.map((appt) => (
              <div
                key={appt.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{appt.provider_name}</span>
                    <span className="text-slate-500">({appt.provider_specialty})</span>
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
                  <div className="text-slate-500 text-[11px] mt-1">
                    {new Date(appt.appointment_time).toLocaleString()} • {appt.clinic_name} • Mode:{' '}
                    {appt.consultation_type}
                  </div>
                  {appt.reason && (
                    <p className="text-[11px] text-slate-600 mt-0.5">Reason: {appt.reason}</p>
                  )}
                </div>

                {appt.status === 'confirmed' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setReschedulingAppt(appt);
                        setRescheduleDate(appt.appointment_time.split('T')[0]);
                        setRescheduleSlot('10:00');
                        setRescheduleError(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setReschedulingAppt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-slate-900">Reschedule Consultation</h3>
              <p className="text-xs text-slate-500">
                Updating appointment with {reschedulingAppt.provider_name}
              </p>
            </div>

            {rescheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose New Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select New Time Slot
                </label>
                <div className="flex flex-wrap gap-2">
                  {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleSlot(slot)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                        rescheduleSlot === slot
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingAppt(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Keep Existing
                </button>
                <button
                  type="submit"
                  disabled={rescheduleLoading || !rescheduleDate || !rescheduleSlot}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition disabled:bg-slate-300"
                >
                  {rescheduleLoading ? 'Updating...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
