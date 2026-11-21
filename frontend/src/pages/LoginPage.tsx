import React, { useState, useEffect } from 'react';
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
  FileText,
  Calendar,
  Sparkles,
  User,
  Stethoscope,
  TrendingUp,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface LoginPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'patient' | 'therapist' | 'admin'>('patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mouse parallax state for dynamic 3D posture depth
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Animated diagnostic wave ticks
  const [waveOffset, setWaveOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { clientWidth, clientHeight } = currentTarget;
    const x = (clientX / clientWidth - 0.5) * 20; // -10px to +10px
    const y = (clientY / clientHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userRes = await login(identifier.trim(), password);
      const userRole = userRes?.role || role;
      if (userRole === 'admin') {
        onNavigate('admin-dashboard');
      } else if (userRole === 'therapist') {
        onNavigate('therapist-dashboard');
      } else {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials or call Helpline 1800-202-6000.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      const data = await api.forgotPassword(forgotEmail.trim());
      setForgotMsg(
        data.message ||
          'If an account exists, password reset instructions have been dispatched. You can also call Helpline 1800-202-6000.'
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
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-gradient-to-br from-[#061222] via-[#08172b] to-[#0b1e33] text-slate-100 flex flex-col justify-between overflow-x-hidden relative select-none font-sans"
    >
      <style>{`
        /* Smooth breathing sway for posture and 3D medical anatomy */
        @keyframes postureSway {
          0% {
            transform: scale(1.02) translate(0px, 0px) rotate(0deg);
            filter: brightness(1) drop-shadow(0 0 10px rgba(45, 212, 191, 0.25));
          }
          33% {
            transform: scale(1.035) translate(-4px, -6px) rotate(0.4deg);
            filter: brightness(1.1) drop-shadow(0 0 24px rgba(45, 212, 191, 0.45));
          }
          66% {
            transform: scale(1.025) translate(3px, 4px) rotate(-0.3deg);
            filter: brightness(1.03) drop-shadow(0 0 16px rgba(6, 182, 212, 0.35));
          }
          100% {
            transform: scale(1.02) translate(0px, 0px) rotate(0deg);
            filter: brightness(1) drop-shadow(0 0 10px rgba(45, 212, 191, 0.25));
          }
        }

        /* Continuous cybernetic vertical laser scanner along the spine */
        @keyframes spineLaserScan {
          0% {
            top: 15%;
            opacity: 0.15;
          }
          20% {
            opacity: 0.9;
          }
          50% {
            top: 75%;
            opacity: 1;
          }
          80% {
            opacity: 0.85;
          }
          100% {
            top: 15%;
            opacity: 0.15;
          }
        }

        /* Subtle gentle floating for HUD items */
        @keyframes hudFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-posture-sway {
          animation: postureSway 9s ease-in-out infinite alternate;
        }

        .animate-spine-scan {
          animation: spineLaserScan 4.5s ease-in-out infinite;
        }

        .animate-hud-float {
          animation: hudFloat 6s ease-in-out infinite;
        }
      `}</style>

      {/* ================= BACKGROUND 3D MEDICAL ANATOMY SCENE ================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Deep dark radial glows */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-teal-500/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-32 right-10 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px]" />

        {/* 3D Posture Background Image with Breathing Sway + Mouse Parallax */}
        <div
          className="absolute inset-0 w-full h-full animate-posture-sway transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url('/assets/posture_bg_hd.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
          }}
        />

        {/* Ambient Dark Cyan Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060e19]/90 via-transparent to-[#060e19]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060e19]/70 via-transparent to-[#060e19]/90" />

        {/* ================= ACTIVE LIVE POSTURE TRACKING OVERLAY ================= */}
        {/* Center Spine Scanning Laser Beam */}
        <div
          className="absolute left-[54%] w-48 -translate-x-1/2 pointer-events-none animate-spine-scan z-10 hidden sm:block"
          style={{ height: '3px' }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_20px_#2dd4bf,0_0_40px_#06b6d4]" />
          <div className="w-3 h-3 rounded-full bg-cyan-200 mx-auto -mt-1.5 shadow-[0_0_12px_#2dd4bf] animate-ping" />
        </div>

        {/* Dynamic Posture Joint Nodes (Pulsing Cyan Tracking Points) */}
        {/* Node 1: Left Silhouette - Thoracic */}
        <div className="absolute top-[52%] left-[17%] hidden lg:flex items-center gap-2 pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="absolute w-5 h-5 rounded-full bg-cyan-400/40 animate-ping" />
          </div>
          <div className="h-[1px] w-6 bg-cyan-400/60" />
          <span className="text-[11px] font-semibold text-cyan-300 tracking-wider">
            • Posture
          </span>
        </div>

        {/* Node 2: Left Silhouette - Lumbar Tracker */}
        <div className="absolute top-[62%] left-[14%] hidden lg:flex items-center gap-2 pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
            <span className="absolute w-5 h-5 rounded-full bg-teal-400/40 animate-ping" />
          </div>
          <div className="h-[1px] w-6 bg-teal-400/60" />
          <span className="text-[11px] font-semibold text-teal-300 tracking-wider bg-slate-900/60 px-2 py-0.5 rounded border border-teal-500/30">
            [ ] Tracker
          </span>
        </div>

        {/* Node 3: Center Spine Active Node */}
        <div className="absolute top-[48%] left-[44%] hidden lg:flex items-center gap-2 pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399]" />
            <span className="absolute w-6 h-6 rounded-full bg-emerald-400/40 animate-ping" />
          </div>
          <div className="h-[1px] w-6 bg-emerald-400/60" />
          <span className="text-[11px] font-semibold text-emerald-300 tracking-wider">
            • Posture
          </span>
        </div>
      </div>

      {/* ================= MAIN INTERACTIVE FOREGROUND LAYOUT ================= */}
      <div className="relative z-20 w-full flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 max-w-[1720px] mx-auto min-h-screen">
        {/* Top Row: Hero Copy (Left) & Glass Login Card (Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
          {/* Left Column: Hero Typography (Exact Reference Mockup Copy) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 pt-2">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a1526]/85 border border-cyan-500/30 text-slate-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
              <span>Simple, expert-led recovery for every body.</span>
            </div>

            {/* Big Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
                Move without pain,<br />
                live without limits.
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300/85 max-w-xl font-normal leading-relaxed">
                The smart way to track, heal, and recover—for doctors and patients alike.
              </p>
            </div>
          </div>

          {/* Right Column: Sleek Glassmorphism Login Card */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-end">
            <div className="w-full max-w-[410px] bg-[#0c1626]/85 border border-cyan-500/25 rounded-3xl p-7 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 space-y-6 relative">
              {/* Card Header: MetroHealth + */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    MetroHealth
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-teal-400 leading-none drop-shadow-[0_0_8px_#2dd4bf]">
                    +
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {role === 'patient'
                    ? 'Physiotherapy Portal'
                    : role === 'therapist'
                    ? 'Therapist & Clinical Portal'
                    : 'Hospital Administration Hub'}
                </p>
              </div>

              {/* Role Switcher Pill: [ Patient ] [ Therapist ] [ Admin ] */}
              <div className="p-1 rounded-2xl bg-[#060e1a]/90 border border-slate-700/60 grid grid-cols-3 gap-1 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                    role === 'patient'
                      ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('therapist')}
                  className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                    role === 'therapist'
                      ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                    role === 'admin'
                      ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Mobile Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {role === 'admin' ? 'Administrator Email' : 'Email or Mobile Number'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        role === 'patient'
                          ? 'name@example.com or +91 9XXXXXXXXX'
                          : role === 'therapist'
                          ? 'doctor@metrohealth.ai'
                          : 'admin@metrohealth.ai'
                      }
                      className="w-full pl-10 pr-3.5 py-3 text-xs bg-[#060e1a]/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                    />
                  </div>
                </div>

                {/* Password Field */}
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
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 text-xs bg-[#060e1a]/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Bottom Support & Registration Links */}
              <div className="space-y-2 text-center text-xs text-slate-400 pt-1">
                <div>
                  {role === 'therapist' ? (
                    <>
                      New therapist or doctor at MetroHealth?{' '}
                      <button
                        onClick={() => onNavigate('register', { role: 'therapist' })}
                        className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        Register Practitioner Record
                      </button>
                    </>
                  ) : (
                    <>
                      New patient at MetroHealth?{' '}
                      <button
                        onClick={() => onNavigate('register', { role: 'patient' })}
                        className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        Register Patient Record
                      </button>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  Clinic Helpline: 1800-202-6000 • Emergency: 100 / 112 / 108
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Floating Diagnostics HUD & Pills */}
        <div className="w-full pt-8 flex flex-col md:flex-row items-end justify-between gap-6">
          {/* Left HUD: Posture & Live Animated Diagnostics Card */}
          <div className="w-full max-w-md bg-[#0a1526]/85 border border-cyan-500/25 rounded-2xl p-4 backdrop-blur-md shadow-2xl space-y-2 animate-hud-float">
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Mini Spine Curvature Indicator */}
              <div className="col-span-4 border-r border-slate-700/60 pr-2 space-y-1">
                <p className="text-[11px] font-bold text-slate-300">Posture</p>
                <div className="h-16 flex items-center justify-center relative">
                  <svg className="w-10 h-full overflow-visible" viewBox="0 0 40 70">
                    {/* Spine Vertebrae dots */}
                    {[8, 16, 24, 32, 40, 48, 56, 64].map((y, i) => (
                      <circle
                        key={i}
                        cx={20 + Math.sin((y + waveOffset * 2) * 0.1) * 3}
                        cy={y}
                        r={i % 2 === 0 ? 3 : 2}
                        fill={i % 3 === 0 ? '#34d399' : '#22d3ee'}
                        opacity={0.85}
                      />
                    ))}
                    <path
                      d="M 20 8 Q 23 24, 20 40 T 20 64"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="1.2"
                      opacity={0.6}
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>100</span>
                  <span>20</span>
                </div>
              </div>

              {/* Live Animated Diagnostics Wave Line */}
              <div className="col-span-8 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">Diagnostics</span>
                  <div className="flex items-center gap-2 text-[9px] font-bold">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      High
                    </span>
                    <span className="flex items-center gap-1 text-teal-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      Stable
                    </span>
                  </div>
                </div>

                {/* Animated Wave SVG */}
                <div className="h-16 w-full flex items-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Fill Area under wave */}
                    <path
                      d={`M 0 50 Q 30 ${30 + Math.sin(waveOffset * 0.1) * 8}, 60 ${38 + Math.cos(waveOffset * 0.1) * 6} T 120 ${28 + Math.sin(waveOffset * 0.1) * 7} T 180 ${35 + Math.cos(waveOffset * 0.1) * 5} L 200 50 L 0 50 Z`}
                      fill="url(#waveGradient)"
                    />
                    {/* Main undulating wave line */}
                    <path
                      d={`M 0 50 Q 30 ${30 + Math.sin(waveOffset * 0.1) * 8}, 60 ${38 + Math.cos(waveOffset * 0.1) * 6} T 120 ${28 + Math.sin(waveOffset * 0.1) * 7} T 180 ${35 + Math.cos(waveOffset * 0.1) * 5} L 200 32`}
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                    />
                    {/* Live Glowing points along the wave */}
                    <circle
                      cx="60"
                      cy={38 + Math.cos(waveOffset * 0.1) * 6}
                      r="3.5"
                      fill="#22d3ee"
                      className="shadow-[0_0_8px_#22d3ee]"
                    />
                    <circle
                      cx="120"
                      cy={28 + Math.sin(waveOffset * 0.1) * 7}
                      r="3.5"
                      fill="#34d399"
                      className="shadow-[0_0_8px_#34d399]"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>100</span>
                  <span>150</span>
                  <span>200</span>
                  <span>250</span>
                  <span>300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Pill Buttons (Exact Match with Reference Mockup) */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-1.5 rounded-full bg-[#0a1526]/85 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 transition flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rehabilitation Plans</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-1.5 rounded-full bg-[#0a1526]/85 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 transition flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              <FolderOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Diagnostics</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-1.5 rounded-full bg-[#0a1526]/85 border border-slate-700/60 hover:border-cyan-500/40 hover:text-cyan-300 transition flex items-center gap-1.5 backdrop-blur-md shadow-lg"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clinical Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1626] max-w-sm w-full p-6 rounded-3xl border border-cyan-500/30 shadow-2xl relative space-y-4 text-white">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
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
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition"
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
                    placeholder="name@example.com or +91 9XXXXXXXXX"
                    className="w-full px-3 py-2 text-xs bg-[#060e1a] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-400 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
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
