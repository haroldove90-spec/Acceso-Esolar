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
    { id: 'status', label: 'Estatus', icon: Clock },
    { id: 'notices', label: 'Avisos', icon: Send },
  ];

  const parentNavItems: BottomNavItem[] = [
    { id: 'notifications', label: 'Alertas', icon: Bell, badgeCount: notices.filter(n => !n.isRead).length },
    { id: 'access_history', label: 'Accesos', icon: Clock },
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="grid grid-flow-col auto-cols-fr gap-1.5 max-w-lg mx-auto">
        {currentItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badge = item.badgeCount;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-blue-700 font-black bg-blue-50/90 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {typeof badge === 'number' && badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-xs mt-1 tracking-wide uppercase font-black">{item.label}</span>
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
