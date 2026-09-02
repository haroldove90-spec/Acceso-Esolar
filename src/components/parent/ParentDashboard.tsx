import React from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstantNotificationsModule } from './InstantNotificationsModule';
import { StudentProfileModule } from './StudentProfileModule';
import { AnnouncementsBoardModule } from './AnnouncementsBoardModule';

export const ParentDashboard: React.FC = () => {
  const {
    activeTab,
    students,
    parentSelectedStudentId,
    setParentSelectedStudentId,
  } = useApp();

  return (
    <div className="space-y-5">
      {/* Top Mobile/Parent Header with Student Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
            <Users className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                Portal de Padres de Familia
              </span>
              <span className="bg-sky-400/20 text-sky-200 text-xs font-black px-2.5 py-0.5 rounded-full border border-sky-300/30">
                Monitoreo Escolar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Control de Asistencia & Avisos
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 font-medium mt-0.5">
              Notificaciones de entrada en portón, credencial digital con QR y comunicados institucionales.
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/10 self-start md:self-auto">
          <span className="text-xs sm:text-sm text-sky-100 pl-2 font-bold whitespace-nowrap">Alumno:</span>
          <select
            value={parentSelectedStudentId}
            onChange={e => setParentSelectedStudentId(e.target.value)}
            className="bg-sky-950 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
          >
            {students.slice(0, 6).map(stu => (
              <option key={stu.id} value={stu.id}>
                {stu.fullName} ({stu.grade} {stu.group})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Tab View */}
      <div className="animate-in fade-in duration-200">
        {(activeTab === 'notifications' || (!activeTab || (activeTab !== 'student_profile' && activeTab !== 'announcements'))) && (
          <InstantNotificationsModule />
        )}
        {activeTab === 'student_profile' && <StudentProfileModule />}
        {activeTab === 'announcements' && <AnnouncementsBoardModule />}
      </div>
    </div>
  );
};
