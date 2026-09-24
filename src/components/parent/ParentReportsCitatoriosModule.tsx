import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Volume2,
  Bell,
  Search,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DirectNotice, Student } from '../../types';
import { soundEffects } from '../../utils/audioNotification';
import { OfficialCitationPrintModal } from '../admin/OfficialCitationPrintModal';

export const ParentReportsCitatoriosModule: React.FC = () => {
  const {
    notices,
    students,
    parentSelectedStudentId,
    confirmNoticeReceipt,
    simulateOfficialCitationAlert,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'todos' | 'citatorios' | 'reportes' | 'avisos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNoticeForPrint, setSelectedNoticeForPrint] = useState<DirectNotice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Selected student
  const student = students.find(s => s.id === parentSelectedStudentId) || students[0];

  // Filter notices for this student or broadcast to all
  const studentNotices = notices.filter(
    n => n.studentId === parentSelectedStudentId || n.targetScope === 'masivo'
  );

  const pendingCitatoriosCount = studentNotices.filter(
    n => (n.category === 'Citatorio' || n.category === 'Citatorio Dirección') && !n.isConfirmedByTutor
  ).length;

  const filteredNotices = studentNotices.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.senderStaffName.toLowerCase().includes(searchTerm.toLowerCase());

    const isCit = item.category === 'Citatorio' || item.category === 'Citatorio Dirección';
    const isRep = item.category === 'Reporte Disciplinario' || item.category === 'Conducta' || item.category === 'Tareas y Materiales';
    const isAvi = item.category === 'Aviso General';

    const matchesCategory =
      activeFilter === 'todos' ||
      (activeFilter === 'citatorios' && isCit) ||
      (activeFilter === 'reportes' && isRep) ||
      (activeFilter === 'avisos' && isAvi);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner & Pending Alerts */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#D91A2A] shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-[#D91A2A]">
                  Dirección & Control Escolar
                </span>
                {pendingCitatoriosCount > 0 && (
                  <span className="text-[10px] font-black bg-[#D91A2A] text-white px-2.5 py-0.5 rounded-full animate-pulse">
                    {pendingCitatoriosCount} Citatorio(s) Pendientes
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Citatorios, Reportes & Comunicados Oficiales
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Expediente de comunicados oficiales dirigidos al tutor de: <strong>{student?.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => simulateOfficialCitationAlert(parentSelectedStudentId)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-[#D91A2A] text-xs font-black border border-red-200 transition cursor-pointer self-start sm:self-auto shadow-2xs"
            title="Probar sonido y ventana flotante"
          >
            <Sparkles className="w-4 h-4" />
            <span>Probar Alerta Flotante & Timbre</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
              activeFilter === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos ({studentNotices.length})
          </button>
          <button
            onClick={() => setActiveFilter('citatorios')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
              activeFilter === 'citatorios'
                ? 'bg-[#D91A2A] text-white shadow-xs'
                : 'bg-red-50 text-[#D91A2A] hover:bg-red-100'
            }`}
          >
            Citatorios ({studentNotices.filter(n => n.category === 'Citatorio' || n.category === 'Citatorio Dirección').length})
          </button>
          <button
            onClick={() => setActiveFilter('reportes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
              activeFilter === 'reportes'
                ? 'bg-[#0D6938] text-white shadow-xs'
                : 'bg-emerald-50 text-[#0D6938] hover:bg-emerald-100'
            }`}
          >
            Reportes ({studentNotices.filter(n => n.category === 'Reporte Disciplinario' || n.category === 'Conducta' || n.category === 'Tareas y Materiales').length})
          </button>
          <button
            onClick={() => setActiveFilter('avisos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
              activeFilter === 'avisos'
                ? 'bg-[#5B92C8] text-white shadow-xs'
                : 'bg-sky-50 text-[#1e40af] hover:bg-sky-100'
            }`}
          >
            Avisos Generales ({studentNotices.filter(n => n.category === 'Aviso General').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar comunicado..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D6938]"
          />
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-black text-slate-700">No hay comunicados en esta categoría</p>
            <p className="text-xs text-slate-400 mt-1">
              Aquí aparecerán los citatorios, reportes de conducta y avisos emitidos por la Dirección.
            </p>
          </div>
        ) : (
          filteredNotices.map(notice => {
            const isCitatorio = notice.category === 'Citatorio' || notice.category === 'Citatorio Dirección';
            const isReporte = notice.category === 'Reporte Disciplinario' || notice.category === 'Conducta';

            return (
              <div
                key={notice.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all duration-200 shadow-xs ${
                  isCitatorio && !notice.isConfirmedByTutor
                    ? 'border-[#D91A2A]/40 bg-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isCitatorio
                        ? 'bg-[#D91A2A] text-white'
                        : isReporte
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-[#0D6938] border border-emerald-300'
                    }`}>
                      {notice.category}
                    </span>

                    <span className="text-xs font-bold text-slate-600">
                      Emitido por: <strong>{notice.senderStaffName}</strong> ({notice.senderRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <button
                      type="button"
                      onClick={() => soundEffects.playNoticeAlert()}
                      className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      title="Reproducir timbre sonoro"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <span>
                      {new Date(notice.timestamp).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Subject and Message */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {notice.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mt-2">
                  {notice.message}
                </p>

                {/* Specific Citation Box */}
                {isCitatorio && (
                  <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
                    <div className="flex items-center gap-2 text-[#D91A2A] font-black text-xs uppercase">
                      <Calendar className="w-4 h-4" />
                      <span>Detalles de la Cita Obligatoria:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-red-100">
                        <span className="text-[10px] text-slate-500 font-bold block">Fecha:</span>
                        <span className="font-black text-slate-900 text-sm">
                          {notice.citatorioDate || 'Fecha a confirmar en Dirección'}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-red-100">
                        <span className="text-[10px] text-slate-500 font-bold block">Hora:</span>
                        <span className="font-black text-slate-900 text-sm">
                          {notice.citatorioTime || '08:30 AM'}
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-red-100">
                        <span className="text-[10px] text-slate-500 font-bold block">Lugar / Oficina:</span>
                        <span className="font-black text-slate-900 text-sm truncate block">
                          {notice.citatorioLocation || 'Dirección Escolar'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirmation Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    {notice.isConfirmedByTutor ? (
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-[#0D6938]" />
                        <span>
                          Acuse de Asistencia Confirmado por el Tutor
                          {notice.confirmedAt && ` (${new Date(notice.confirmedAt).toLocaleDateString('es-MX')})`}
                        </span>
                      </div>
                    ) : notice.requiresConfirmation ? (
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Se requiere confirmación formal de recibido</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">
                        Aviso Informativo Oficial
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!notice.isConfirmedByTutor && notice.requiresConfirmation && (
                      <button
                        type="button"
                        onClick={() => confirmNoticeReceipt(notice.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D6938] hover:bg-[#094d28] text-white text-xs font-black transition active:scale-95 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Asistencia / Enterado</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNoticeForPrint(notice);
                        setIsPrintModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition cursor-pointer"
                      title="Abrir formato oficial membretado para imprimir"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Official Citation Print Modal */}
      <OfficialCitationPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        notice={selectedNoticeForPrint}
        student={student}
      />
    </div>
  );
};
