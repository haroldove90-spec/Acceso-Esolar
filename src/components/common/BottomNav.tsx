import React from 'react';
import { Users, UserCheck, BarChart3, QrCode, Clock, Send, Bell, IdCard, Megaphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BottomNavItem {
  id: string;
  label: string;
  icon: any;
  badgeCount?: number;
}

export const BottomNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, notices } = useApp();

  if (!currentRole) return null;

  const adminNavItems: BottomNavItem[] = [
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'staff', label: 'Personal', icon: UserCheck },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  const staffNavItems: BottomNavItem[] = [
    { id: 'access', label: 'Acceso QR', icon: QrCode },
    { id: 'status', label: 'Estatus Vivo', icon: Clock },
    { id: 'notices', label: 'Avisos', icon: Send },
  ];

  const parentNavItems: BottomNavItem[] = [
    { id: 'notifications', label: 'Alertas', icon: Bell, badgeCount: notices.filter(n => !n.isRead).length },
    { id: 'student_profile', label: 'Credencial', icon: IdCard },
    { id: 'announcements', label: 'Tablón', icon: Megaphone },
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
    >
      <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
        {currentItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.badgeCount;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-blue-600 font-extrabold bg-blue-50/80'
                  : 'text-slate-400 hover:text-slate-600 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {typeof badge === 'number' && badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-wider uppercase">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5 shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
