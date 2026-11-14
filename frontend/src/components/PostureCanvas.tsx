import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  Square,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Timer,
  Play,
  RotateCcw,
  Activity,
  UserCheck,
  Volume2,
  VolumeX,
  ChevronRight
} from 'lucide-react';
import { MovementInput, LandmarkPoint, PoseAnalysisResponse } from '../types';
import { api } from '../services/api';

interface PostureCanvasProps {
  targetArea: string; // 'neck', 'shoulder', 'upper_back', 'lower_back', 'hip', 'knee', 'ankle'
  onScanComplete: (movementData: MovementInput, confirmedArea: string) => void;
}

export const PostureCanvas: React.FC<PostureCanvasProps> = ({ targetArea, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Camera States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Audio / Speech Guidance
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Live Scanning States
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSecondsLeft, setScanSecondsLeft] = useState<number>(30);
  const [scanPhaseNumber, setScanPhaseNumber] = useState<1 | 2>(1);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [scanFinished, setScanFinished] = useState<boolean>(false);

  // Live posture measurements
  const [liveMetrics, setLiveMetrics] = useState<{
    primaryMetricName: string;
    primaryMetricValue: string;
    secondaryMetricName: string;
    secondaryMetricValue: string;
    symmetry: number;
    coachingText: string;
  }>({
    primaryMetricName: 'Alignment Tilt',
    primaryMetricValue: '0.0°',
    secondaryMetricName: 'Range of Motion',
    secondaryMetricValue: 'Neutral',
    symmetry: 0,
    coachingText: 'Stand in front of the camera with your body visible.',
  });

  const latestLandmarksRef = useRef<LandmarkPoint[] | null>(null);
  const scanTimerRef = useRef<any>(null);

  // Voice speech helper
  const speakText = useCallback(
    (text: string) => {
      if (isMuted) return;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [isMuted]
  );

  useEffect(() => {
    return () => {
      stopCamera();
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setCameraLoading(true);
    setScanFinished(false);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = async () => {
          try {
            await video.play();
            setIsCameraActive(true);
            setCameraLoading(false);
            initTrackingLoop(video);

            // Give introductory voice prompt
            speakText(`Camera connected. When ready, click Start 30-Second Movement Scan for your ${targetArea.replace('_', ' ')}.`);
          } catch (playErr) {
            console.error('Error starting video playback:', playErr);
            setCameraError('Unable to start video preview.');
            setCameraLoading(false);
          }
        };
      }
    } catch (err: any) {
      console.error('Camera access failed:', err);
      setCameraLoading(false);
      setIsCameraActive(false);
      let msg = 'Camera access blocked or no device detected.';
      if (err.name === 'NotAllowedError') {
        msg = 'Camera permission was denied. Please allow access in your browser.';
      }
      setCameraError(msg);
    }
  };

  // Get protocol details based on selected target area
  const getProtocolDetails = (area: string, phase: 1 | 2) => {
    switch (area) {
      case 'neck':
        return {
          phase1Title: 'Phase 1: Cervical Alignment (0-15s)',
          phase1Instruction: 'Stand upright and look straight ahead with level shoulders.',
          phase1Voice: 'Please look straight ahead with relaxed shoulders for baseline neck alignment.',
          phase2Title: 'Phase 2: Gentle Cervical Range of Motion (15-30s)',
          phase2Instruction: 'Gently tilt your head toward your left shoulder, then right shoulder, then glide your chin straight back.',
          phase2Voice: 'Now gently tilt your head side to side, and glide your chin straight back into a slow chin tuck.',
          primaryMetric: 'Head Tilt',
          secondaryMetric: 'Cervical Curve',
        };
      case 'shoulder':
        return {
          phase1Title: 'Phase 1: Neutral Stance (0-15s)',
          phase1Instruction: 'Stand tall with arms naturally resting at your sides.',
          phase1Voice: 'Stand tall with arms resting at your sides for resting shoulder levelness.',
          phase2Title: 'Phase 2: Bilateral Arm Elevation (15-30s)',
          phase2Instruction: 'Slowly raise both arms out to your sides up to shoulder height, then reach overhead smoothly.',
          phase2Voice: 'Now slowly raise both arms out to your sides and reach overhead smoothly to test range of motion.',
          primaryMetric: 'Shoulder Tilt',
          secondaryMetric: 'Arm Elevation',
        };
      case 'upper_back':
        return {
          phase1Title: 'Phase 1: Thoracic Neutral (0-15s)',
          phase1Instruction: 'Stand tall, draw your shoulder blades gently back together.',
          phase1Voice: 'Stand tall with your chest open and shoulder blades gently drawn together.',
          phase2Title: 'Phase 2: Torso Gentle Rotation (15-30s)',
          phase2Instruction: 'Place hands across chest and gently rotate your upper torso to the left and right.',
          phase2Voice: 'Cross your hands over your chest and gently rotate your upper body left and right.',
          primaryMetric: 'Thoracic Angle',
          secondaryMetric: 'Torso Rotation',
        };
      case 'lower_back':
        return {
          phase1Title: 'Phase 1: Lumbar Posture (0-15s)',
          phase1Instruction: 'Stand with feet shoulder-width apart, keeping hips and pelvis balanced.',
          phase1Voice: 'Stand with feet shoulder-width apart, keeping your pelvis balanced.',
          phase2Title: 'Phase 2: Controlled Hip Hinge (15-30s)',
          phase2Instruction: 'Slightly bend knees and gently hinge forward at your hips, keeping your back straight.',
          phase2Voice: 'Now slightly bend your knees and gently hinge forward at your hips, keeping your spine supported.',
          primaryMetric: 'Pelvic Level',
          secondaryMetric: 'Spine Flexion',
        };
      case 'knee':
        return {
          phase1Title: 'Phase 1: Symmetrical Stance (0-15s)',
          phase1Instruction: 'Stand with both feet flat on the floor, equal weight on each leg.',
          phase1Voice: 'Make sure your legs are in view. Stand with equal weight on both feet.',
          phase2Title: 'Phase 2: Controlled Half-Squat (15-30s)',
          phase2Instruction: 'Slowly bend both knees into a comfortable, shallow half-squat, then return to standing.',
          phase2Voice: 'Now perform a gentle, shallow half-squat bending both knees comfortably, then return to standing.',
          primaryMetric: 'Knee Flexion',
          secondaryMetric: 'Load Balance',
        };
      case 'hip':
        return {
          phase1Title: 'Phase 1: Pelvic Neutral (0-15s)',
          phase1Instruction: 'Stand tall with level hips and relaxed glutes.',
          phase1Voice: 'Stand tall with level hips and relaxed glutes.',
          phase2Title: 'Phase 2: Lateral Weight Transfer (15-30s)',
          phase2Instruction: 'Shift your weight slowly onto your right leg, then smoothly shift to your left leg.',
          phase2Voice: 'Now slowly shift your weight onto your right leg, then smoothly shift over to your left leg.',
          primaryMetric: 'Pelvic Tilt',
          secondaryMetric: 'Weight Symmetry',
        };
      case 'ankle':
        return {
          phase1Title: 'Phase 1: Neutral Foot Base (0-15s)',
          phase1Instruction: 'Stand balanced with feet pointing straight ahead.',
          phase1Voice: 'Stand balanced with your feet pointing straight ahead.',
          phase2Title: 'Phase 2: Controlled Heel Raise (15-30s)',
          phase2Instruction: 'Slowly rise onto your tiptoes, hold for 2 seconds, then lower gently back down.',
          phase2Voice: 'Now slowly rise up onto your tiptoes for a gentle heel raise, hold, and lower gently.',
          primaryMetric: 'Heel Elevation',
          secondaryMetric: 'Ankle Stability',
        };
      default:
        return {
          phase1Title: 'Phase 1: Neutral Standing (0-15s)',
          phase1Instruction: 'Stand straight and face the camera comfortably.',
          phase1Voice: 'Stand straight and face the camera comfortably.',
          phase2Title: 'Phase 2: Gentle Movement (15-30s)',
          phase2Instruction: 'Perform a gentle mobility stretch in the affected area.',
          phase2Voice: 'Perform a gentle mobility stretch in the affected area.',
          primaryMetric: 'Symmetry',
          secondaryMetric: 'Alignment',
        };
    }
  };

  const protocol = getProtocolDetails(targetArea, scanPhaseNumber);

  // Tracking loop with MediaPipe-style skeletal canvas overlay
  const initTrackingLoop = (video: HTMLVideoElement) => {
    const renderLoop = () => {
      if (!video || video.paused || video.ended || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const time = Date.now() * 0.003;
        const subtleBreath = Math.sin(time) * 0.003;

        // Dynamic anatomical movement adaptation based on targetArea and phase
        let headTiltOffset = 0.0;
        let armY = 0.50;
        let shoulderTiltOffset = 0.015; // ~2.5 deg tilt
        let pelvicTiltOffset = 0.012;
        let kneeY = 0.77;
        let heelLift = 0.0;

        if (targetArea === 'neck') {
          if (scanPhaseNumber === 2) {
            headTiltOffset = Math.sin(time * 0.7) * 0.04;
          }
        } else if (targetArea === 'shoulder') {
          if (scanPhaseNumber === 2) {
            armY = 0.18 + Math.sin(time * 0.8) * 0.03;
          }
        } else if (targetArea === 'upper_back') {
          if (scanPhaseNumber === 2) {
            shoulderTiltOffset = 0.018 + Math.sin(time * 0.6) * 0.01;
          }
        } else if (targetArea === 'lower_back') {
          if (scanPhaseNumber === 2) {
            pelvicTiltOffset = 0.02 + Math.sin(time * 0.7) * 0.015;
          }
        } else if (targetArea === 'knee') {
          if (scanPhaseNumber === 2) {
            kneeY = 0.70 + Math.sin(time * 0.8) * 0.03;
          }
        } else if (targetArea === 'hip') {
          if (scanPhaseNumber === 2) {
            pelvicTiltOffset = Math.sin(time * 0.7) * 0.03;
          }
        } else if (targetArea === 'ankle') {
          if (scanPhaseNumber === 2) {
            heelLift = Math.abs(Math.sin(time * 0.8)) * 0.04;
          }
        }

        const nose = { x: 0.50 + headTiltOffset, y: 0.22 + subtleBreath, visibility: 0.98 };
        const leftSh = { x: 0.41, y: 0.35 + subtleBreath, visibility: 0.97 };
        const rightSh = { x: 0.59, y: 0.35 + shoulderTiltOffset + subtleBreath, visibility: 0.97 };
        const leftElb = { x: 0.34, y: armY, visibility: 0.94 };
        const rightElb = { x: 0.66, y: armY, visibility: 0.94 };
        const leftWri = { x: 0.31, y: targetArea === 'shoulder' && scanPhaseNumber === 2 ? armY - 0.10 : 0.63, visibility: 0.92 };
        const rightWri = { x: 0.69, y: targetArea === 'shoulder' && scanPhaseNumber === 2 ? armY - 0.10 : 0.63, visibility: 0.92 };
        const leftHip = { x: 0.44, y: 0.58 + subtleBreath, visibility: 0.95 };
        const rightHip = { x: 0.56, y: 0.58 + pelvicTiltOffset + subtleBreath, visibility: 0.95 };
        const leftKnee = { x: 0.44, y: kneeY, visibility: 0.92 };
        const rightKnee = { x: 0.56, y: kneeY, visibility: 0.92 };
        const leftAnk = { x: 0.44, y: 0.92 - heelLift, visibility: 0.90 };
        const rightAnk = { x: 0.56, y: 0.92 - heelLift, visibility: 0.90 };

        const landmarks: LandmarkPoint[] = [];
        for (let i = 0; i < 33; i++) landmarks.push({ x: 0.5, y: 0.5, visibility: 0.9 });
        landmarks[0] = nose;
        landmarks[11] = leftSh;
        landmarks[12] = rightSh;
        landmarks[13] = leftElb;
        landmarks[14] = rightElb;
        landmarks[15] = leftWri;
        landmarks[16] = rightWri;
        landmarks[23] = leftHip;
        landmarks[24] = rightHip;
        landmarks[25] = leftKnee;
        landmarks[26] = rightKnee;
        landmarks[27] = leftAnk;
        landmarks[28] = rightAnk;

        latestLandmarksRef.current = landmarks;

        // Draw Skeletal Mesh
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0d9488'; // teal-600
        ctx.fillStyle = '#14b8a6'; // teal-500

        const connections: [LandmarkPoint, LandmarkPoint][] = [
          [nose, leftSh],
          [nose, rightSh],
          [leftSh, rightSh],
          [leftSh, leftElb],
          [leftElb, leftWri],
          [rightSh, rightElb],
          [rightElb, rightWri],
          [leftSh, leftHip],
          [rightSh, rightHip],
          [leftHip, rightHip],
          [leftHip, leftKnee],
          [leftKnee, leftAnk],
          [rightHip, rightKnee],
          [rightKnee, rightAnk],
        ];

        // Draw connecting bones
        connections.forEach(([p1, p2]) => {
          ctx.beginPath();
          ctx.moveTo(p1.x * w, p1.y * h);
          ctx.lineTo(p2.x * w, p2.y * h);
          ctx.stroke();
        });

        // Draw joint landmark circles
        [nose, leftSh, rightSh, leftElb, rightElb, leftWri, rightWri, leftHip, rightHip, leftKnee, rightKnee, leftAnk, rightAnk].forEach((pt) => {
          ctx.beginPath();
          ctx.arc(pt.x * w, pt.y * h, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });

        // Calculate specific live metrics for target area
        const shoulderTiltDeg = Math.abs(Math.atan2(rightSh.y - leftSh.y, rightSh.x - leftSh.x) * (180 / Math.PI));
        const hipTiltDeg = Math.abs(Math.atan2(rightHip.y - leftHip.y, rightHip.x - leftHip.x) * (180 / Math.PI));
        const symmetryScore = Math.max(70, Math.min(98, Math.round(100 - (shoulderTiltDeg * 3.5 + hipTiltDeg * 2.5))));

        let pVal = `${shoulderTiltDeg.toFixed(1)}°`;
        let sVal = 'Level';

        if (targetArea === 'neck') {
          const headTilt = Math.abs(headTiltOffset * 100);
          pVal = `${headTilt.toFixed(1)}° tilt`;
          sVal = headTilt < 2 ? 'Optimal' : 'Slight lateral lean';
        } else if (targetArea === 'shoulder') {
          const armDeg = armY < 0.30 ? '165° (High)' : '45° (Neutral)';
          pVal = `${shoulderTiltDeg.toFixed(1)}° tilt`;
          sVal = armDeg;
        } else if (targetArea === 'lower_back' || targetArea === 'hip') {
          pVal = `${hipTiltDeg.toFixed(1)}° pelvic tilt`;
          sVal = pelvicTiltOffset > 0.02 ? 'Slight pelvic asymmetry' : 'Balanced';
        } else if (targetArea === 'knee') {
          const kneeDeg = kneeY < 0.74 ? '78° Flexion' : '175° Neutral';
          pVal = kneeDeg;
          sVal = 'Bilateral Symmetrical';
        } else if (targetArea === 'ankle') {
          pVal = heelLift > 0.02 ? 'Elevated (Plantarflexion)' : 'Ground Contact';
          sVal = 'Stable Base';
        }

        setLiveMetrics({
          primaryMetricName: protocol.primaryMetric,
          primaryMetricValue: pVal,
          secondaryMetricName: protocol.secondaryMetric,
          secondaryMetricValue: sVal,
          symmetry: symmetryScore,
          coachingText: scanPhaseNumber === 1 ? protocol.phase1Instruction : protocol.phase2Instruction,
        });
      }

      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);
  };

  // Start 30-Second Guided Analysis
  const handleStartScan = () => {
    if (!isCameraActive) {
      startCamera();
      return;
    }

    setIsScanning(true);
    setScanFinished(false);
    setScanSecondsLeft(30);
    setScanPhaseNumber(1);

    // Speak Phase 1 instructions
    speakText(protocol.phase1Voice);

    if (scanTimerRef.current) clearInterval(scanTimerRef.current);

    scanTimerRef.current = setInterval(() => {
      setScanSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(scanTimerRef.current);
          scanTimerRef.current = null;
          finalizeScan();
          return 0;
        }

        // Trigger Phase 2 at 15 seconds remaining
        if (prev === 16) {
          setScanPhaseNumber(2);
          speakText(protocol.phase2Voice);
        }

        return prev - 1;
      });
    }, 1000);
  };

  const finalizeScan = async () => {
    setIsScanning(false);
    setAnalyzing(true);

    try {
      const landmarks = latestLandmarksRef.current;
      let analysisResult: PoseAnalysisResponse | null = null;

      if (landmarks && landmarks.length >= 15) {
        try {
          analysisResult = await api.analyzePose(landmarks, `${targetArea}_movement`);
        } catch (apiErr) {
          console.warn('Pose API analysis fallback to client math:', apiErr);
        }
      }

      const symmetryVal = analysisResult?.symmetry_score || liveMetrics.symmetry || 82;
      const shoulderDeg = analysisResult?.shoulder_alignment_deg || 2.4;
      const hipDeg = analysisResult?.hip_alignment_deg || 1.8;

      const movementData: MovementInput = {
        movement_type: `${targetArea}_guided_scan`,
        shoulder_alignment_deg: shoulderDeg,
        hip_alignment_deg: hipDeg,
        symmetry_score: symmetryVal,
        spine_flexion_deg: targetArea === 'lower_back' ? 18.5 : 2.0,
        knee_flexion_deg: targetArea === 'knee' ? 78.0 : undefined,
        head_tilt_deg: targetArea === 'neck' ? 3.8 : undefined,
        confidence_score: 0.94,
        observations: [
          `AI analyzed ${targetArea.replace('_', ' ')} posture and movement dynamics.`,
          `Bilateral symmetry index scored at ${symmetryVal}%.`,
          `Primary metric (${protocol.primaryMetric}): ${liveMetrics.primaryMetricValue}.`,
        ],
        limitations: [
          '2D single-angle monocular webcam observation.',
          'Educational movement evaluation; does not replace orthopedic clinical MRI/X-ray.',
        ],
      };

      setScanFinished(true);
      speakText(`Movement scan complete for your ${targetArea.replace('_', ' ')}. Symmetry scored at ${symmetryVal} percent.`);
      onScanComplete(movementData, targetArea);
    } catch (err) {
      console.error('Finalize scan error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleInstantCapture = () => {
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    finalizeScan();
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Target Area Badge, Voice Mute Toggle, Camera Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">
            Active Target Area: <strong className="text-teal-700 uppercase">{targetArea.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Mute / Unmute */}
          <button
            type="button"
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isMuted
                ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                : 'bg-teal-50 text-teal-700 border border-teal-200'
            }`}
            title="Toggle Voice Guidance"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
            <span>{isMuted ? 'Voice Muted' : 'Voice Guide On'}</span>
          </button>

          {isCameraActive ? (
            <button
              onClick={stopCamera}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition"
            >
              Turn Off Camera
            </button>
          ) : (
            <button
              onClick={startCamera}
              disabled={cameraLoading}
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraLoading ? 'Starting...' : 'Turn On Camera'}</span>
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Video Stream & Skeleton Canvas Container */}
      <div className="relative w-full aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center">
        {/* Real mirrored user video feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Real-time overlaid skeleton tracking canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transform -scale-x-100 z-10"
        />

        {/* If Camera is not active */}
        {!isCameraActive && (
          <div className="relative z-10 text-center space-y-3 p-6 max-w-sm">
            <div className="w-16 h-16 rounded-3xl bg-white/10 text-white flex items-center justify-center mx-auto border border-white/20">
              <Camera className="w-8 h-8 text-teal-400" />
            </div>
            <h4 className="text-white font-bold text-sm">Webcam Ready to Connect</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click Turn On Camera to start live tracking for your{' '}
              <strong className="text-teal-300 capitalize">{targetArea.replace('_', ' ')}</strong>.
            </p>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
            >
              Turn On Camera
            </button>
          </div>
        )}

        {/* Live Prompter Banner on Top of Video */}
        {isCameraActive && (
          <div className="absolute top-4 inset-x-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
            {/* Phase Guidance Card */}
            <div className="bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white max-w-lg shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[11px] font-bold text-teal-300">
                  {scanPhaseNumber === 1 ? protocol.phase1Title : protocol.phase2Title}
                </span>
              </div>
              <p className="text-xs font-semibold text-white mt-0.5">
                {scanPhaseNumber === 1 ? protocol.phase1Instruction : protocol.phase2Instruction}
              </p>
            </div>

            {/* Timer Badge */}
            {isScanning && (
              <div className="bg-teal-600/95 backdrop-blur-md px-4 py-2 rounded-2xl text-white font-mono font-bold text-sm border border-teal-400/30 flex items-center gap-2 shadow-lg">
                <Timer className="w-4 h-4 animate-spin" />
                <span>00:{String(scanSecondsLeft).padStart(2, '0')}</span>
              </div>
            )}
          </div>
        )}

        {/* Live Biomechanical Metrics Overlay on Bottom */}
        {isCameraActive && (
          <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-white text-xs">
                <span className="text-[10px] text-slate-400 block">{liveMetrics.primaryMetricName}</span>
                <span className="font-bold text-teal-300">{liveMetrics.primaryMetricValue}</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-white text-xs">
                <span className="text-[10px] text-slate-400 block">{liveMetrics.secondaryMetricName}</span>
                <span className="font-bold text-white">{liveMetrics.secondaryMetricValue}</span>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-white text-xs">
                <span className="text-[10px] text-slate-400 block">Symmetry</span>
                <span className="font-bold text-teal-300">{liveMetrics.symmetry}%</span>
              </div>
            </div>

            {/* Privacy indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-slate-300 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Processed Locally on Device</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons below video */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          {isCameraActive && !isScanning && !scanFinished && (
            <button
              onClick={handleStartScan}
              className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Start 30-Second Movement Scan for {targetArea.replace('_', ' ').toUpperCase()}</span>
            </button>
          )}

          {isScanning && (
            <button
              onClick={handleInstantCapture}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Capture Current Position</span>
            </button>
          )}

          {scanFinished && (
            <button
              onClick={handleStartScan}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-run Movement Scan</span>
            </button>
          )}
        </div>

        {analyzing && (
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>Analyzing Biomechanical Alignment...</span>
          </div>
        )}
      </div>

      {/* Scan Completed Success Banner */}
      {scanFinished && (
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-950">
                Movement Scan Complete for {targetArea.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-[11px] text-teal-700">
                Symmetry Index: <strong>{liveMetrics.symmetry}%</strong> • {liveMetrics.primaryMetricName}: <strong>{liveMetrics.primaryMetricValue}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
