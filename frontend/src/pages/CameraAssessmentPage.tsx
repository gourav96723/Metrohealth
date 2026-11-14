import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Info,
  Timer,
  Play,
  RotateCcw,
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PostureCanvas } from '../components/PostureCanvas';
import { BodyMapSelector } from '../components/BodyMapSelector';
import { MovementInput } from '../types';

interface CameraAssessmentPageProps {
  onNavigate: (page: string, params?: any) => void;
  onScanDone: (movementData: MovementInput | null, confirmedArea: string, confirmedSide: string) => void;
}

export const CameraAssessmentPage: React.FC<CameraAssessmentPageProps> = ({
  onNavigate,
  onScanDone,
}) => {
  // Assessment sub-steps:
  // 1: 'select_area' -> User chooses where they have pain/discomfort
  // 2: 'camera_scan' -> Guided movement scan customized for that area
  const [subStep, setSubStep] = useState<'select_area' | 'camera_scan'>('select_area');

  const [selectedArea, setSelectedArea] = useState<string>('neck');
  const [selectedSide, setSelectedSide] = useState<string>('both');
  const [scannedMovement, setScannedMovement] = useState<MovementInput | null>(null);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);

  const handleScanComplete = (movementData: MovementInput, confirmedArea: string) => {
    setScannedMovement(movementData);
    setSelectedArea(confirmedArea);
    setScanCompleted(true);
  };

  const handleProceedToQuestions = () => {
    onScanDone(scannedMovement, selectedArea, selectedSide);
    onNavigate('symptoms');
  };

  const handleSkipCamera = () => {
    onScanDone(null, selectedArea, selectedSide);
    onNavigate('symptoms');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (subStep === 'camera_scan') {
                setSubStep('select_area');
              } else {
                onNavigate('dashboard');
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              {subStep === 'select_area'
                ? 'Step 1 of 3 • Identify Discomfort Location'
                : `Step 2 of 3 • AI Movement Scan for ${selectedArea.replace('_', ' ').toUpperCase()}`}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {subStep === 'select_area'
                ? 'Where are you experiencing discomfort or pain?'
                : `Guided Movement Analysis for ${selectedArea.replace('_', ' ').toUpperCase()}`}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSkipCamera}
          className="text-xs font-semibold text-slate-500 hover:text-teal-700 underline transition"
        >
          Skip Camera & Go to Questions →
        </button>
      </div>

      {/* SUB-STEP 1: Identify Problem Area First */}
      {subStep === 'select_area' && (
        <div className="space-y-6">
          <div className="bg-teal-50/60 p-5 rounded-3xl border border-teal-200/70 flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-teal-900 space-y-1">
              <p className="font-bold">Personalized Clinical Movement Assessment</p>
              <p className="text-teal-800/90 leading-relaxed">
                Select your problem area below. Our AI system will tailor the webcam instructions,
                spoken audio prompts, and biomechanical joint angle measurements specifically to this region.
              </p>
            </div>
          </div>

          {/* Interactive Body Map & Area Cards */}
          <BodyMapSelector
            selectedArea={selectedArea}
            selectedSide={selectedSide}
            onSelect={(area, side) => {
              setSelectedArea(area);
              setSelectedSide(side);
            }}
          />

          {/* Affected Side Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900">Which side is most affected?</p>
              <p className="text-[11px] text-slate-500">Helps calibrate bilateral symmetry comparisons.</p>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'left', label: 'Left Side' },
                { id: 'right', label: 'Right Side' },
                { id: 'both', label: 'Both Sides / Centered' },
              ].map((sideOption) => (
                <button
                  key={sideOption.id}
                  type="button"
                  onClick={() => setSelectedSide(sideOption.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    selectedSide === sideOption.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sideOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA to start movement scan */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel Assessment
            </button>

            <button
              type="button"
              onClick={() => setSubStep('camera_scan')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-600/25 transition transform hover:-translate-y-0.5"
            >
              <span>Start Guided Movement Scan for {selectedArea.replace('_', ' ').toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-STEP 2: Camera Movement Scan for Selected Area */}
      {subStep === 'camera_scan' && (
        <div className="space-y-6">
          {/* Active Area Banner with option to change */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <span className="text-xs text-slate-600">
                Observing Area:{' '}
                <strong className="text-slate-900 capitalize">
                  {selectedArea.replace('_', ' ')} ({selectedSide})
                </strong>
              </span>
            </div>

            <button
              onClick={() => setSubStep('select_area')}
              className="text-xs text-teal-700 font-semibold hover:underline"
            >
              Change Focus Area
            </button>
          </div>

          {/* Real-time Mirrored Posture Canvas with Voice Guidance */}
          <PostureCanvas
            targetArea={selectedArea}
            onScanComplete={handleScanComplete}
          />

          {/* Proceed Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
            <button
              onClick={() => setSubStep('select_area')}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
            >
              ← Back to Area Selection
            </button>

            <button
              onClick={handleProceedToQuestions}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs transition shadow-md ${
                scanCompleted
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <span>
                {scanCompleted
                  ? `Proceed to ${selectedArea.replace('_', ' ').toUpperCase()} Questionnaire`
                  : 'Skip Scan & Answer Questions'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
