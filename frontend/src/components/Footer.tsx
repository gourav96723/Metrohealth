import React from 'react';
import { Activity, ShieldAlert, PhoneCall, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">MetroHealth AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-based visual health and physiotherapy assistance platform combining computer vision pose analysis, structured clinical symptom screening, and safe educational movement guidance.
            </p>
            <div className="text-[11px] text-teal-400 font-medium">
              Academic Minor Project • AI & Computer Vision Specialization
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assessment')} className="hover:text-white transition">
                  Start New Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('exercises')} className="hover:text-white transition">
                  Exercise Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('appointments')} className="hover:text-white transition">
                  Hospital Consultation Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Safety */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Privacy & Ethics</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  Camera Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  Terms & Limitations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition">
                  Clinical Red Flags Guide
                </button>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span>Zero raw video stored</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Medical Emergency</span>
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              If you experience severe chest pain, shortness of breath, sudden numbness or speech difficulty, call emergency services immediately:
            </p>
            <div className="flex items-center gap-2 text-white font-bold text-sm bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-700">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>100 / 112 / 108</span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 MetroHealth AI. Built for academic research and educational evaluation.</p>
          <p className="text-center sm:text-right max-w-md">
            Not for clinical diagnosis. Does not replace professional physical therapy, orthopedic consultation, or emergency care.
          </p>
        </div>
      </div>
    </footer>
  );
};
