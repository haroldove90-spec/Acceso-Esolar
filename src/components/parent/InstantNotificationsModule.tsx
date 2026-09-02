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
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-5 sm:p-6 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <Bell className="w-6 h-6 text-white animate-bounce" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">Alertas de Acceso en Tiempo Real</h3>
              <p className="text-xs sm:text-sm font-semibold text-blue-100">Notificaciones automáticas vinculadas al móvil del tutor</p>
            </div>
          </div>
          <span className="text-xs font-black bg-white/25 px-3.5 py-1.5 rounded-full border border-white/30 tracking-wide">
            Push Activo
          </span>
        </div>

        {/* Latest Entry Summary Box */}
        {studentAccesses.length > 0 ? (
          <div className="bg-white/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-200 block">Último Movimiento Registrado:</span>
                <p className="text-sm sm:text-base font-black text-white">
                  {studentAccesses[0].type} • {studentAccesses[0].formattedTime}
                </p>
                <span className="text-xs text-blue-100 font-semibold">{studentAccesses[0].gate}</span>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black bg-emerald-500/30 text-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300/40 shrink-0">
              {studentAccesses[0].status === 'late' ? 'Retardo' : 'Puntual'}
            </span>
          </div>
        ) : (
          <div className="p-4 bg-white/10 rounded-2xl text-xs sm:text-sm text-blue-100 font-semibold">
            Aún no se registran movimientos para este día.
          </div>
        )}
      </div>

      {/* Instant Notices Feed */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" /> Historial de Alertas & Comunicados Directos
          </h3>
          <span className="text-xs sm:text-sm text-slate-500 font-bold">{studentNotices.length} recibidos</span>
        </div>

        <div className="space-y-3.5">
          {studentNotices.length > 0 ? (
            studentNotices.map(notice => (
              <div
                key={notice.id}
                onClick={() => markNoticeAsRead(notice.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition shadow-xs space-y-2.5 cursor-pointer ${
                  notice.isRead
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    : 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                        notice.priority === 'Importante'
                          ? 'bg-amber-100 text-amber-900'
                          : notice.priority === 'Urgente'
                          ? 'bg-rose-100 text-rose-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {notice.category}
                    </span>
                    {!notice.isRead && (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {new Date(notice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">{notice.title}</h4>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">{notice.message}</p>

                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Enviado por: <strong className="font-black text-slate-900">{notice.senderStaffName}</strong> ({notice.senderRole})</span>
                  <span className="flex items-center gap-1 font-black text-blue-700">
                    <Check className="w-4 h-4 stroke-[3]" /> Confirmado
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs sm:text-sm space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-black text-slate-800 text-sm sm:text-base">No hay avisos pendientes</p>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Las notificaciones de entrada y avisos de docentes aparecerán aquí en tiempo real.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
