import React from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  FileSignature,
  Calendar,
  UserCheck,
  LogOut,
  Stethoscope,
  X,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TherapistSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistSidebar: React.FC<TherapistSidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'therapist-dashboard',
      label: 'Doctor OPD Dashboard',
      subtitle: 'Live queue & clinical summary',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'therapist-patients',
      label: 'Patient EMR & Posture Registry',
      subtitle: 'Full clinical dossiers & VAS scores',
      icon: Users,
      badge: '24',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'therapist-biomechanics',
      label: 'Biomechanics Lab Review',
      subtitle: '33-pt skeletal angles vs baseline',
      icon: Activity,
      badge: 'AI Telemetry',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    },
    {
      id: 'therapist-prescriptions',
      label: 'Exercise Prescription Builder',
      subtitle: 'Customize 3-day recovery protocols',
      icon: FileSignature,
    },
    {
      id: 'therapist-schedule',
      label: 'Consultations & Telehealth',
      subtitle: 'OPD slots & video sessions',
      icon: Calendar,
      badge: '6 Waiting',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'profile',
      label: 'Practitioner Credentials',
      subtitle: 'License & hospital affiliation',
      icon: Award,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#08101d] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Hospital Brand & Doctor Badge */}
        <div>
          {/* Hospital Header */}
          <div className="p-5 border-b border-slate-800/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#08101d] rounded-[14px] flex items-center justify-center text-cyan-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-white tracking-tight">MetroHealth</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    CLINICAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Physician & Therapist Portal</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Doctor Credentials Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-b from-[#0e1c31] to-[#0a1424] border border-cyan-500/25 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3 relative z-10">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                  DR
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a1424]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {user?.full_name || 'Dr. Rajesh Sharma, MS (Ortho)'}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-cyan-300 font-medium truncate mt-0.5">
                  {user?.specialization || 'Chief Orthopaedic & Sports Rehab'}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-400 font-mono">
                  <span>Reg: {user?.license_number || 'MCI-84729-D'}</span>
                  <span>•</span>
                  <span className="text-emerald-400">OPD Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Clinical Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between group ${
                    isActive
                      ? 'bg-cyan-500/15 text-white border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                          : 'text-slate-400 group-hover:text-cyan-300 group-hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : ''}`}>
                        {item.label}
                      </p>
                      {item.subtitle && (
                        <p className="text-[10px] text-slate-500 truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions: Patient Mode Switch & Logout */}
        <div className="p-3 border-t border-slate-800/70 space-y-1.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-teal-300 bg-teal-950/40 hover:bg-teal-900/50 border border-teal-500/30 transition flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch to Patient View</span>
          </button>

          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Doctor Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
