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
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-900">Emisión de Avisos Directos al Tutor</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Envío instantáneo de reportes de conducta, notas de puntualidad y comunicados directos al móvil del padre/tutor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" /> Redactar Aviso Directo
            </span>

            <form onSubmit={handleSend} className="space-y-3.5 text-xs sm:text-sm">
              {/* Student selector */}
              <div>
                <label className="font-black text-slate-800 block mb-1">Seleccionar Alumno Destinatario *</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {students.map(stu => (
                    <option key={stu.id} value={stu.id}>
                      {stu.fullName} ({stu.grade} {stu.group} - Tutor: {stu.tutorName})
                    </option>
                  ))}
                </select>

                {selectedStudent && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-blue-950">Tutor: <strong className="font-black text-slate-900">{selectedStudent.tutorName}</strong></span>
                    <span className="text-blue-700 font-mono font-bold">{selectedStudent.tutorPhone}</span>
                  </div>
                )}
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Conducta">Conducta</option>
                    <option value="Puntualidad">Puntualidad</option>
                    <option value="Salud / Enfermería">Salud / Enfermería</option>
                    <option value="Tareas y Materiales">Tareas y Materiales</option>
                    <option value="Aviso General">Aviso General</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 block mb-1">Nivel de Prioridad</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Importante">Importante</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-black text-slate-800 block mb-1">Asunto / Título del Aviso *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Felicitación por desempeño en clase"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900 text-xs sm:text-sm"
                />
              </div>

              {/* Message */}
              <div>
                <label className="font-black text-slate-800 block mb-1">Mensaje para el Tutor *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba la descripción concisa..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-800 text-xs sm:text-sm"
                />
              </div>

              {/* Quick Template pills */}
              <div>
                <span className="text-xs font-black text-slate-500 block mb-2">Plantillas Rápidas:</span>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCategory(t.cat);
                        setTitle(t.title);
                        setMessage(t.text);
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 transition cursor-pointer"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>Enviar Notificación Instantánea al Tutor</span>
              </button>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Historial de Avisos Emitidos
              </span>
              <span className="text-xs font-bold text-slate-500">{notices.length} avisos</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {notices.map(notice => (
                <div
                  key={notice.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:bg-white hover:border-emerald-300 transition shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                        {notice.category}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm sm:text-base mt-1.5">{notice.title}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {new Date(notice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">{notice.message}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>Destinatario: <strong className="font-black text-slate-900">{notice.studentName}</strong> (Tutor: {notice.tutorName})</span>
                    <span className="text-emerald-700 font-black flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> Enviado
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
