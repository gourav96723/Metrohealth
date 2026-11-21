import React, { useState, useEffect } from 'react';
import {
  Menu,
  PhoneCall,
  Clock,
  ShieldCheck,
  Bell,
  Search,
  Activity,
  UserCheck,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TherapistHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
}

export const TherapistHeader: React.FC<TherapistHeaderProps> = ({
  currentPage,
  onNavigate,
  onToggleSidebar,
}) => {
  const { user } = useAuth();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#08101d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                MetroHealth Clinical Station
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                OPD Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden md:block">
              Room #304 • Orthopaedic & Spine Physical Rehabilitation Center
            </p>
          </div>
        </div>

        {/* Right: Hospital Helpline, Live Clock & Doctor Profile */}
        <div className="flex items-center gap-3">
          {/* OPD Live Counter */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c172a] border border-cyan-500/20 text-xs">
            <span className="text-slate-400">Queue:</span>
            <span className="font-bold text-emerald-400">18 Seen</span>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-amber-400">6 Waiting</span>
          </div>

          {/* Hospital Helpline Button */}
          <a
            href="tel:18002026000"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700/60 text-xs font-semibold transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
            <span>1800-202-6000</span>
          </a>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeStr}</span>
          </div>

          {/* Doctor Chip */}
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#0d182b] hover:bg-[#122037] border border-cyan-500/25 cursor-pointer transition"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              DR
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[140px]">
                {user?.full_name || 'Dr. Rajesh Sharma'}
              </p>
              <p className="text-[10px] text-cyan-400 font-mono leading-none mt-0.5">
                {user?.license_number || 'MCI-84729-D'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
