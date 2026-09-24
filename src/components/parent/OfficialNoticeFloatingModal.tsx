import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Printer,
  FileText,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { DirectNotice, Student } from '../../types';
import { soundEffects } from '../../utils/audioNotification';
import { OfficialCitationPrintModal } from '../admin/OfficialCitationPrintModal';

interface OfficialNoticeFloatingModalProps {
  isOpen: boolean;
  notice: DirectNotice | null;
  student?: Student | null;
  onClose: () => void;
  onConfirmReceipt: (noticeId: string) => void;
}

export const OfficialNoticeFloatingModal: React.FC<OfficialNoticeFloatingModalProps> = ({
  isOpen,
  notice,
  student,
  onClose,
  onConfirmReceipt,
}) => {
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  if (!isOpen || !notice) return null;

  const isCitatorio = notice.category === 'Citatorio' || notice.category === 'Citatorio Dirección';
  const isReporte = notice.category === 'Reporte Disciplinario' || notice.category === 'Conducta';

  const modalHeaderBg = isCitatorio
    ? 'bg-gradient-to-r from-[#D91A2A] to-[#991B1B]'
    : isReporte
    ? 'bg-gradient-to-r from-amber-600 to-amber-700'
    : 'bg-gradient-to-r from-[#0D6938] to-[#094d28]';

  const badgeText = isCitatorio
    ? '🚨 CITATORIO OFICIAL OBLIGATORIO'
    : isReporte
    ? '⚠️ REPORTE DISCIPLINARIO DE DIRECCIÓN'
    : '📢 COMUNICADO INSTITUCIONAL';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className={`${modalHeaderBg} text-white p-5 sm:p-6 relative`}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              aria-label="Cerrar notificación flotante"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <img
                src="https://kabris.com.mx/moiseslogo.png"
                alt="Logo Moisés Sáenz"
                className="h-12 w-auto object-contain shrink-0 drop-shadow-md"
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                  {badgeText}
                </span>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight mt-1">
                  Dirección • Esc. Sec. Gral. No. 1
                </h3>
              </div>
            </div>

            <p className="text-xs text-white/90 font-medium mt-1">
              Atención inmediata para el tutor de: <strong>{notice.studentName}</strong>
            </p>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Audio chime play button */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D91A2A] animate-ping"></span>
                <span className="text-xs font-black text-slate-700">Notificación Sonora Emitida</span>
              </div>
              <button
                type="button"
                onClick={() => soundEffects.playNoticeAlert()}
                className="flex items-center gap-1 text-xs font-black text-[#D91A2A] hover:text-[#991B1B] cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Repetir Alerta</span>
              </button>
            </div>

            {/* Title & Message */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Asunto del Documento:
              </span>
              <h4 className="text-base font-black text-slate-900 leading-snug">
                {notice.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {notice.message}
              </p>
            </div>

            {/* Citatorio Date/Time Card */}
            {isCitatorio && (
              <div className="bg-red-50 rounded-2xl p-4 border border-red-200 space-y-2">
                <span className="text-xs font-black uppercase text-[#D91A2A] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Cita Oficial Programada:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-slate-500 font-bold block">Fecha:</span>
                    <span className="font-black text-slate-900 text-xs">
                      {notice.citatorioDate || 'Próxima jornada'}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-red-100">
                    <span className="text-[10px] text-slate-500 font-bold block">Hora:</span>
                    <span className="font-black text-slate-900 text-xs">
                      {notice.citatorioTime || '08:30 AM'}
                    </span>
                  </div>
                  <div className="col-span-2 bg-white p-2.5 rounded-xl border border-red-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">Lugar:</span>
                    <span className="font-black text-slate-900 text-xs">
                      {notice.citatorioLocation || 'Dirección Escolar'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation status */}
            {notice.isConfirmedByTutor ? (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#0D6938]" />
                <span>Ya has confirmado tu asistencia y lectura de este documento.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-bold">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>La Dirección Escolar solicita confirmar tu asistencia obligatoria.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              {!notice.isConfirmedByTutor && (
                <button
                  type="button"
                  onClick={() => {
                    onConfirmReceipt(notice.id);
                    onClose();
                  }}
                  className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#0D6938] hover:bg-[#094d28] text-white text-xs sm:text-sm font-black shadow-md transition active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Asistencia / Enterado</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsPrintOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Ver Formato Oficial</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Print Modal */}
      <OfficialCitationPrintModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        notice={notice}
        student={student}
      />
    </>
  );
};
