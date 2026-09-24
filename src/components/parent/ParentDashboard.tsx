import React from 'react';
import { Users, QrCode, Bell, Clock, IdCard, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstantNotificationsModule } from './InstantNotificationsModule';
import { StudentProfileModule } from './StudentProfileModule';
import { AnnouncementsBoardModule } from './AnnouncementsBoardModule';
import { ParentAccessLogModule } from './ParentAccessLogModule';
import { StudentEntranceNotificationModal } from './StudentEntranceNotificationModal';
import { ParentEntranceDemoBanner } from './ParentEntranceDemoBanner';

export const ParentDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    parentSelectedStudentId,
    setParentSelectedStudentId,
    entranceAlert,
    setEntranceAlert,
    simulateStudentEntrance,
    notices,
  } = useApp();

  const unreadNotices = notices.filter(n => !n.isRead).length;

  return (
    <div className="space-y-5">
      {/* Top Mobile/Parent Header with Student Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D6938] border-b-4 border-[#D91A2A] text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Users className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Portal de Padres de Familia
              </span>
              <span className="bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full border border-white/30">
                Monitoreo Escolar
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Control de Asistencia & Avisos
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              Notificaciones de entrada en portón, registro histórico y credencial digital para WhatsApp.
            </p>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-black/25 p-2 rounded-2xl border border-white/20 self-start md:self-auto">
          <span className="text-xs sm:text-sm text-amber-200 pl-2 font-black whitespace-nowrap">Alumno:</span>
          <select
            value={parentSelectedStudentId}
            onChange={e => setParentSelectedStudentId(e.target.value)}
            className="bg-[#111827] text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            {students.slice(0, 6).map(stu => (
              <option key={stu.id} value={stu.id}>
                {stu.fullName} ({stu.grade} {stu.group})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Parent Navigation Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'notifications' || !activeTab || (activeTab !== 'access_history' && activeTab !== 'student_profile' && activeTab !== 'announcements')
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificaciones & Beep</span>
          {unreadNotices > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#D91A2A] text-white text-[10px] font-black rounded-full">
              {unreadNotices}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('access_history')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'access_history'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Registro de Accesos</span>
        </button>

        <button
          onClick={() => setActiveTab('student_profile')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'student_profile'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <IdCard className="w-4 h-4" />
          <span>Credencial QR & WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Tablón de Avisos</span>
        </button>
      </div>

      {/* Interactive Demonstration Banner for Client */}
      <ParentEntranceDemoBanner
        onSimulateEntrance={(isLate) => {
          simulateStudentEntrance(parentSelectedStudentId, isLate);
        }}
      />

      {/* Active Tab View */}
      <div className="animate-in fade-in duration-200">
        {(activeTab === 'notifications' || (!activeTab || (activeTab !== 'access_history' && activeTab !== 'student_profile' && activeTab !== 'announcements'))) && (
          <InstantNotificationsModule />
        )}
        {activeTab === 'access_history' && <ParentAccessLogModule />}
        {activeTab === 'student_profile' && <StudentProfileModule />}
        {activeTab === 'announcements' && <AnnouncementsBoardModule />}
      </div>

      {/* Floating Real-time Entrance Notification Window (Triggered by QR Scan or Simulation) */}
      <StudentEntranceNotificationModal
        isOpen={!!entranceAlert}
        student={entranceAlert?.student || null}
        accessRecord={entranceAlert?.accessRecord || null}
        onClose={() => setEntranceAlert(null)}
        onViewHistory={() => setActiveTab('access_history')}
      />
    </div>
  );
};
