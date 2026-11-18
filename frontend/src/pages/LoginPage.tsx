import React, { useState } from 'react';
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  PhoneCall,
  HeartPulse,
  Calendar,
  FileText,
  Building2,
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your email/phone number and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      setForgotMsg(
        data.message ||
          'If an account exists, password reset instructions have been dispatched. You can also call +91 9653766889.'
      );
      setForgotSubmitted(true);
    } catch (err: any) {
      setForgotMsg('Password reset instructions dispatched. Please check your inbox.');
      setForgotSubmitted(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080d1a] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-teal-500 selection:text-white relative">
      {/* Background subtle radial lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Main Split Grid (Left: Healthcare Flow Showcase | Right: Clean Portal Login) */}
      <div className="relative z-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ================= LEFT SIDE: Brand & Live Clinical Showcase ================= */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-800/60 bg-gradient-to-br from-[#080d1a] via-[#0b1326] to-[#0d172e]">
          <div className="max-w-xl space-y-6">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 text-xs font-medium shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>One platform for physiotherapy & posture clinic</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.15]">
                Every patient, every posture,<br />
                <span className="text-slate-300">in one calm flow.</span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed max-w-lg">
                From AI biomechanical scan to personalized 3-day recovery — facilities, records, and
                rehabilitation scheduling, working as one.
              </p>
            </div>

            {/* Floating Glassmorphic Clinical Cards (Matching Image 3 Style) */}
            <div className="space-y-4 pt-4">
              {/* Card 1: Today's Posture & OPD */}
              <div className="bg-[#0e172e]/85 border border-slate-700/60 backdrop-blur-md rounded-2xl p-5 shadow-2xl max-w-md transition-all hover:border-slate-600">
                <div className="flex items-center justify-between pb-3">
                  <span className="text-xs font-bold text-slate-200">Today's Posture & OPD</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                    Live
                  </span>
                </div>

                {/* Big numbers */}
                <div className="flex items-baseline gap-6 my-1">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white">18</span>
                    <span className="text-xs text-slate-400 ml-2 font-medium">seen</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white">6</span>
                    <span className="text-xs text-slate-400 ml-2 font-medium">waiting</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 my-3.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-400 h-1.5 rounded-full w-3/4" />
                </div>

                {/* Patient avatar initials pill */}
                <div className="flex items-center gap-1.5 pt-1">
                  {['RK', 'AM', 'SP', 'NV'].map((init, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-slate-800 text-teal-300 border border-slate-700 text-[10px] font-bold flex items-center justify-center"
                    >
                      {init}
                    </div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700 text-[9px] font-bold flex items-center justify-center">
                    +2
                  </div>
                </div>
              </div>

              {/* Card 2: Vitals & Alignment recorded */}
              <div className="bg-[#0e172e]/85 border border-slate-700/60 backdrop-blur-md rounded-2xl p-5 shadow-2xl max-w-md transition-all hover:border-slate-600">
                <div className="flex items-center gap-2 pb-3">
                  <Activity className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-slate-200">Vitals & Posture Alignment</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-[#090d1a]/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <p className="text-sm font-black text-white">0.8°</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Shoulder Tilt
                    </p>
                  </div>

                  <div className="bg-[#090d1a]/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <p className="text-sm font-black text-teal-400">94%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Symmetry
                    </p>
                  </div>

                  <div className="bg-[#090d1a]/80 border border-slate-800 rounded-xl p-2.5 text-center">
                    <p className="text-sm font-black text-emerald-400">CLEARED</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      Safety Gate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tags & Legal line (Left Side) */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Facilities
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                FHIR R4 Records
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Scheduling
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" />
                Clinical Workflows
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              © 2026 MetroHealth AI, a product of MetroHealth Care Technologies Private Limited.
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Sleek Portal Login ================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
          <div className="max-w-[390px] w-full space-y-6">
            {/* Header / Logo */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg shadow-teal-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-white">MetroHealth</span>
                  <span className="text-teal-400 text-xl font-bold leading-none">+</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Sign in to your MetroHealth account
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Container (Clean Dark Glass Card) */}
            <div className="bg-[#0e172e]/85 border border-slate-800/80 rounded-3xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Mobile Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@example.com or 9653766889"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password Input with Forgot Password link on right */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotSubmitted(false);
                        setForgotMsg('');
                        setForgotEmail(identifier.includes('@') ? identifier : '');
                      }}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#080d1a] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Encryption Notice */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                <span>Encrypted connection • Role-based access • HIPAA Aligned</span>
              </div>
            </div>

            {/* Bottom Support & Registration Links */}
            <div className="text-center space-y-3 pt-1">
              <div className="text-xs text-slate-400">
                New patient at MetroHealth?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="font-bold text-teal-400 hover:text-teal-300 hover:underline"
                >
                  Register Patient Record
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Having trouble?{' '}
                <a
                  href="tel:+919653766889"
                  className="font-semibold text-teal-400 hover:text-teal-300 hover:underline"
                >
                  Contact helpline (+91 9653766889)
                </a>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-400 transition"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-400 transition"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (Dark Glassmorphism) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e172e] max-w-sm w-full p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative space-y-4 text-white">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Reset Portal Password</h4>
              <p className="text-xs text-slate-400">
                Enter your registered hospital email address or phone number to receive recovery instructions.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-teal-950/60 border border-teal-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-xs font-semibold text-teal-200">{forgotMsg}</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com or 9653766889"
                    className="w-full px-3 py-2 text-xs bg-[#080d1a] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition"
                >
                  {forgotLoading ? 'Processing Request...' : 'Send Reset Instructions'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
