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
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Hospital Brand & Close Button */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <div
              onClick={() => handleItemClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-base tracking-tight">MetroHealth</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 rounded border border-teal-200/60 uppercase">
                    AI Clinic
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Physiotherapy & Posture</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Patient Portal
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
                      ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-xs'
                      : item.highlight
                      ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-teal-600'
                        : item.highlight
                        ? 'text-teal-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Helpline, User Card & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          {/* 24/7 Helpline */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-800 mb-1">
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-[11px] font-bold">Hospital Helpdesk</span>
            </div>
            <p className="text-[10px] text-slate-700">Toll-Free 24/7 Support:</p>
            <p className="text-xs font-bold text-teal-700">{user?.phone_number ? `+91 ${user.phone_number}` : '+91 9653766889'}</p>
          </div>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center justify-between px-2 pt-1">
              <div
                onClick={() => handleItemClick('profile')}
                className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-teal-300">
                  {user.full_name?.charAt(0) || 'P'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.full_name}</p>
                  <p className="text-[10px] text-slate-600 truncate">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
