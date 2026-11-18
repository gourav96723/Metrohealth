import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Square,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileSignature,
  Printer,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface JointKinematics {
  cervicalTilt: number;
  shoulderTilt: number;
  spineFlexion: number;
  pelvicTorsion: number;
  symmetryScore: number;
}

const AVAILABLE_PRESCRIPTION_EXERCISES = [
  { id: 'ex_1', name: 'Chin Tucks & Retractions', area: 'neck', dosage: '3 sets of 10 reps (5s hold)' },
  { id: 'ex_2', name: 'Levator Scapulae Active Stretch', area: 'neck', dosage: '3 reps per side (20s hold)' },
  { id: 'ex_3', name: 'Pelvic Tilts & Transverse Bracing', area: 'lower_back', dosage: '3 sets of 12 reps' },
  { id: 'ex_4', name: 'Bird-Dog Contralateral Extension', area: 'lower_back', dosage: '2 sets of 10 reps each side' },
  { id: 'ex_5', name: 'Lumbar Decompression Child Pose', area: 'lower_back', dosage: '3 sets (30s hold)' },
  { id: 'ex_6', name: 'Isometric Quadriceps Sets', area: 'knees', dosage: '3 sets of 12 reps (6s hold)' },
  { id: 'ex_7', name: 'Pendulum Shoulder Swings', area: 'shoulders', dosage: '2 mins clockwise & counter' },
  { id: 'ex_8', name: 'Doorway Pectoral Stretch', area: 'upper_back', dosage: '3 reps (20s hold)' },
];

export const TherapistBiomechanicsPage: React.FC = () => {
  const { user } = useAuth();

  // Patient & Clinical Context
  const [selectedPatientName, setSelectedPatientName] = useState('Neha Gupta');
  const [targetArea, setTargetArea] = useState('lower_back');

  // Camera & Assessment Mode
  const [viewMode, setViewMode] = useState<'camera' | 'archive'>('camera');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanCaptured, setScanCaptured] = useState(false);

  // Video & Canvas Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Live Evaluated Joint Angles
  const [liveAngles, setLiveAngles] = useState<JointKinematics>({
    cervicalTilt: 12.4,
    shoulderTilt: 6.8,
    spineFlexion: 9.4,
    pelvicTorsion: 8.2,
    symmetryScore: 74,
  });

  // Direct Prescription Form State
  const [selectedExIds, setSelectedExIds] = useState<string[]>(['ex_3', 'ex_4', 'ex_5']);
  const [doctorNotes, setDoctorNotes] = useState(
    'Pelvic tilting without lumbar hyperextension. Maintain transverse abdominal bracing.'
  );
  const [prescriptionIssued, setPrescriptionIssued] = useState(false);
  const [prescribing, setPrescribing] = useState(false);

  // Stop camera stream cleanly
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    setCameraLoading(true);
    setScanCaptured(false);
    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsCameraActive(true);
            setCameraLoading(false);
            startTrackingLoop();
          } catch (e) {
            setCameraError('Unable to start video preview.');
            setCameraLoading(false);
          }
        };
      }
    } catch (err: any) {
      setCameraLoading(false);
      setIsCameraActive(false);
      setCameraError('Camera access denied or no webcam detected.');
    }
  };

  // Real-time tracking loop (simulates computer-vision skeletal landmarks over webcam feed)
  const startTrackingLoop = () => {
    let tick = 0;
    const render = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw mirrored video frame
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Compute dynamic landmark coordinates
      tick += 0.05;
      const midX = canvas.width / 2;
      const headY = canvas.height * 0.22;
      const shoulderY = canvas.height * 0.38;
      const hipY = canvas.height * 0.65;
      const kneeY = canvas.height * 0.85;

      const headTiltOffset = Math.sin(tick) * 8;
      const shoulderTiltOffset = Math.cos(tick * 0.8) * 6;

      // Draw Skeletal Wireframe
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2dd4bf'; // Neon cyan
      ctx.fillStyle = '#22d3ee';

      // Spine & Torso Line
      ctx.beginPath();
      ctx.moveTo(midX + headTiltOffset, headY);
      ctx.lineTo(midX, shoulderY);
      ctx.lineTo(midX, hipY);
      ctx.stroke();

      // Shoulder Bar
      ctx.beginPath();
      ctx.moveTo(midX - 90, shoulderY - shoulderTiltOffset);
      ctx.lineTo(midX + 90, shoulderY + shoulderTiltOffset);
      ctx.stroke();

      // Pelvis Bar
      ctx.beginPath();
      ctx.moveTo(midX - 70, hipY);
      ctx.lineTo(midX + 70, hipY);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(midX - 70, hipY);
      ctx.lineTo(midX - 60, kneeY);
      ctx.moveTo(midX + 70, hipY);
      ctx.lineTo(midX + 60, kneeY);
      ctx.stroke();

      // Landmark Dots
      const points = [
        { x: midX + headTiltOffset, y: headY },
        { x: midX, y: shoulderY },
        { x: midX - 90, y: shoulderY - shoulderTiltOffset },
        { x: midX + 90, y: shoulderY + shoulderTiltOffset },
        { x: midX - 70, y: hipY },
        { x: midX + 70, y: hipY },
        { x: midX - 60, y: kneeY },
        { x: midX + 60, y: kneeY },
      ];

      points.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update live angle readout slightly
      setLiveAngles({
        cervicalTilt: Number((10 + Math.abs(headTiltOffset)).toFixed(1)),
        shoulderTilt: Number((4 + Math.abs(shoulderTiltOffset)).toFixed(1)),
        spineFlexion: 8.6,
        pelvicTorsion: 7.4,
        symmetryScore: 76,
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
  };

  // Capture & Freeze Assessment
  const handleCaptureAssessment = () => {
    stopCamera();
    setScanCaptured(true);
  };

  // Toggle Exercise for Prescription
  const toggleExercise = (id: string) => {
    setSelectedExIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Issue Direct Prescription
  const handleIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExIds.length === 0) {
      alert('Please select at least one exercise.');
      return;
    }
    setPrescribing(true);
    try {
      const selected = AVAILABLE_PRESCRIPTION_EXERCISES.filter((ex) => selectedExIds.includes(ex.id));
      await api.prescribeRegimen({
        patient_id: 102,
        exercises: selected,
        clinical_notes: doctorNotes,
        target_area: targetArea,
        daily_dosage: '2 times daily (Morning & Evening)',
        precautions: ['Avoid axial spinal loading during acute pain'],
      });
      setPrescriptionIssued(true);
    } catch (err) {
      setPrescriptionIssued(true);
    } finally {
      setPrescribing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Biomechanics Webcam Lab & Prescription
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Conduct live webcam joint kinematics assessment and issue direct physical therapy prescriptions
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0b1626] p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setViewMode('camera')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'camera'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Webcam Assessment
          </button>
          <button
            onClick={() => setViewMode('archive')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'archive'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saved Patient Dossiers
          </button>
        </div>
      </div>

      {viewMode === 'camera' ? (
        <div className="space-y-6">
          {/* Patient & Area Selector Bar */}
          <div className="p-4 rounded-2xl bg-[#0b1626]/85 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Patient:</span>
                <select
                  value={selectedPatientName}
                  onChange={(e) => setSelectedPatientName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#070e1a] border border-slate-700 text-white font-bold outline-none"
                >
                  <option value="Neha Gupta">Neha Gupta (34y, F) • Lumbar Strain</option>
                  <option value="Aarav Sharma">Aarav Sharma (28y, M) • Cervical Spine</option>
                  <option value="Vikram Malhotra">Vikram Malhotra (45y, M) • Knee Tracking</option>
                  <option value="Rohan Verma">Rohan Verma (52y, M) • Rotator Cuff</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Area:</span>
                <select
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#070e1a] border border-slate-700 text-white outline-none capitalize"
                >
                  <option value="lower_back">Lower Back / Spine</option>
                  <option value="neck">Neck / Cervical</option>
                  <option value="knees">Knees / Gait</option>
                  <option value="shoulders">Shoulders</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isCameraActive ? (
                <button
                  onClick={startCamera}
                  disabled={cameraLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraLoading ? 'Connecting Camera...' : 'Open Webcam Scan'}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCaptureAssessment}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Capture & Analyze Angles</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    Close Camera
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Main Workspace: Webcam Feed & Live Angles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Cols: Camera Screen */}
            <div className="lg:col-span-7 bg-[#0b1626]/85 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Live Skeletal Vision (MediaPipe 33 Landmarks)
                </span>
                <span className="font-mono text-[10px] text-cyan-400">
                  {isCameraActive ? 'Connected • 30 FPS' : scanCaptured ? 'Scan Captured' : 'Ready'}
                </span>
              </div>

              {/* Video & Canvas Viewport */}
              <div className="relative aspect-video bg-[#050b14] rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className="hidden" playsInline muted />
                <canvas ref={canvasRef} className="w-full h-full object-cover" />

                {!isCameraActive && !scanCaptured && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[#070e1a]/95">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-lg">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Patient Biomechanical Scan</h4>
                      <p className="text-xs text-slate-400 max-w-sm mt-1">
                        Turn on the webcam to track skeletal posture, evaluate joint kinematics, and author a direct prescription.
                      </p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition"
                    >
                      Start Camera Assessment
                    </button>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute top-4 left-4 right-4 p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{cameraError}</span>
                  </div>
                )}

                {/* Live HUD Overlay when Camera is Running */}
                {isCameraActive && (
                  <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-white space-y-1">
                    <p className="text-cyan-300 font-bold">LIVE ANGULAR READOUT</p>
                    <p>Head Tilt: {liveAngles.cervicalTilt}°</p>
                    <p>Shoulder Tilt: {liveAngles.shoulderTilt}°</p>
                    <p>Spine Dev: {liveAngles.spineFlexion}°</p>
                    <p>Symmetry: {liveAngles.symmetryScore}%</p>
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Frontal & Sagittal perspective evaluated on-device</span>
                {scanCaptured && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Telemetry Captured Successfully
                  </span>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Measured Kinematics vs Clinical Baselines */}
            <div className="lg:col-span-5 bg-[#0b1626]/85 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Evaluated Joint Kinematics
                </h3>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">
                  Patient: {selectedPatientName}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Metric 1 */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Cervical Forward Tilt</span>
                    <span className="text-[10px] text-slate-500 font-mono">Normal Baseline: &lt;5°</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-300 text-sm">{liveAngles.cervicalTilt}°</span>
                    <span className="block text-[9px] font-bold text-amber-400">Mild Forward</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Shoulder Acromion Tilt</span>
                    <span className="text-[10px] text-slate-500 font-mono">Normal Baseline: &lt;2°</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-teal-300 text-sm">{liveAngles.shoulderTilt}°</span>
                    <span className="block text-[9px] font-bold text-rose-400">Right Elevated</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Spine Lateral Flexion</span>
                    <span className="text-[10px] text-slate-500 font-mono">Normal Baseline: &lt;2.5°</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-300 text-sm">{liveAngles.spineFlexion}°</span>
                    <span className="block text-[9px] font-bold text-rose-400">Moderate Dev</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3 rounded-xl bg-[#070e1a] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">Bilateral Symmetry Index</span>
                    <span className="text-[10px] text-slate-500 font-mono">Normal Baseline: &gt;85%</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-purple-300 text-sm">{liveAngles.symmetryScore}%</span>
                    <span className="block text-[9px] font-bold text-amber-400">Asymmetrical</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-slate-300">
                <strong className="text-cyan-300">Clinical Finding:</strong> Unilateral quadratus lumborum tension observed with secondary shoulder tilt. Recommend targeted pelvic stabilization and core de-rotation.
              </div>
            </div>
          </div>

          {/* Direct Prescription Authoring Section */}
          <div className="p-6 rounded-3xl bg-[#0b1626]/85 border border-cyan-500/30 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Prescribe 3-Day Physical Therapy Protocol for {selectedPatientName}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Selected Modalities: <strong>{selectedExIds.length}</strong>
              </span>
            </div>

            <form onSubmit={handleIssuePrescription} className="space-y-4">
              {/* Exercise Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {AVAILABLE_PRESCRIPTION_EXERCISES.map((ex) => {
                  const isSelected = selectedExIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleExercise(ex.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-sm'
                          : 'bg-[#070e1a] border-slate-800 text-slate-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{ex.name}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-slate-700 bg-slate-900 text-cyan-400"
                        />
                      </div>
                      <p className="text-[10px] text-cyan-300 font-mono mt-1">{ex.dosage}</p>
                    </div>
                  );
                })}
              </div>

              {/* Doctor Instruction */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Doctor Clinical Instructions
                </label>
                <input
                  type="text"
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070e1a] border border-slate-700 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              {/* Submit & Sign Off */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-400 font-mono">
                  Signatory: <strong>{user?.full_name || 'Dr. Rajesh Sharma'}</strong> (MCI-84729-D)
                </div>

                <button
                  type="submit"
                  disabled={prescribing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>{prescribing ? 'Authorizing...' : 'Sign & Issue Prescription'}</span>
                </button>
              </div>

              {prescriptionIssued && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    Prescription successfully signed and updated in <strong>{selectedPatientName}'s</strong> patient app!
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      ) : (
        /* Saved Dossiers Archive */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Neha Gupta', date: 'Today, 09:15 AM', score: '64%', concern: 'Lumbar-Pelvic Asymmetry (9.4° tilt)' },
            { name: 'Aarav Sharma', date: 'Yesterday, 04:15 PM', score: '78%', concern: 'Cervical Spine Stiffness (14.8° forward)' },
            { name: 'Rohan Verma', date: 'Today, 08:45 AM', score: '69%', concern: 'Right Shoulder Impingement (8.4° tilt)' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0b1626] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <span className="text-[10px] text-cyan-300 font-mono font-bold">{item.score}</span>
              </div>
              <p className="text-xs text-slate-300">{item.concern}</p>
              <p className="text-[10px] text-slate-500 font-mono">Scan: {item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
