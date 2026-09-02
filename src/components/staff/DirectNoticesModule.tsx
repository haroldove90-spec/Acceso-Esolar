import React, { useState } from 'react';
import { Send, MessageSquare, AlertCircle, CheckCircle, Clock, User, Phone, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DirectNotice } from '../../types';

export const DirectNoticesModule: React.FC = () => {
  const { students, notices, sendDirectNotice } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<DirectNotice['category']>('Conducta');
  const [priority, setPriority] = useState<DirectNotice['priority']>('Normal');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !title.trim() || !message.trim()) return;

    sendDirectNotice(selectedStudentId, category, title, message, priority);
    setTitle('');
    setMessage('');
  };

  const quickTemplates = [
    {
      cat: 'Conducta' as const,
      title: 'Reporte de Excelente Conducta',
      text: 'El alumno mostró una actitud ejemplar y colaborativa durante la jornada escolar.',
    },
    {
      cat: 'Puntualidad' as const,
      title: 'Aviso de Retardo Reiterado',
      text: 'Estimado tutor, el alumno ingresó con retardo al plantel. Solicitamos su apoyo para ajustar horarios de traslado.',
    },
    {
      cat: 'Salud / Enfermería' as const,
      title: 'Reporte de Malestar Leve',
      text: 'El alumno acudió a enfermería por dolor de cabeza leve; se encuentra descansando e hidratado.',
    },
    {
      cat: 'Tareas y Materiales' as const,
      title: 'Recordatorio de Material de Trabajo',
      text: 'Favor de verificar el envío del cuaderno de actividades y libros para la sesión de mañana.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Emisión de Avisos Directos al Tutor</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Envío instantáneo de reportes de conducta, notas de puntualidad y comunicados directos al móvil del padre/tutor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> Redactar Aviso Directo
            </span>

            <form onSubmit={handleSend} className="space-y-3 text-xs">
              {/* Student selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Seleccionar Alumno Destinatario *</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {students.map(stu => (
                    <option key={stu.id} value={stu.id}>
                      {stu.fullName} ({stu.grade} {stu.group} - Tutor: {stu.tutorName})
                    </option>
                  ))}
                </select>

                {selectedStudent && (
                  <div className="mt-2 p-2.5 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between text-[11px]">
                    <span className="text-sky-900 font-medium">Tutor: <strong>{selectedStudent.tutorName}</strong></span>
                    <span className="text-sky-700 font-mono">{selectedStudent.tutorPhone}</span>
                  </div>
                )}
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Conducta">Conducta</option>
                    <option value="Puntualidad">Puntualidad</option>
                    <option value="Salud / Enfermería">Salud / Enfermería</option>
                    <option value="Tareas y Materiales">Tareas y Materiales</option>
                    <option value="Aviso General">Aviso General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel de Prioridad</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Importante">Importante</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Asunto / Título del Aviso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Felicitación por desempeño en clase"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800"
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mensaje para el Tutor *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba la descripción concisa..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Quick Template pills */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Plantillas Rápidas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCategory(t.cat);
                        setTitle(t.title);
                        setMessage(t.text);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 transition"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Notificación Instantánea al Tutor</span>
              </button>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Historial de Avisos Emitidos
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">{notices.length} avisos</span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:bg-white hover:border-emerald-300 transition shadow-xs text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {notice.category}
                      </span>
                      <h4 className="font-bold text-slate-900 mt-1">{notice.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(notice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{notice.message}</p>

                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Destinatario: <strong>{notice.studentName}</strong> (Tutor: {notice.tutorName})</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Enviado
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
