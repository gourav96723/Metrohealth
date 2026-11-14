import React, { useState } from 'react';
import { Activity, Shield, User as UserIcon, Calendar, BookOpen, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav(user ? 'dashboard' : 'login')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">MetroHealth</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                  AI Clinic
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">Hospital Physiotherapy & Posture</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentPage === 'landing' ? 'bg-slate-100 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('exercises')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                currentPage === 'exercises' ? 'bg-slate-100 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Exercises
            </button>
            <button
              onClick={() => handleNav('appointments')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                currentPage === 'appointments' ? 'bg-slate-100 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Consultations
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === 'dashboard' ? 'bg-slate-100 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('history')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === 'history' ? 'bg-slate-100 text-brand-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  My Records
                </button>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('assessment')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition hover:shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Assessment</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <button
                  onClick={() => handleNav('profile')}
                  className={`p-2 rounded-lg border text-sm font-medium transition flex items-center gap-2 ${
                    currentPage === 'profile' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Profile & Settings"
                >
                  <UserIcon className="w-4 h-4 text-brand-600" />
                  <span className="max-w-[120px] truncate text-xs">{user.full_name}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    handleNav('login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('assessment')}
              className="p-2 rounded-lg bg-brand-600 text-white text-xs font-semibold"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl">
          <button
            onClick={() => handleNav('landing')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNav('exercises')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Educational Exercises
          </button>
          <button
            onClick={() => handleNav('appointments')}
            className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Consultations
          </button>
          {user ? (
            <>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('history')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                My Assessment History
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Profile & Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  handleNav('landing');
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => handleNav('login')}
                className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-slate-100 text-slate-800"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="flex-1 py-2 text-center text-sm font-medium rounded-lg bg-brand-600 text-white"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
