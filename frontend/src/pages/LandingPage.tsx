import React from 'react';
import {
  Camera,
  ShieldCheck,
  Activity,
  HeartPulse,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Lock,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI-Powered Visual Health & Movement Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight max-w-4xl mx-auto">
            Understand Your Movement.{' '}
            <span className="bg-gradient-to-r from-brand-600 to-teal-500 bg-clip-text text-transparent">
              Take the Next Informed Step.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An intelligent educational platform combining computer-vision posture observations, transparent clinical red-flag safety screening, and evidence-informed physiotherapy guidance.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('assessment')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              <span>Start Posture Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user ? (
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition"
              >
                <UserPlus className="w-4 h-4 text-brand-600" />
                <span>Create Patient Account</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition"
              >
                <Activity className="w-4 h-4 text-brand-600" />
                <span>Go to My Dashboard</span>
              </button>
            )}
          </div>

          {/* Transparency Disclaimer Tag */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Client-side private processing • No raw video stored • Non-diagnostic educational tool</span>
          </div>
        </div>
      </section>

      {/* 2. THE THREE-STEP PROCESS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-600">Step-by-Step Experience</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">How HealthSense AI Works</h2>
          <p className="text-sm text-slate-600 mt-2">
            A structured, clinical-safety-first workflow designed for patients and physical therapy students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm relative group hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Webcam Movement Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Step back into your webcam frame with real-time mirror guidance. A 3-second hold records your shoulder alignment, pelvic tilt, and symmetry scores.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Live skeleton overlay on video</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Clear positioning instructions</span>
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm relative group hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Symptom & Safety Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Select your affected body region and pain intensity (0-10 VAS scale). The system screens for urgent medical red flags to ensure safety.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Transparent red-flag clinical rules</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Emergency helpline triggers</span>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm relative group hover:border-brand-300 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Guidance & Exercises</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Access safe, evidence-based mobility routines when cleared by safety rules, with clear guidance on when to seek hands-on medical evaluation.
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Physiotherapy-backed dosage & precautions</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Exportable summary for your records</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. CLINICAL SAFETY & BOUNDARIES NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl border border-amber-200 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                Transparent Medical Ethics & Regulatory Disclaimer
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                HealthSense AI is an educational technology and software engineering platform. <strong>It does not provide medical diagnoses, internal pathology detection, or prescription treatment.</strong> Webcam-based posture observation cannot evaluate skeletal structures, soft tissue tears, or replace hands-on orthopedic examination.
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                If you experience severe unyielding pain, numbness, weakness, or unexplained symptoms, consult a licensed physical therapist or physician. In an emergency, immediately call local emergency services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-brand-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to Check Your Posture and Movement?
            </h3>
            <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
              Begin a personalized movement observation session with guided posture feedback and evidence-based exercises in just 3 minutes.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('assessment')}
                className="px-7 py-3.5 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-md transition"
              >
                Start New Assessment
              </button>
              <button
                onClick={() => onNavigate('exercises')}
                className="px-6 py-3.5 rounded-2xl bg-brand-700/80 hover:bg-brand-700 text-white font-medium text-xs border border-brand-500 transition"
              >
                Explore Exercises
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
