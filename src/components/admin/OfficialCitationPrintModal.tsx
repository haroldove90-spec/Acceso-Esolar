import React from 'react';
import { X, Printer, Download, CheckCircle, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { DirectNotice, Student } from '../../types';

interface OfficialCitationPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: DirectNotice | null;
  student?: Student | null;
}

export const OfficialCitationPrintModal: React.FC<OfficialCitationPrintModalProps> = ({
  isOpen,
  onClose,
  notice,
  student,
}) => {
  if (!isOpen || !notice) return null;

  const isCitatorio = notice.category === 'Citatorio' || notice.category === 'Citatorio Dirección';
  const isReporte = notice.category === 'Reporte Disciplinario' || notice.category === 'Conducta';

  const docTitle = isCitatorio
    ? 'CITATORIO OFICIAL DE ASISTENCIA A DIRECCIÓN'
    : isReporte
    ? 'REPORTE DISCIPLINARIO Y DE CONDUCTA ESCOLAR'
    : 'COMUNICADO INSTITUCIONAL OFICIAL';

  const folioNo = `EXP-${notice.id.toUpperCase().slice(-8)}`;
  const formattedCreatedDate = new Date(notice.timestamp).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Action Header (Excluded from Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D91A2A] text-white">
              Formato Oficial
            </span>
            <span className="text-sm font-bold text-slate-300">Folio {folioNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D6938] hover:bg-[#094d28] text-white text-xs font-black transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Documento</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white" id="printable-official-document">
          {/* Institutional Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex items-center gap-4">
              <img
                src="https://kabris.com.mx/moiseslogo.png"
                alt="Logo Moisés Sáenz"
                className="h-16 sm:h-20 w-auto object-contain shrink-0"
              />
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase leading-snug">
                  Escuela Secundaria General No. 1 "Moisés Sáenz"
                </h1>
                <p className="text-xs font-bold text-slate-700">
                  Clave C.C.T. 30DES0040L • Zona Escolar 08 • Sector 02
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  Coatzacoalcos, Veracruz • Ciclo Escolar 2026-2027
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-black uppercase text-slate-500 block">Folio Oficial</span>
              <span className="text-sm font-black font-mono text-[#D91A2A]">{folioNo}</span>
              <span className="text-[11px] text-slate-500 block mt-1">{formattedCreatedDate}</span>
            </div>
          </div>

          {/* Title Badge */}
          <div className="text-center my-4">
            <h2 className="text-base sm:text-xl font-black tracking-tight uppercase border-b border-slate-300 pb-2 inline-block">
              {docTitle}
            </h2>
          </div>

          {/* Recipient Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 my-5">
            <div className="flex flex-wrap justify-between">
              <span className="font-bold text-slate-600">C. Padre, Madre o Tutor:</span>
              <span className="font-black text-slate-900">{notice.tutorName}</span>
            </div>
            <div className="flex flex-wrap justify-between">
              <span className="font-bold text-slate-600">Nombre del Alumno(a):</span>
              <span className="font-black text-slate-900">{notice.studentName}</span>
            </div>
            <div className="flex flex-wrap justify-between">
              <span className="font-bold text-slate-600">Grado y Grupo:</span>
              <span className="font-extrabold text-slate-900">
                {student ? `${student.grade} ${student.group} (${student.shift})` : 'Secundaria'}
              </span>
            </div>
            {student?.enrollmentId && (
              <div className="flex flex-wrap justify-between">
                <span className="font-bold text-slate-600">Matrícula Escolar:</span>
                <span className="font-mono font-bold text-slate-800">{student.enrollmentId}</span>
              </div>
            )}
          </div>

          {/* Specific Citation Block */}
          {isCitatorio && (
            <div className="bg-red-50/70 border-2 border-[#D91A2A]/40 rounded-2xl p-4 sm:p-5 my-5">
              <div className="flex items-center gap-2 text-[#D91A2A] font-black text-sm uppercase mb-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Datos de la Cita Obligatoria</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <span className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D91A2A]" /> Fecha
                  </span>
                  <p className="font-black text-slate-900 text-sm mt-1">
                    {notice.citatorioDate || 'Fecha coordinada en Dirección'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <span className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D91A2A]" /> Hora
                  </span>
                  <p className="font-black text-slate-900 text-sm mt-1">
                    {notice.citatorioTime || '08:30 AM'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-red-200">
                  <span className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D91A2A]" /> Lugar / Oficina
                  </span>
                  <p className="font-black text-slate-900 text-sm mt-1">
                    {notice.citatorioLocation || 'Dirección Escolar'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Asunto and Body Message */}
          <div className="space-y-3 my-5">
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Asunto: {notice.title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-800 text-justify">
              {notice.message}
            </p>
            <p className="text-[11px] text-slate-500 italic mt-3 leading-normal">
              Fundamento: Reglamento General de los Servicios de Educación Secundaria Técnica y General del Estado de Veracruz. Se requiere puntual asistencia y presentación con identificación oficial con fotografía.
            </p>
          </div>

          {/* Status and Acknowledgment Notice */}
          <div className="my-6 p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Estatus del Acuse en el Sistema:</span>
            {notice.isConfirmedByTutor ? (
              <span className="font-black text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Asistencia Confirmada por Tutor digitalmente
              </span>
            ) : (
              <span className="font-black text-amber-700 flex items-center gap-1">
                <Clock className="w-4 h-4" /> Notificación enviada • Pendiente de firma/asistencia
              </span>
            )}
          </div>

          {/* Institutional Signatures Section */}
          <div className="grid grid-cols-2 gap-8 pt-10 mt-8 border-t border-slate-300">
            <div className="text-center">
              <div className="border-b border-slate-900 w-4/5 mx-auto mb-2 h-12"></div>
              <p className="text-xs font-black text-slate-900">{notice.senderStaffName}</p>
              <p className="text-[11px] font-bold text-slate-500">{notice.senderRole}</p>
              <p className="text-[10px] text-slate-400">Esc. Sec. Gral. No. 1 "Moisés Sáenz"</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-900 w-4/5 mx-auto mb-2 h-12"></div>
              <p className="text-xs font-black text-slate-900">C. {notice.tutorName}</p>
              <p className="text-[11px] font-bold text-slate-500">Firma del Padre, Madre o Tutor</p>
              <p className="text-[10px] text-slate-400">Acuse de Recibido y Enterado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
