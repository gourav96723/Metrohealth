import React from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  FileSignature,
  Calendar,
  LogOut,
  Stethoscope,
  X,
  ShieldCheck,
  Award,
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
      label: 'OPD Dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
    {
      id: 'therapist-biomechanics',
      label: 'Webcam Biomechanics Lab',
      icon: Activity,
      badge: 'Camera Scan',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
    {
      id: 'therapist-patients',
      label: 'Patient EMR Records',
      icon: Users,
      badge: '24',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'therapist-prescriptions',
      label: 'Prescription Builder',
      icon: FileSignature,
    },
    {
      id: 'therapist-schedule',
      label: 'Consultations',
      icon: Calendar,
      badge: '6 Waiting',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'profile',
      label: 'Doctor Profile',
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
          <div className="p-4 sm:p-5 border-b border-slate-800/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#08101d] rounded-[11px] flex items-center justify-center text-cyan-400">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">MetroHealth</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    CLINICAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Doctor Portal</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Doctor Badge Card */}
          <div className="p-3 mx-3 my-3 rounded-2xl bg-[#0c1626] border border-cyan-500/20 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
              DR
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-white truncate">
                  {user?.full_name || 'Dr. Rajesh Sharma'}
                </h4>
                <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate font-mono">
                {user?.license_number || 'MCI-84729-D'} • OPD Room 304
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 space-y-1">
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
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950'
                          : 'text-slate-400 group-hover:text-cyan-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-medium truncate ${isActive ? 'text-white font-bold' : ''}`}>
                      {item.label}
                    </span>
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

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800/70 space-y-1.5">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-teal-300 bg-teal-950/30 hover:bg-teal-900/40 border border-teal-500/25 transition flex items-center justify-center gap-2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch to Patient View</span>
          </button>

          <button
            onClick={logout}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
