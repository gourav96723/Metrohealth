import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Activity, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { ExerciseRecommendation } from '../types';
import { ExerciseCard } from '../components/ExerciseCard';

interface ExercisesPageProps {
  onNavigate: (page: string) => void;
}

export const ExercisesPage: React.FC<ExercisesPageProps> = ({ onNavigate }) => {
  const [exercises, setExercises] = useState<ExerciseRecommendation[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadExercises();
  }, [selectedArea]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      const data = await api.getExercises(selectedArea === 'all' ? undefined : selectedArea, true);
      setExercises(data);
    } catch (err) {
      console.error('Failed to load exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = exercises.filter((ex) => {
    const q = searchQuery.toLowerCase();
    return ex.name.toLowerCase().includes(q) || ex.purpose.toLowerCase().includes(q) || ex.category.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Physiotherapy Educational Exercises
            </h1>
            <p className="text-xs text-slate-500">
              Evidence-based mobility and postural stability routines categorized by body region.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('assessment')}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow transition"
        >
          Check My Posture
        </button>
      </div>

      {/* Search & Region Filter */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name or purpose (e.g. Chin Tuck, Glute Bridge)..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'neck', 'shoulder', 'upper_back', 'lower_back', 'hip', 'knee', 'ankle'].map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedArea === area
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {area.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <Activity className="w-6 h-6 text-brand-600 animate-spin mx-auto mb-2" />
          <span>Loading exercise library...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">
          No exercises matched your search query. Try another keyword or clear the filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
};
