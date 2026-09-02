import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, Image as ImageIcon, Check, Video, VideoOff } from 'lucide-react';

interface PhotoUploaderProps {
  photoUrl: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  type?: 'student' | 'staff';
}

const PRESET_STUDENT_AVATARS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
];

const PRESET_STAFF_AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=250',
];

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  onChange,
  label = 'Fotografía Oficial',
  helperText = 'Sube un archivo JPG/PNG o toma una foto con la cámara.',
  type = 'student',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('No se pudo acceder a la cámara. Permite los permisos en el navegador.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop square from center of video stream
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - minDim) / 2;
    const sy = (video.videoHeight - minDim) / 2;

    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onChange(dataUrl);
    stopCamera();
  };

  const handleRemove = () => {
    onChange('');
  };

  const presets = type === 'student' ? PRESET_STUDENT_AVATARS : PRESET_STAFF_AVATARS;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="font-black text-slate-800 text-sm">{label} *</label>
        <span className="text-[11px] font-semibold text-slate-500">{helperText}</span>
      </div>

      {/* Main Upload Box */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
        {/* Live Camera Viewport if Active */}
        {isCameraActive ? (
          <div className="space-y-2.5">
            <div className="relative w-full h-52 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-blue-500">
              <video
                ref={el => {
                  videoRef.current = el;
                  if (el && cameraStream && el.srcObject !== cameraStream) {
                    el.srcObject = cameraStream;
                    el.play();
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2 px-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capturar Fotografía</span>
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3 py-2 bg-slate-800/90 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <VideoOff className="w-3.5 h-3.5" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
            {cameraError && (
              <p className="text-xs font-bold text-rose-600 text-center">{cameraError}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Preview Image / Placeholder */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-200 bg-white shadow-xs shrink-0 flex items-center justify-center group">
              {photoUrl ? (
                <>
                  <img src={photoUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute inset-0 bg-rose-900/70 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="Quitar foto"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[10px] font-bold mt-1">Quitar</span>
                  </button>
                </>
              ) : (
                <div className="text-center p-2 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                  <span className="text-[10px] font-black block mt-0.5 text-slate-400">Sin Foto</span>
                </div>
              )}
            </div>

            {/* Upload & Camera Buttons */}
            <div className="flex-1 w-full space-y-2">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-3 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 cursor-pointer transition text-xs font-bold ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/80 text-blue-700'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-white text-slate-700'
                }`}
              >
                <Upload className="w-4 h-4 text-blue-600" />
                <span>{photoUrl ? 'Subir otra imagen (JPG, PNG)' : 'Seleccionar o arrastrar imagen'}</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-800 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tomar con Cámara</span>
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="pt-2 border-t border-slate-200/70">
          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
            O selecciona una foto de muestra rápida:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset)}
                className={`relative w-9 h-9 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                  photoUrl === preset ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <img src={preset} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                {photoUrl === preset && (
                  <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
