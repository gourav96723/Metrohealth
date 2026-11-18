import React, { useState } from 'react';
import {
  Activity,
  User,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  Printer,
  FileCheck,
  ArrowRight,
  TrendingDown,
  Info,
  Maximize2
} from 'lucide-react';

interface BiomechanicsPatientData {
  id: string;
  name: string;
  condition: string;
  age: number;
  gender: string;
  scanTime: string;
  metrics: {
    cervicalTilt: { measured: number; baseline: number; unit: string; status: 'Normal' | 'Mild' | 'Moderate' | 'Severe' };
    shoulderAcromionTilt: { measured: number; baseline: number; unit: string; status: 'Normal' | 'Mild' | 'Moderate' | 'Severe' };
    spineLateralFlexion: { measured: number; baseline: number; unit: string; status: 'Normal' | 'Mild' | 'Moderate' | 'Severe' };
    lumbarPelvicTorsion: { measured: number; baseline: number; unit: string; status: 'Normal' | 'Mild' | 'Moderate' | 'Severe' };
    kneeQAngle: { measured: number; baseline: number; unit: string; status: 'Normal' | 'Mild' | 'Moderate' | 'Severe' };
  };
  clinicalImpression: string;
  recommendedModality: string;
}

const SAMPLE_DATA: Record<string, BiomechanicsPatientData> = {
  neha: {
    id: 'neha',
    name: 'Neha Gupta',
    condition: 'Acute Lumbar-Pelvic Asymmetry (L4-L5 Strain)',
    age: 34,
    gender: 'Female',
    scanTime: 'Today, 09:15 AM',
    metrics: {
      cervicalTilt: { measured: 6.2, baseline: 5.0, unit: 'deg', status: 'Mild' },
      shoulderAcromionTilt: { measured: 6.8, baseline: 2.0, unit: 'deg', status: 'Moderate' },
      spineLateralFlexion: { measured: 9.4, baseline: 2.5, unit: 'deg', status: 'Severe' },
      lumbarPelvicTorsion: { measured: 11.2, baseline: 3.0, unit: 'deg', status: 'Severe' },
      kneeQAngle: { measured: 16.5, baseline: 14.0, unit: 'deg', status: 'Mild' },
    },
    clinicalImpression: 'Right pelvic elevation with secondary thoracic compensatory scoliosis. Significant unilateral paraspinal spasm along right quadratus lumborum. Lateral lumbar deviation of 9.4° indicates disc loading vulnerability.',
    recommendedModality: 'Targeted pelvic derotation, isometric transverse abdominis activation, unilateral quadratus lumborum stretching, and temporary avoidance of axial spinal loading.',
  },
  aarav: {
    id: 'aarav',
    name: 'Aarav Sharma',
    condition: 'Cervical Spondylosis & Forward Head Posture',
    age: 28,
    gender: 'Male',
    scanTime: 'Yesterday, 04:15 PM',
    metrics: {
      cervicalTilt: { measured: 14.8, baseline: 5.0, unit: 'deg', status: 'Severe' },
      shoulderAcromionTilt: { measured: 2.1, baseline: 2.0, unit: 'deg', status: 'Normal' },
      spineLateralFlexion: { measured: 1.8, baseline: 2.5, unit: 'deg', status: 'Normal' },
      lumbarPelvicTorsion: { measured: 2.4, baseline: 3.0, unit: 'deg', status: 'Normal' },
      kneeQAngle: { measured: 13.8, baseline: 14.0, unit: 'deg', status: 'Normal' },
    },
    clinicalImpression: 'Prominent forward head posture (craniovertebral angle compromised at 42.5°). Tightness in suboccipital and sternocleidomastoid groups with reciprocal weakness of deep neck flexors.',
    recommendedModality: 'Deep cervical flexor training (chin tucks with 10s isometric holds), ergonomic elevation of monitor display by 4 inches, and active levator scapulae myofascial release.',
  },
  rohan: {
    id: 'rohan',
    name: 'Rohan Verma',
    condition: 'Right Rotator Cuff Impingement & Acromial Tilt',
    age: 52,
    gender: 'Male',
    scanTime: 'Today, 08:45 AM',
    metrics: {
      cervicalTilt: { measured: 4.5, baseline: 5.0, unit: 'deg', status: 'Normal' },
      shoulderAcromionTilt: { measured: 8.4, baseline: 2.0, unit: 'deg', status: 'Severe' },
      spineLateralFlexion: { measured: 4.2, baseline: 2.5, unit: 'deg', status: 'Moderate' },
      lumbarPelvicTorsion: { measured: 3.8, baseline: 3.0, unit: 'deg', status: 'Mild' },
      kneeQAngle: { measured: 14.2, baseline: 14.0, unit: 'deg', status: 'Normal' },
    },
    clinicalImpression: 'Right shoulder elevated by 8.4° relative to contralateral side. Subacromial space narrowing indicated by restricted scapulothoracic rhythm and positive Neer sign.',
    recommendedModality: 'Sleeper stretch for posterior capsule mobility, scapular retraction exercises, rotator cuff isometric external rotators, and strict avoidance of abduction above 90° during acute flare-up.',
  },
};

export const TherapistBiomechanicsPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('neha');
  const patient = SAMPLE_DATA[selectedKey];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Severe':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Mild':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Biomechanics Lab & Skeletal Review
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              MediaPipe 33-Point Vision
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Clinical joint kinematic angles evaluated directly on patient device against peer-reviewed orthopedic baselines
          </p>
        </div>

        {/* Patient Switcher Tabs */}
        <div className="flex items-center gap-2 bg-[#0b1626] p-1.5 rounded-2xl border border-slate-800">
          {Object.values(SAMPLE_DATA).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedKey(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedKey === p.id
                  ? 'bg-gradient-to-r from-teal-500/30 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Overview Card */}
      <div className="p-5 rounded-3xl bg-[#0b1626]/85 border border-cyan-500/25 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{patient.name}</span>
            <span className="text-xs text-slate-400 font-mono">
              ({patient.age}y • {patient.gender})
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
              ID: MH-BIO-{patient.id.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Diagnosis: <strong className="text-white">{patient.condition}</strong>
          </p>
          <p className="text-[11px] text-slate-500 font-mono">Telemetry Timestamp: {patient.scanTime}</p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Biomechanics Dossier</span>
        </button>
      </div>

      {/* Biomechanics Visualizer & Metrics Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: 3D Skeletal Wireframe Schematic */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#08101d] border border-cyan-500/30 shadow-2xl flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Skeletal Landmark Plane
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Frontal Perspective</span>
          </div>

          {/* SVG Skeletal Diagram with Live Angular Indicators */}
          <div className="relative w-64 h-80 my-4 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 240 320">
              <defs>
                <linearGradient id="spineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Head Circle */}
              <circle
                cx={120 + (patient.metrics.cervicalTilt.measured > 8 ? 14 : 0)}
                cy="40"
                r="18"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Cervical Spine (Neck) */}
              <line
                x1={120 + (patient.metrics.cervicalTilt.measured > 8 ? 14 : 0)}
                y1="58"
                x2="120"
                y2="82"
                stroke="#2dd4bf"
                strokeWidth="3"
              />

              {/* Shoulder Bar (Tilt angle reflects acromion deviation) */}
              <line
                x1="65"
                y1={82 - (patient.metrics.shoulderAcromionTilt.measured > 4 ? 8 : 0)}
                x2="175"
                y2={82 + (patient.metrics.shoulderAcromionTilt.measured > 4 ? 8 : 0)}
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Spine Line with Curvature */}
              <path
                d={`M 120 82 Q ${
                  120 + (patient.metrics.spineLateralFlexion.measured > 5 ? 18 : 0)
                } 140, 120 180`}
                fill="none"
                stroke="url(#spineGradient)"
                strokeWidth="4"
              />

              {/* Pelvic Bar (Tilt reflects pelvic torsion) */}
              <line
                x1="80"
                y1={180 - (patient.metrics.lumbarPelvicTorsion.measured > 6 ? 6 : 0)}
                x2="160"
                y2={180 + (patient.metrics.lumbarPelvicTorsion.measured > 6 ? 6 : 0)}
                stroke="#2dd4bf"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Left Leg */}
              <line x1="90" y1="185" x2="88" y2="245" stroke="#0ea5e9" strokeWidth="2.5" />
              <line x1="88" y1="245" x2="86" y2="305" stroke="#0ea5e9" strokeWidth="2.5" />

              {/* Right Leg */}
              <line x1="150" y1="185" x2="152" y2="245" stroke="#0ea5e9" strokeWidth="2.5" />
              <line x1="152" y1="245" x2="154" y2="305" stroke="#0ea5e9" strokeWidth="2.5" />

              {/* Key Landmark Joints (Dots) */}
              {[
                { cx: 65, cy: 82 - (patient.metrics.shoulderAcromionTilt.measured > 4 ? 8 : 0), label: 'L-Shoulder' },
                { cx: 175, cy: 82 + (patient.metrics.shoulderAcromionTilt.measured > 4 ? 8 : 0), label: 'R-Shoulder' },
                { cx: 80, cy: 180 - (patient.metrics.lumbarPelvicTorsion.measured > 6 ? 6 : 0), label: 'L-ASIS' },
                { cx: 160, cy: 180 + (patient.metrics.lumbarPelvicTorsion.measured > 6 ? 6 : 0), label: 'R-ASIS' },
                { cx: 88, cy: 245, label: 'L-Patella' },
                { cx: 152, cy: 245, label: 'R-Patella' },
              ].map((dot, idx) => (
                <circle
                  key={idx}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="4"
                  fill="#22d3ee"
                  className="shadow-lg"
                />
              ))}
            </svg>

            {/* Deviation Overlays */}
            {patient.metrics.spineLateralFlexion.measured > 5 && (
              <div className="absolute top-[38%] right-2 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-[10px] text-rose-300 font-mono font-bold">
                Lateral +{patient.metrics.spineLateralFlexion.measured}°
              </div>
            )}

            {patient.metrics.shoulderAcromionTilt.measured > 4 && (
              <div className="absolute top-[22%] left-2 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-mono font-bold">
                Elevated +{patient.metrics.shoulderAcromionTilt.measured}°
              </div>
            )}
          </div>

          <div className="w-full text-center text-[10px] text-slate-500 font-mono">
            Calibrated against standardized coronal & sagittal reference vectors
          </div>
        </div>

        {/* Right 7 Cols: Detailed Joint Metrics Table & Clinical Impression */}
        <div className="lg:col-span-7 space-y-5">
          {/* Kinematics Comparison Table */}
          <div className="bg-[#0b1626]/85 border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Joint Kinematics vs Orthopaedic Baselines
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                    <th className="pb-2.5">Kinematic Parameter</th>
                    <th className="pb-2.5 text-center">Patient Angle</th>
                    <th className="pb-2.5 text-center">Normal Ref</th>
                    <th className="pb-2.5 text-right">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  <tr>
                    <td className="py-3 text-slate-200">Cervical Forward Head Angle</td>
                    <td className="py-3 text-center font-mono font-bold text-cyan-300">
                      {patient.metrics.cervicalTilt.measured}°
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono">&lt; {patient.metrics.cervicalTilt.baseline}°</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(patient.metrics.cervicalTilt.status)}`}>
                        {patient.metrics.cervicalTilt.status}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-slate-200">Acromioclavicular Shoulder Tilt</td>
                    <td className="py-3 text-center font-mono font-bold text-teal-300">
                      {patient.metrics.shoulderAcromionTilt.measured}°
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono">&lt; {patient.metrics.shoulderAcromionTilt.baseline}°</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(patient.metrics.shoulderAcromionTilt.status)}`}>
                        {patient.metrics.shoulderAcromionTilt.status}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-slate-200">Thoracolumbar Lateral Flexion</td>
                    <td className="py-3 text-center font-mono font-bold text-amber-300">
                      {patient.metrics.spineLateralFlexion.measured}°
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono">&lt; {patient.metrics.spineLateralFlexion.baseline}°</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(patient.metrics.spineLateralFlexion.status)}`}>
                        {patient.metrics.spineLateralFlexion.status}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-slate-200">Lumbar-Pelvic Torsion Index</td>
                    <td className="py-3 text-center font-mono font-bold text-purple-300">
                      {patient.metrics.lumbarPelvicTorsion.measured}°
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono">&lt; {patient.metrics.lumbarPelvicTorsion.baseline}°</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(patient.metrics.lumbarPelvicTorsion.status)}`}>
                        {patient.metrics.lumbarPelvicTorsion.status}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-slate-200">Patellofemoral Q-Angle (Bilateral)</td>
                    <td className="py-3 text-center font-mono font-bold text-emerald-300">
                      {patient.metrics.kneeQAngle.measured}°
                    </td>
                    <td className="py-3 text-center text-slate-400 font-mono">{patient.metrics.kneeQAngle.baseline}°</td>
                    <td className="py-3 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(patient.metrics.kneeQAngle.status)}`}>
                        {patient.metrics.kneeQAngle.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Impression & Recommended Modality */}
          <div className="p-5 rounded-3xl bg-[#0b1626]/85 border border-cyan-500/20 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Info className="w-4 h-4" />
              <span>Specialist Diagnostic Assessment</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {patient.clinicalImpression}
            </p>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Prescribed Physical Therapy Modality
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {patient.recommendedModality}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
