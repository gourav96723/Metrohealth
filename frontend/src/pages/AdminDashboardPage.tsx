import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Calendar,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Dumbbell,
  Building,
  Phone,
  Mail,
  User,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'patients' | 'staff'>('patients');
  const [stats, setStats] = useState<any>({
    hospital_name: 'MetroHealth Super Speciality Hospital, New Delhi',
    total_patients: 0,
    total_staff: 3,
    total_appointments: 0,
    total_assessments: 0,
    exercise_only_patients_count: 0,
    active_clinical_doctors_count: 3
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientFilter, setPatientFilter] = useState<'all' | 'booked' | 'exercise_only'>('all');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, patientsData, staffData] = await Promise.all([
          api.getAdminStats(),
          api.getAdminPatients(),
          api.getAdminStaff()
        ]);
        if (statsData) setStats(statsData);
        if (patientsData) setPatients(patientsData);
        if (staffData) setStaff(staffData);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone_number?.includes(searchQuery);

    const isBooked = p.status?.includes('Booked');
    if (patientFilter === 'booked') return matchesSearch && isBooked;
    if (patientFilter === 'exercise_only') return matchesSearch && !isBooked;
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Hospital Administration Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            MetroHealth Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
            <Building className="w-3.5 h-3.5 text-teal-400" />
            <span>MetroHealth Super Speciality Hospital, New Delhi • Central Patient & Staff Directory</span>
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="p-1 rounded-2xl bg-[#081525] border border-slate-700/80 inline-flex self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'patients'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Patients ({patients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Medical Doctors (3)</span>
          </button>
        </div>
      </div>

      {/* ================= 4 METRIC BENTO CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Patients */}
        <div className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Total Registered Patients</p>
            <p className="text-2xl sm:text-3xl font-black text-white">{stats.total_patients}</p>
            <p className="text-[11px] text-teal-400 font-mono">Real Patient Database</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Hospital Doctors */}
        <div className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Hospital Active Doctors</p>
            <p className="text-2xl sm:text-3xl font-black text-cyan-300">3</p>
            <p className="text-[11px] text-cyan-400 font-mono">Specialist Faculty</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Doctor Bookings */}
        <div className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">OPD & Telehealth Bookings</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-300">{stats.total_appointments}</p>
            <p className="text-[11px] text-emerald-400 font-mono">Confirmed Consultations</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Self-Care / Exercise Only Users */}
        <div className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">Self-Care Exercise Users</p>
            <p className="text-2xl sm:text-3xl font-black text-purple-300">{stats.exercise_only_patients_count}</p>
            <p className="text-[11px] text-purple-400 font-mono">3-Day Regimen (No Doctor)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ================= TAB 1: ALL PATIENTS REGISTRY ================= */}
      {activeTab === 'patients' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#0c1f35]/70 border border-teal-500/20 backdrop-blur-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, email, phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#081525] border border-slate-700/80 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
              <button
                onClick={() => setPatientFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  patientFilter === 'all'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-white bg-[#081525]'
                }`}
              >
                All Patients ({patients.length})
              </button>
              <button
                onClick={() => setPatientFilter('booked')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  patientFilter === 'booked'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white bg-[#081525]'
                }`}
              >
                Booked with Doctor
              </button>
              <button
                onClick={() => setPatientFilter('exercise_only')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  patientFilter === 'exercise_only'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white bg-[#081525]'
                }`}
              >
                3-Day Exercise Only
              </button>
            </div>
          </div>

          {/* Patients Table / Empty State */}
          {filteredPatients.length === 0 ? (
            <div className="py-20 p-8 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No Registered Patients Yet</h3>
              <p className="text-xs text-slate-400 max-w-md">
                As real patients register on the portal or start their 3-day recovery routine, their records will automatically appear here with full clinical activity tracking.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-[18px] bg-[#0c1f35]/75 border border-teal-500/20 backdrop-blur-xl shadow-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-medium border-b border-slate-800/80">
                    <th className="py-3 font-normal">Patient Name & Contact</th>
                    <th className="py-3 font-normal">Registered On</th>
                    <th className="py-3 font-normal">Concern / Pain Area</th>
                    <th className="py-3 font-normal">Scans</th>
                    <th className="py-3 font-normal">Care Status</th>
                    <th className="py-3 font-normal">Assigned Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 font-medium">
                  {filteredPatients.map((p) => {
                    const isBooked = p.status?.includes('Booked');

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition group">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500/30 to-cyan-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {p.full_name
                                ? p.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                                : 'PT'}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-teal-300 transition">
                                {p.full_name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {p.email} • {p.phone_number}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 text-slate-300 font-mono text-[11px]">
                          {p.registered_date}
                        </td>

                        <td className="py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/30 text-[10px] font-semibold capitalize">
                            {p.latest_area}
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-300 font-mono text-center">
                          {p.assessments_count}
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isBooked
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.15)]'
                                : 'bg-purple-500/15 text-purple-300 border border-purple-500/40'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isBooked ? 'bg-emerald-400' : 'bg-purple-400'
                              }`}
                            />
                            <span>{isBooked ? 'Booked Consultation' : '3-Day Exercise Only'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-300 font-medium">
                          {p.booked_doctors?.join(', ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: HOSPITAL MEDICAL STAFF ================= */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/25 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-white">MetroHealth Super Speciality Hospital, New Delhi</h3>
                <p className="text-xs text-slate-400">Department of Physical Rehabilitation, Spine & Sports Medicine Faculty</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              3 Active Specialists
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {staff.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-6 rounded-[20px] bg-[#0c1f35]/75 border border-teal-500/20 hover:border-teal-400/40 backdrop-blur-xl shadow-xl transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-cyan-500/25">
                      {doc.full_name
                        .replace('Dr.', '')
                        .trim()
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {doc.full_name}
                      </h3>
                      <p className="text-xs text-teal-300 font-medium">
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  {/* Hospital Info & License */}
                  <div className="p-3 rounded-xl bg-[#081525] border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Hospital:</span>
                      <span className="text-white font-medium text-right text-[11px]">
                        MetroHealth Hospital, New Delhi
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>License ID:</span>
                      <span className="text-cyan-300 font-mono font-bold text-[11px]">
                        {doc.license_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Experience:</span>
                      <span className="text-white font-medium text-[11px]">
                        {doc.experience_years} Years
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="text-slate-300">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="text-slate-300">{doc.phone_number}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Metrics Pill */}
                <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-[#081220] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium uppercase">Active Patients</p>
                    <p className="text-lg font-bold text-teal-300 font-mono mt-0.5">
                      {doc.total_patients_count}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#081220] border border-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium uppercase">Upcoming Consults</p>
                    <p className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                      {doc.active_appointments_count}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
