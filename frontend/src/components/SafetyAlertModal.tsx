import React from 'react';
import { AlertOctagon, PhoneCall, ArrowRight, X } from 'lucide-react';
import { SafetyScreeningData } from '../types';

interface SafetyAlertModalProps {
  safetyData: SafetyScreeningData;
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway?: () => void;
}

export const SafetyAlertModal: React.FC<SafetyAlertModalProps> = ({
  safetyData,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const isEmergency = safetyData.referral_urgency === 'emergency';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between text-white ${
          isEmergency ? 'bg-rose-600' : 'bg-amber-600'
        }`}>
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">
              {isEmergency ? 'Urgent Medical Attention Advised' : 'Clinical Evaluation Recommended'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {safetyData.guidance_message}
          </p>

          {safetyData.red_flag_items && safetyData.red_flag_items.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                Identified Clinical Warning Signs:
              </span>
              <ul className="text-xs text-rose-900 space-y-1 list-disc pl-4">
                {safetyData.red_flag_items.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              <span className="font-semibold block text-slate-800">Local Emergency Services</span>
              <span>Available 24 hours a day, 7 days a week</span>
            </div>
            <a
              href="tel:112"
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 100 / 112 / 108</span>
            </a>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            MetroHealth AI has paused physical exercise recommendations for this assessment session to ensure your safety.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
