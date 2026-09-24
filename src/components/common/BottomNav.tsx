import React from 'react';
import { Users, UserCheck, BarChart3, QrCode, Clock, Send, Bell, IdCard, Megaphone, FileText, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavItem {
  id: string;
  label: string;
  icon: any;
  badgeCount?: number;
}

export const BottomNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, notices, parentSelectedStudentId } = useApp();

  if (!currentRole) return null;

  const pendingCitatorios = notices.filter(
    n => (n.studentId === parentSelectedStudentId || n.targetScope === 'masivo') &&
         (n.category === 'Citatorio' || n.category === 'Citatorio Dirección') &&
         !n.isConfirmedByTutor
  ).length;

  const adminNavItems: BottomNavItem[] = [
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'staff', label: 'Personal', icon: UserCheck },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'manual', label: 'Manual', icon: BookOpen },
  ];

  const staffNavItems: BottomNavItem[] = [
    { id: 'access', label: 'Acceso QR', icon: QrCode },
    { id: 'status', label: 'Estatus', icon: Clock },
    { id: 'notices', label: 'Avisos', icon: Send },
    { id: 'manual', label: 'Manual', icon: BookOpen },
  ];

  const parentNavItems: BottomNavItem[] = [
    { id: 'reports_citatorios', label: 'Citatorios', icon: FileText, badgeCount: pendingCitatorios },
    { id: 'notifications', label: 'Alertas', icon: Bell, badgeCount: notices.filter(n => !n.isRead).length },
    { id: 'access_history', label: 'Accesos', icon: Clock },
    { id: 'student_profile', label: 'Credencial', icon: IdCard },
    { id: 'announcements', label: 'Tablón', icon: Megaphone },
    { id: 'manual', label: 'Manual', icon: BookOpen },
  ];

  const currentItems: BottomNavItem[] =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'staff'
      ? staffNavItems
      : parentNavItems;

  return (
    <nav
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-flow-col auto-cols-fr gap-1.5 max-w-lg mx-auto">
        {currentItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.badgeCount;

          const activeClass =
            currentRole === 'admin'
              ? 'text-[#D91A2A] font-black bg-red-50/90 shadow-xs border border-red-200'
              : currentRole === 'staff'
              ? 'text-[#D97706] font-black bg-amber-50/90 shadow-xs border border-amber-200'
              : 'text-[#0D6938] font-black bg-emerald-50/90 shadow-xs border border-emerald-200';

          const dotColor =
            currentRole === 'admin'
              ? 'bg-[#D91A2A]'
              : currentRole === 'staff'
              ? 'bg-[#D97706]'
              : 'bg-[#0D6938]';

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? activeClass
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {typeof badge === 'number' && badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-[#D91A2A] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-xs mt-1 tracking-wide uppercase font-black">{item.label}</span>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-0.5 shadow-xs`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
