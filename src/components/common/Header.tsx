import React, { useState } from 'react';
import { Menu, LogOut, Shield, Users, UserCheck, School, Bell, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserManualModal } from './UserManualModal';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, logout, toggleSidebar, notices, activeTab, setActiveTab } = useApp();
  const [isManualOpen, setIsManualOpen] = useState(false);

  const unreadCount = notices.filter(n => !n.isRead).length;

  const roleMeta = {
    admin: {
      label: 'Administrador',
      icon: Shield,
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    staff: {
      label: 'Docente / Puerta',
      icon: UserCheck,
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    parent: {
      label: 'Padres de Familia',
      icon: Users,
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
  };

  const currentMeta = currentRole ? roleMeta[currentRole] : null;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-6 py-3 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Hamburger (ONLY for desktop lg) + Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentRole && (
            <button
              id="sidebar-toggle-btn"
              onClick={toggleSidebar}
              className="hidden lg:flex p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir barra lateral de navegación"
              title="Menú de Navegación Lateral"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
          )}

          {/* Logo brand */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-sm font-black">
              <School className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base sm:text-lg lg:text-xl tracking-tight leading-tight uppercase">
                Acceso Escolar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bold tracking-wide hidden sm:block uppercase">
                Control Escolar & Accesos • 700 Alumnos
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Role badge, PWA install button, and Logout button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Parent Live Notification Indicator */}
          {currentRole === 'parent' && (
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition active:scale-95 cursor-pointer"
              title="Notificaciones de acceso escolar"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Manual de Usuario PDF Button */}
          <button
            onClick={() => setIsManualOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer shadow-2xs"
            title="Abrir y Descargar Manual del Usuario en PDF para el Cliente"
          >
            <FileText className="w-4 h-4 text-blue-700" />
            <span className="hidden sm:inline">Manual PDF</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Current Role badge info */}
          {currentRole && currentMeta && (
            <div className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-extrabold ${currentMeta.badgeColor}`}>
              <currentMeta.icon className="w-4 h-4" />
              <span>{currentMeta.label}</span>
            </div>
          )}

          {/* Logout button (Always visible and functional to switch roles via Home) */}
          {currentRole ? (
            <button
              id="logout-btn"
              onClick={logout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Cerrar sesión y volver al inicio para navegar en otros roles"
            >
              <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="whitespace-nowrap font-bold">Cerrar Sesión</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Printable / Downloadable PDF User Manual Modal */}
      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </header>
  );
};
