import React from 'react';
import { Check, Target } from 'lucide-react';

interface BodyMapSelectorProps {
  selectedArea: string;
  selectedSide: string;
  detectedArea?: string | null;
  onSelect: (area: string, side: string) => void;
}

export const BodyMapSelector: React.FC<BodyMapSelectorProps> = ({
  selectedArea,
  selectedSide,
  detectedArea,
  onSelect,
}) => {
  const regions = [
    { id: 'neck', name: 'Neck / Cervical', icon: '👤', desc: 'Stiffness, forward head tilt, desk strain' },
    { id: 'shoulder', name: 'Shoulders', icon: '💪', desc: 'Overhead reach, rotator cuff, tension' },
    { id: 'upper_back', name: 'Upper / Mid Back', icon: '🦴', desc: 'Thoracic tightness, rounded hunch' },
    { id: 'lower_back', name: 'Lower Back (Lumbar)', icon: '⚡', desc: 'Sitting discomfort, bending, lumbar strain' },
    { id: 'hip', name: 'Hips & Pelvis', icon: '🚶', desc: 'Pelvic tilt, glute fatigue, hip tightness' },
    { id: 'knee', name: 'Knees', icon: '🦵', desc: 'Squatting, stair climbing, patellar tracking' },
    { id: 'ankle', name: 'Ankles & Feet', icon: '👟', desc: 'Mobility, Achilles, standing fatigue' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {regions.map((region) => {
          const isSelected = selectedArea === region.id;
          const isAiDetected = detectedArea === region.id;

          return (
            <div
              key={region.id}
              onClick={() => onSelect(region.id, selectedSide || 'both')}
              className={`p-4 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-brand-600 bg-brand-50/80 shadow-sm ring-2 ring-brand-500/20'
                  : isAiDetected
                  ? 'border-teal-400 bg-teal-50/50 hover:bg-teal-50'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {isAiDetected && !isSelected && (
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <Target className="w-2.5 h-2.5" />
                  AI Detected
                </span>
              )}

              {isSelected && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}

              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-slate-100/80 border border-slate-200/60">{region.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{region.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{region.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Selector (Left, Right, Both) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700">Which side is most affected?</span>
        <div className="flex items-center gap-2">
          {[
            { id: 'left', label: 'Left Side' },
            { id: 'right', label: 'Right Side' },
            { id: 'both', label: 'Both Sides / Centered' },
          ].map((side) => (
            <button
              key={side.id}
              type="button"
              onClick={() => onSelect(selectedArea, side.id)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition ${
                selectedSide === side.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {side.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
