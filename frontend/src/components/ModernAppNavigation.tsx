import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  FileSignature,
  Calendar,
  Search,
  Bell,
  Grid,
  Stethoscope,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Dumbbell,
  FileText,
  Camera,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ModernAppNavigationProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const ModernAppNavigation: React.FC<ModernAppNavigationProps> = ({
  currentPage,
  onNavigate,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isTherapist = user?.role === 'therapist';

  // Navigation Items according to active role
  const doctorNavItems = [
    { id: 'therapist-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'therapist-patients', label: 'Patients', icon: Users },
    { id: 'therapist-biomechanics', label: 'Posture Scans', icon: Activity },
    { id: 'therapist-prescriptions', label: 'Rehab Plans', icon: FileSignature },
    { id: 'therapist-schedule', label: 'Schedule', icon: Calendar },
  ];

  const patientNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-exercises', label: 'Rehab Plans', icon: Dumbbell },
    { id: 'assessment', label: 'Posture Scan', icon: Camera },
    { id: 'records', label: 'Records', icon: FolderOpen },
    { id: 'appointments', label: 'Schedule', icon: Calendar },
  ];

  const navItems = isTherapist ? doctorNavItems : patientNavItems;

  return (
    <>
      {/* ================= 1. TOP HORIZONTAL GLASS NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 backdrop-blur-xl bg-[#061222]/80 border-b border-teal-500/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo (Exact match with reference) */}
          <div
            onClick={() => onNavigate(isTherapist ? 'therapist-dashboard' : 'dashboard')}
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500/30 to-cyan-400/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.25)] group-hover:scale-105 transition">
              <Stethoscope className="w-4 h-4 text-teal-300" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                MetroHealth
              </span>
              <span className="text-teal-400 font-bold text-lg leading-none ml-0.5">+</span>
            </div>
          </div>

          {/* Center: Horizontal Floating Glass Capsule with Nav Tabs & Search */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#0d2138]/75 border border-teal-500/20 backdrop-blur-md shadow-lg shadow-black/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentPage === item.id ||
                (item.id === 'records' && currentPage === 'history') ||
                (item.id === 'therapist-biomechanics' && currentPage === 'assessment');

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/25 to-cyan-400/20 text-teal-300 border border-teal-400/45 shadow-[0_0_12px_rgba(45,212,191,0.25)] font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Compact Search Bar inside the glass pill */}
            <div className="relative ml-2 pr-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                className="w-36 lg:w-44 pl-8 pr-3 py-1 bg-[#09182a]/90 border border-slate-700/60 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400/60 transition"
              />
            </div>
          </div>

          {/* Right Action Icons: Grid, Notifications, Profile Avatar */}
          <div className="flex items-center gap-2.5 relative">
            {/* View Switcher Pill (Patient <-> Doctor Toggle) */}
            <button
              onClick={() => onNavigate(isTherapist ? 'dashboard' : 'therapist-dashboard')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition"
              title="Toggle Role View"
            >
              <span>{isTherapist ? 'Doctor View' : 'Patient View'}</span>
            </button>

            {/* Grid menu icon */}
            <button
              onClick={() => onNavigate(isTherapist ? 'therapist-schedule' : 'consultants')}
              className="p-2 rounded-full bg-[#0d2138]/70 hover:bg-[#122b49] text-slate-300 border border-slate-700/60 transition"
              title="Quick Directory"
            >
              <Grid className="w-4 h-4 text-slate-300" />
            </button>

            {/* Notification Bell with red pulse dot */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full bg-[#0d2138]/70 hover:bg-[#122b49] text-slate-300 border border-slate-700/60 transition relative"
              >
                <Bell className="w-4 h-4 text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 p-3 bg-[#0c1e33] border border-teal-500/25 rounded-2xl shadow-2xl z-50 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 font-bold text-white">
                    <span>Notifications</span>
                    <span className="text-[10px] text-teal-400 font-mono">Live</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#071322] border border-slate-800 text-slate-300 space-y-0.5">
                    <p className="font-semibold text-white">OPD Patient Waiting</p>
                    <p className="text-[10px] text-slate-400">Neha Gupta checked in for posture review.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-[#071322] border border-slate-800 text-slate-300 space-y-0.5">
                    <p className="font-semibold text-white">Rehab Progress Update</p>
                    <p className="text-[10px] text-slate-400">Aarav S. completed Day 2 mobility set.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Chip */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-[#0d2138]/75 hover:bg-[#122b49] border border-teal-500/25 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-white hidden sm:block max-w-[100px] truncate">
                  {user?.full_name ? user.full_name.split(' ')[0] : 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 p-2 bg-[#0c1e33] border border-teal-500/25 rounded-2xl shadow-2xl z-50 text-xs space-y-1">
                  <div className="p-2.5 border-b border-slate-800/80">
                    <p className="font-bold text-white truncate">{user?.full_name || 'Guest User'}</p>
                    <p className="text-[10px] text-teal-300 font-mono truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                      {user?.role === 'therapist' ? 'Clinical Doctor' : 'Registered Patient'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Settings & Security</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. SLIM FLOATING ICON-ONLY DOCK (LEFT SIDE) ================= */}
      {/* Exact match with reference image: pill-shaped floating capsule on left margin */}
      <aside className="fixed left-4 top-28 bottom-28 z-40 hidden lg:flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto p-2 rounded-full bg-[#0d2138]/85 border border-teal-500/25 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'records' && currentPage === 'history') ||
              (item.id === 'therapist-biomechanics' && currentPage === 'assessment');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-tr from-teal-500/30 to-cyan-400/25 text-teal-300 border border-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-teal-300' : 'text-slate-400'}`} />

                {/* Hover Tooltip */}
                <div className="absolute left-14 px-2.5 py-1 rounded-xl bg-[#0b1c2e] border border-teal-500/30 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
