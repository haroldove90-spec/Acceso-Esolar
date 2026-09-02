import React from 'react';
import { Bell, IdCard, Megaphone, Users, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstantNotificationsModule } from './InstantNotificationsModule';
import { StudentProfileModule } from './StudentProfileModule';
import { AnnouncementsBoardModule } from './AnnouncementsBoardModule';

export const ParentDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    parentSelectedStudentId,
    setParentSelectedStudentId,
    notices
  } = useApp();

  const currentStudent = students.find(s => s.id === parentSelectedStudentId) || students[0];

  const unreadCount = notices.filter(
    n => !n.isRead && (n.studentId === currentStudent?.id || n.studentName === currentStudent?.fullName)
  ).length;

  const tabs = [
    { id: 'notifications', label: 'Notificaciones de Acceso', icon: Bell, badge: unreadCount },
    { id: 'student_profile', label: 'Perfil y Asistencia', icon: IdCard },
    { id: 'announcements', label: 'Tablón de Avisos', icon: Megaphone },
  ];

  return (
    <div className="space-y-4">
      {/* Top Mobile/Parent Header with Student Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-sky-900 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                Portal de Padres de Familia
              </span>
              <span className="bg-sky-400/20 text-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-300/30">
                Vista Móvil / App
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              Control de Asistencia & Avisos
            </h2>
          </div>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10">
          <span className="text-xs text-sky-200 pl-2 font-semibold hidden sm:inline">Hijo(a):</span>
          <select
            value={parentSelectedStudentId}
            onChange={e => setParentSelectedStudentId(e.target.value)}
            className="bg-sky-950/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-sky-400/30 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {students.slice(0, 4).map(stu => (
              <option key={stu.id} value={stu.id}>
                {stu.fullName} ({stu.grade} {stu.group})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Tabs switch (mobile has bottom bar) */}
      <div className="hidden lg:flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      {activeTab === 'notifications' && <InstantNotificationsModule />}
      {activeTab === 'student_profile' && <StudentProfileModule />}
      {activeTab === 'announcements' && <AnnouncementsBoardModule />}
    </div>
  );
};
