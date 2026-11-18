import React, { useState } from 'react';
import { BookOpen, AlertCircle, ChevronDown, ChevronUp, Check, Info } from 'lucide-react';
import { ExerciseRecommendation } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseRecommendation;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className="bg-[#0c1626]/85 rounded-2xl border border-slate-800/80 hover:border-cyan-500/40 transition overflow-hidden text-white backdrop-blur-md shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                {exercise.body_area.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {exercise.difficulty}
              </span>
            </div>
            <h4 className="text-base font-bold text-white">{exercise.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{exercise.category}</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle details"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          {exercise.purpose}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-cyan-300">Dosage: {exercise.suggested_dosage}</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
          >
            {expanded ? 'Less Info' : 'View Instructions'}
          </button>
        </div>
      </div>

      {/* Expanded Step-by-Step Details */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-[#060e1a]/80 border-t border-slate-800 space-y-4 text-xs">
          <div>
            <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-400" />
              <span>Step-by-Step Instructions</span>
            </h5>
            <ol className="space-y-1.5 list-decimal pl-4 text-slate-300">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#0b172a] border border-amber-500/30 rounded-xl p-3">
              <span className="font-semibold text-amber-300 block mb-1">General Precautions</span>
              <ul className="list-disc pl-4 text-[11px] text-amber-200/80 space-y-0.5">
                {exercise.precautions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
              <span className="font-semibold text-rose-300 block mb-1">Stop Conditions</span>
              <ul className="list-disc pl-4 text-[11px] text-rose-300 space-y-0.5">
                {exercise.stop_conditions.map((sc, idx) => (
                  <li key={idx}>{sc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
