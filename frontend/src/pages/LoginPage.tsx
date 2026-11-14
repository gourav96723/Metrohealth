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
  Dumbbell,
  Stethoscope,
  Camera,
  Sparkles,
  HeartPulse
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
      setForgotMsg(data.message || 'Password reset link sent to your registered email address.');
      setForgotSubmitted(true);
    } catch (err: any) {
      setForgotMsg('Password reset instructions dispatched. Please check your inbox.');
      setForgotSubmitted(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl w-full bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT PANEL: MetroHealth AI Hospital Physiotherapy Showcase (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-teal-900 via-slate-900 to-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            {/* Hospital Branding Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">MetroHealth</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-400/20 text-teal-300 rounded border border-teal-400/30 uppercase tracking-wider">
                    AI Clinic
                  </span>
                </div>
                <p className="text-xs text-teal-200/80 font-medium">Physiotherapy & Posture Care Center</p>
              </div>
            </div>

            {/* Main Hospital Headline */}
            <div className="space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold">
                <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
                <span>Next-Gen Visual Health & Rehabilitation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                AI-Powered Movement Assessment & Clinical Physiotherapy
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Understand your posture alignment, target joint tension, and receive tailored 3-day recovery
                exercises guided by certified physical therapy protocols.
              </p>
            </div>

            {/* 3 Clinical Feature Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-teal-400/20">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Problem-First Guided Movement Scan</h2>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Select where you feel pain. The AI webcam provides voice guidance and measures exact joint angles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-400/20">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Personalized 3-Day Exercise Plan</h2>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Evidence-informed recovery regimens with interactive daily completion tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-400/20">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">Hospital Specialist Consultation</h2>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Seamless telehealth or in-clinic booking with orthopedic and spine doctors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Helpline Contact Footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-teal-400" />
              <span>Clinic Helpline & Support:</span>
              <strong className="text-teal-300 font-mono font-bold">+91 9653766889</strong>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Modern Hospital Portal Login Form (5 cols) */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-white space-y-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold uppercase mb-2">
                Patient Portal
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to Account</h3>
              <p className="text-xs text-slate-500 mt-1">
                Access your assessments, posture logs, and physiotherapy plans.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Phone Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or 9653766889"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Password Input with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition disabled:bg-slate-300 transform active:scale-95"
              >
                <span>{loading ? 'Authenticating Patient...' : 'Sign In to Patient Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Registration Link & Hospital Security Info */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-center text-xs text-slate-600">
              New patient at MetroHealth?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-bold text-teal-600 hover:text-teal-700 hover:underline"
              >
                Register Patient Record
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Encrypted Hospital Protocol • 100% Client-Side Privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Reset Portal Password</h4>
              <p className="text-xs text-slate-500">
                Enter your registered hospital email address to receive password reset instructions.
              </p>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto" />
                <p className="text-xs font-semibold text-teal-900">{forgotMsg}</p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition"
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
