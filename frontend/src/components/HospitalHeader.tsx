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
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu & Current Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {getPageTitle(currentPage)}
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-600 hidden sm:flex">
            <span className="flex items-center gap-1 text-teal-700 font-semibold">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
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
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Clinic Helpline: <strong>{user?.phone_number ? `+91 ${user.phone_number}` : '+91 9653766889'}</strong></span>
        </div>

        {/* Start Assessment Action */}
        {currentPage !== 'assessment' && currentPage !== 'symptoms' && (
          <button
            onClick={() => onNavigate('assessment')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Assessment</span>
          </button>
        )}

        {/* Patient Avatar Pill */}
        {user && (
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 transition text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center">
              {user.full_name?.charAt(0) || 'P'}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user.full_name}</p>
              <p className="text-[10px] text-slate-600 leading-tight">Patient</p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
