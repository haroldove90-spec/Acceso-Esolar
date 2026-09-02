import React from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, ShieldCheck, DoorClosed, MessageSquare, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InstantNotificationsModule: React.FC = () => {
  const { notices, parentSelectedStudentId, students, markNoticeAsRead, accessRecords } = useApp();

  const currentStudent = students.find(s => s.id === parentSelectedStudentId) || students[0];

  const studentNotices = notices.filter(
    n => n.studentId === currentStudent?.id || n.studentName === currentStudent?.fullName
  );

  const studentAccesses = accessRecords.filter(
    a => a.studentId === currentStudent?.id || a.enrollmentId === currentStudent?.enrollmentId
  );

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Live Push Notifications Card */}
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-3xl p-5 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Bell className="w-5 h-5 text-white animate-bounce" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black leading-tight">Alertas de Acceso en Tiempo Real</h3>
              <p className="text-[11px] text-sky-100">Notificaciones automáticas vinculadas al móvil del tutor</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-full border border-white/30">
            Push Activo
          </span>
        </div>

        {/* Latest Entry Summary Box */}
        {studentAccesses.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-sky-200 block">Último Movimiento Registrado:</span>
                <p className="text-xs sm:text-sm font-extrabold text-white">
                  {studentAccesses[0].type} • {studentAccesses[0].formattedTime}
                </p>
                <span className="text-[10px] text-sky-100">{studentAccesses[0].gate}</span>
              </div>
            </div>
            <span className="text-xs font-black bg-emerald-400/30 text-white px-2.5 py-1 rounded-xl border border-emerald-300/40">
              {studentAccesses[0].status === 'late' ? 'Retardo' : 'Puntual'}
            </span>
          </div>
        ) : (
          <div className="p-3 bg-white/10 rounded-xl text-xs text-sky-100">
            Aún no se registran movimientos para este día.
          </div>
        )}
      </div>

      {/* Instant Notices Feed */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-600" /> Historial de Alertas & Comunicados Directos
          </h3>
          <span className="text-xs text-slate-400 font-semibold">{studentNotices.length} recibidos</span>
        </div>

        <div className="space-y-3">
          {studentNotices.length > 0 ? (
            studentNotices.map(notice => (
              <div
                key={notice.id}
                onClick={() => markNoticeAsRead(notice.id)}
                className={`p-4 rounded-2xl border transition shadow-xs text-xs space-y-2 cursor-pointer ${
                  notice.isRead
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-400/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        notice.priority === 'Importante'
                          ? 'bg-amber-100 text-amber-800'
                          : notice.priority === 'Urgente'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {notice.category}
                    </span>
                    {!notice.isRead && (
                      <span className="bg-sky-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(notice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">{notice.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{notice.message}</p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Enviado por: <strong>{notice.senderStaffName}</strong> ({notice.senderRole})</span>
                  <span className="flex items-center gap-1 font-semibold text-sky-700">
                    <Check className="w-3.5 h-3.5" /> Confirmado
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs space-y-1">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">No hay avisos pendientes</p>
              <p className="text-[11px]">Las notificaciones de entrada y avisos de docentes aparecerán aquí en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
