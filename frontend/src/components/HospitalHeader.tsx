import React from 'react';
import { Menu, Bell, ShieldCheck, PhoneCall, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HospitalHeaderProps {
  onToggleSidebar: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const HospitalHeader: React.FC<HospitalHeaderProps> = ({
  onToggleSidebar,
  onNavigate,
  currentPage,
}) => {
  const { user } = useAuth();

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard':
        return 'Patient Clinical Dashboard';
      case 'assessment':
        return 'AI Posture & Movement Assessment';
      case 'symptoms':
        return 'Symptom & Clinical Questionnaire';
      case 'results':
        return 'Assessment Biomechanical Report';
      case 'records':
      case 'history':
        return 'Medical Records & Clinical History';
      case 'my-exercises':
        return 'My 3-Day Personalized Exercise Plan';
      case 'appointments':
        return 'Physiotherapy Consultation Booking';
      case 'consultants':
        return 'Hospital Specialist Directory';
      case 'profile':
        return 'Patient Health Profile';
      case 'settings':
        return 'Account & Security Settings';
      default:
        return 'MetroHealth Physiotherapy Center';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#091222]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between text-white">
      {/* Left: Mobile Menu & Current Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {getPageTitle(currentPage)}
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 hidden sm:flex">
            <span className="flex items-center gap-1 text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              Verified Patient Session
            </span>
            <span>•</span>
            <span>MetroHealth Orthopedics & Physiotherapy</span>
          </div>
        </div>
      </div>

      {/* Right: Hospital Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Emergency Call Quick Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
          <span>Clinic Helpline: <strong>+91 9653766889</strong></span>
        </div>

        {/* Start Assessment Action */}
        {currentPage !== 'assessment' && currentPage !== 'symptoms' && (
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 text-xs font-bold shadow-md shadow-teal-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Assessment</span>
          </button>
        )}

        {/* Patient Avatar Pill */}
        {user && (
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-800/60 transition text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center">
              {user.full_name?.charAt(0) || 'P'}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-white leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">Patient</p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
