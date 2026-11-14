import React, { useState } from 'react';
import { BookOpen, AlertCircle, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { ExerciseRecommendation } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseRecommendation;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {exercise.body_area.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {exercise.difficulty}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">{exercise.name}</h4>
            <p className="text-xs text-slate-500 mt-1">{exercise.category}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
          {exercise.purpose}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-700">Dosage: {exercise.suggested_dosage}</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-brand-600 hover:text-brand-700 font-semibold text-xs flex items-center gap-1"
          >
            {expanded ? 'Less Info' : 'View Instructions'}
          </button>
        </div>
      </div>

      {/* Expanded Step-by-Step Details */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-slate-50/70 border-t border-slate-100 space-y-4 text-xs animate-fade-in">
          <div>
            <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Step-by-Step Instructions</span>
            </h5>
            <ol className="space-y-1.5 list-decimal pl-4 text-slate-700">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3">
              <span className="font-semibold text-amber-900 block mb-1">General Precautions</span>
              <ul className="list-disc pl-4 text-[11px] text-amber-800 space-y-0.5">
                {exercise.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/80 border border-rose-200/60 rounded-xl p-3">
              <span className="font-semibold text-rose-900 block mb-1">Stop Conditions</span>
              <ul className="list-disc pl-4 text-[11px] text-rose-800 space-y-0.5">
                {exercise.stop_conditions.map((sc, idx) => (
                  <li key={idx}>{sc}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{exercise.evidence_note}</span>
          </div>
        </div>
      )}
    </div>
  );
};
