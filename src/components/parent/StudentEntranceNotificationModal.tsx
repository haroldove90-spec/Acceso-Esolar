import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  DoorClosed,
  ShieldCheck,
  X,
  Volume2,
  Share2,
  Sparkles,
  School,
  ExternalLink
} from 'lucide-react';
import { Student, AccessRecord } from '../../types';
import { soundEffects } from '../../utils/audioNotification';

interface StudentEntranceNotificationModalProps {
  student: Student | null;
  accessRecord: AccessRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onViewHistory?: () => void;
}

export const StudentEntranceNotificationModal: React.FC<StudentEntranceNotificationModalProps> = ({
  student,
  accessRecord,
  isOpen,
  onClose,
  onViewHistory,
}) => {
  const [soundPlayed, setSoundPlayed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSoundPlayed(true);
      // Play the beep audio automatically on open
      soundEffects.playEntranceBeep();
    } else {
      setSoundPlayed(false);
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const isLate = accessRecord?.status === 'late';
  const gateName = accessRecord?.gate || 'Portón Principal (Entrada General)';
  const formattedTime = accessRecord?.formattedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleReplayBeep = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playEntranceBeep();
  };

  const whatsappMessage = encodeURIComponent(
    `🔔 *Notificación Escolar*: ${student.fullName} ingresó a la escuela a las ${formattedTime} por el ${gateName} (${isLate ? 'Retardo' : 'Puntual'}). Verificado con Credencial QR.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-400/50 overflow-hidden transform animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Animated Accent Top Bar */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600 animate-pulse" />

        {/* Header with Badges */}
        <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3 bg-gradient-to-b from-emerald-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Notificación en Tiempo Real
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                  Lector QR Activo
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-snug">
                ¡Tu hijo(a) acaba de ingresar al plantel!
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 pb-5 space-y-4">
          {/* Student Profile Snapshot Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm shrink-0 bg-white">
              <img
                src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-0.5 rounded-tl-lg shadow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wide block">
                Alumno Identificado
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 truncate leading-tight">
                {student.fullName}
              </h4>
              <p className="text-xs font-mono font-bold text-slate-600 mt-0.5">
                Matrícula: <span className="text-blue-700 font-extrabold">{student.enrollmentId}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 font-black text-[11px] rounded-lg">
                  {student.grade} - Grupo {student.group}
                </span>
                <span className="text-[11px] font-bold text-slate-500">{student.shift}</span>
              </div>
            </div>
          </div>

          {/* Access Data Badges Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Hora de Entrada</span>
              </div>
              <p className="text-base sm:text-lg font-black text-emerald-950 mt-1 font-mono">
                {formattedTime}
              </p>
              <span
                className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isLate
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                {isLate ? '⚠️ Ingreso con Retardo' : '✅ Puntual / A Tiempo'}
              </span>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-black">
                <DoorClosed className="w-4 h-4 text-blue-600" />
                <span>Portón de Acceso</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-snug truncate" title={gateName}>
                {gateName}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-extrabold text-blue-700">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>QR Oficial Validado</span>
              </span>
            </div>
          </div>

          {/* Reassurance Message & Sound indicator */}
          <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-slate-600 shrink-0" />
              <span className="text-slate-700 font-semibold text-[11px] sm:text-xs">
                El alumno se encuentra dentro de las instalaciones escolares.
              </span>
            </div>

            <button
              type="button"
              onClick={handleReplayBeep}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 font-black text-[11px] border border-slate-300 shadow-xs transition active:scale-95 cursor-pointer shrink-0"
              title="Escuchar nuevamente el sonido Beep de notificación"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Beep 🔔</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Excelente, Enterado!</span>
            </button>

            {onViewHistory && (
              <button
                onClick={() => {
                  onClose();
                  onViewHistory();
                }}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition cursor-pointer"
              >
                Ver Notificaciones
              </button>
            )}

            <a
              href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              title="Compartir notificación a WhatsApp del Tutor"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
