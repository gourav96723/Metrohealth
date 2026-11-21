import React from 'react';
import {
  LayoutDashboard,
  Camera,
  FileText,
  Dumbbell,
  Calendar,
  Users,
  User,
  Settings,
  LogOut,
  ShieldAlert,
  Activity,
  PhoneCall,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'Start Assessment', icon: Camera, highlight: true },
    { id: 'records', label: 'My Records', icon: FileText },
    { id: 'my-exercises', label: 'My Exercises', icon: Dumbbell },
    { id: 'appointments', label: 'Book Consultation', icon: Calendar },
    { id: 'consultants', label: 'Hospital Consultants', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#080f1d] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Hospital Brand & Close Button */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <div
              onClick={() => handleItemClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-teal-500/25 group-hover:scale-105 transition">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-white text-base tracking-tight">MetroHealth</span>
                  <span className="text-teal-400 font-bold text-base leading-none">+</span>
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-teal-500/10 text-teal-300 rounded border border-teal-500/30 uppercase">
                    AI Clinic
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Physiotherapy & Posture</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Patient Clinical Portal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === 'records' && currentPage === 'history') ||
                (item.id === 'assessment' && ['symptoms', 'results'].includes(currentPage));

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : item.highlight
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 hover:brightness-110'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-cyan-400'
                        : item.highlight
                        ? 'text-slate-950'
                        : 'text-slate-500'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Helpline, User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#060e1a]/80">
          {/* 24/7 Helpline */}
          <div className="p-3 bg-[#0c1626]/90 rounded-xl border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 text-slate-200 mb-1">
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-bold">Hospital Helpdesk</span>
            </div>
            <p className="text-[10px] text-slate-400">Toll-Free 24/7 Support:</p>
            <p className="text-xs font-bold text-teal-400">1800-202-6000</p>
          </div>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center justify-between px-2 pt-1">
              <div
                onClick={() => handleItemClick('profile')}
                className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-teal-500/40">
                  {user.full_name?.charAt(0) || 'P'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
