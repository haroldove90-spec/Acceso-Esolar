import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  SwitchCamera,
  Flashlight,
  FlashlightOff,
  Upload,
  AlertCircle,
  CheckCircle2,
  ScanLine,
  RefreshCw,
  Volume2,
  VolumeX,
  Zap
} from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface RealQRScannerProps {
  onScanResult: (scannedText: string) => void;
  selectedGate?: string;
  accessType?: 'Entrada' | 'Salida';
  isActive?: boolean;
  onToggleActive?: (active: boolean) => void;
  showControls?: boolean;
  compact?: boolean;
  className?: string;
}

export const RealQRScanner: React.FC<RealQRScannerProps> = ({
  onScanResult,
  isActive = true,
  onToggleActive,
  showControls = true,
  compact = false,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [scanSuccessAnim, setScanSuccessAnim] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  // Audio Beep Chime
  const playChime = useCallback((success: boolean = true) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        // High-pitched pleasant dual-tone chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio context blocked or unavailable
    }
  }, [soundEnabled]);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([70, 40, 90]);
      } catch {
        // Vibration not allowed
      }
    }
  }, []);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
    setTorchAvailable(false);
  }, []);

  // Handle a successfully decoded text
  const handleDecodedText = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Cooldown check: avoid triggering on the exact same code in rapid succession (within 2.2s)
    if (lastScannedCode === trimmed) {
      return;
    }

    setLastScannedCode(trimmed);
    setScanSuccessAnim(true);
    playChime(true);
    triggerHaptic();
    onScanResult(trimmed);

    // Reset success animation and code lock after a short delay
    setTimeout(() => {
      setScanSuccessAnim(false);
    }, 1200);

    setTimeout(() => {
      setLastScannedCode(null);
    }, 2200);
  }, [lastScannedCode, onScanResult, playChime, triggerHaptic]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setErrorMessage('La cámara no es soportada en este navegador o entorno.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Critical for iOS Safari
        await videoRef.current.play();
      }

      setHasPermission(true);

      // Check if torch is supported
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
        if (capabilities.torch) {
          setTorchAvailable(true);
        }
      }

      // Start scanning loop
      let lastScanTime = 0;
      const scanLoop = (timestamp: number) => {
        if (!videoRef.current || !canvasRef.current) {
          animationFrameId.current = requestAnimationFrame(scanLoop);
          return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
          // Throttle scanning to every 80ms for high performance and low CPU usage
          if (timestamp - lastScanTime > 80) {
            lastScanTime = timestamp;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Try decoding with jsQR
            try {
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (code && code.data) {
                handleDecodedText(code.data);
              }
            } catch (err) {
              // Ignore frame decoding errors
            }
          }
        }

        animationFrameId.current = requestAnimationFrame(scanLoop);
      };

      animationFrameId.current = requestAnimationFrame(scanLoop);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Permiso de cámara denegado. Permita el acceso a la cámara en el navegador para activar el lector en vivo.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No se encontró ninguna cámara conectada en este dispositivo.');
      } else {
        setErrorMessage(`Error al inicializar cámara: ${err.message || 'Verifique los permisos'}`);
      }
    }
  }, [facingMode, handleDecodedText, stopCamera]);

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!streamRef.current || !torchAvailable) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        const newTorchState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: newTorchState }],
        });
        setTorchOn(newTorchState);
      }
    } catch (err) {
      console.warn('Could not toggle torch', err);
    }
  };

  // Flip camera (front / back)
  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Scan from uploaded file / photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            handleDecodedText(code.data);
          } else {
            alert('No se detectó ningún código QR válido en la imagen seleccionada.');
          }
        }
        setIsProcessingFile(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle active state & facingMode changes
  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isActive, facingMode, startCamera, stopCamera]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Viewport Frame */}
      <div className={`relative w-full ${compact ? 'h-60 sm:h-72' : 'h-72 sm:h-96'} bg-slate-950 rounded-3xl overflow-hidden border-2 ${
        scanSuccessAnim ? 'border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.6)]' : 'border-slate-800'
      } transition-all duration-300 flex flex-col items-center justify-center`}>
        
        {/* Hidden Canvas for Decoding */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${!isActive || hasPermission === false ? 'hidden' : 'block'}`}
        />

        {/* Overlay HUD with Scanning Reticle & Laser */}
        {isActive && hasPermission && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            {/* Darkened semi-transparent vignette */}
            <div className="absolute inset-0 bg-slate-950/20"></div>

            {/* Targeting Square Box */}
            <div className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl border-2 transition-all duration-200 ${
              scanSuccessAnim
                ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                : 'border-white/70 bg-transparent'
            }`}>
              {/* Four Corner Target Brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>

              {/* Animated Laser Scanning Beam */}
              {!scanSuccessAnim && (
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-pulse top-1/2 -translate-y-1/2"></div>
              )}

              {/* Success Burst Icon */}
              {scanSuccessAnim && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-in zoom-in-75">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                </div>
              )}
            </div>

            {/* Instruction Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-center flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black text-white">
                {scanSuccessAnim ? '¡Código QR Detectado!' : 'Enfoque el código QR del alumno'}
              </span>
            </div>
          </div>
        )}

        {/* Fallback Screen: Camera Paused */}
        {!isActive && (
          <div className="z-10 text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center text-slate-300 border border-white/20">
              <CameraOff className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">Lector de Cámara en Pausa</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto mt-1 font-medium">
                Haga clic en &quot;Activar Cámara&quot; para iniciar el reconocimiento óptico en vivo.
              </p>
            </div>
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition active:scale-95 cursor-pointer inline-flex items-center gap-2"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>Activar Cámara en Vivo</span>
              </button>
            )}
          </div>
        )}

        {/* Fallback Screen: Camera Denied or Error */}
        {isActive && hasPermission === false && (
          <div className="z-10 text-center p-6 space-y-3.5 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">No se pudo acceder a la cámara</h4>
              <p className="text-xs text-rose-200 mt-1 font-semibold leading-relaxed">
                {errorMessage || 'Permita el acceso a la cámara en los permisos de su navegador.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => startCamera()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar Acceso</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Escanear Foto QR</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden File Input for Image Scanning */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Camera Control Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs sm:text-sm">
          {/* Left Controls: Power & Facing */}
          <div className="flex items-center gap-2">
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(!isActive)}
                className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-1.5 transition cursor-pointer ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
                title={isActive ? 'Pausar Cámara' : 'Iniciar Cámara'}
              >
                {isActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                <span>{isActive ? 'Pausar' : 'Activar Cámara'}</span>
              </button>
            )}

            {isActive && hasPermission && (
              <button
                onClick={toggleFacingMode}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                title="Cambiar Cámara Frontal / Trasera"
              >
                <SwitchCamera className="w-4 h-4" />
                <span className="hidden sm:inline">{facingMode === 'environment' ? 'Cámara Trasera' : 'Cámara Frontal'}</span>
              </button>
            )}

            {torchAvailable && isActive && hasPermission && (
              <button
                onClick={toggleTorch}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  torchOn
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                title={torchOn ? 'Apagar Linterna' : 'Encender Linterna'}
              >
                {torchOn ? <FlashlightOff className="w-4 h-4" /> : <Flashlight className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Right Controls: Sound & Upload from Gallery */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
              title={soundEnabled ? 'Silenciar Beep' : 'Activar Sonido'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 transition flex items-center gap-1.5 cursor-pointer text-xs"
              title="Cargar foto de código QR"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessingFile ? 'Leyendo...' : 'Cargar Foto'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
