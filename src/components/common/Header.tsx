import React, { useState } from 'react';
import { Menu, LogOut, Shield, Users, UserCheck, Bell, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserManualModal } from './UserManualModal';

export const Header: React.FC = () => {
  const { currentRole, logout, toggleSidebar, notices, setActiveTab } = useApp();
  const [isManualOpen, setIsManualOpen] = useState(false);

  const unreadCount = notices.filter(n => !n.isRead).length;

  const roleMeta = {
    admin: {
      label: 'Dirección',
      icon: Shield,
      badgeColor: 'bg-red-50 text-[#D91A2A] border-red-200',
    },
    staff: {
      label: 'Docente / Puerta',
      icon: UserCheck,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    parent: {
      label: 'Padres de Familia',
      icon: Users,
      badgeColor: 'bg-emerald-50 text-[#0D6938] border-emerald-200',
    },
  };

  const currentMeta = currentRole ? roleMeta[currentRole] : null;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white border-b-2 border-[#D91A2A]/20 px-3 sm:px-6 py-2.5 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Hamburger (ONLY for desktop lg) + Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {currentRole && (
            <button
              id="sidebar-toggle-btn"
              onClick={toggleSidebar}
              className="hidden lg:flex p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
              aria-label="Abrir barra lateral de navegación"
              title="Menú de Navegación Lateral"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
          )}

          {/* Official Full School Logo (not encapsulated) and Title: Moises saenz */}
          <div className="flex items-center gap-2 sm:gap-3 select-none min-w-0">
            <img
              src="https://kabris.com.mx/moiseslogo.png"
              alt="Moises saenz"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0 drop-shadow-xs"
              loading="eager"
            />
            <h1 className="font-black text-slate-900 text-base sm:text-lg md:text-xl tracking-tight leading-none truncate">
              Moises saenz
            </h1>
          </div>
        </div>

        {/* Right side: Role badge, PWA install button, and Logout button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Parent Live Notification Indicator */}
          {currentRole === 'parent' && (
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl text-slate-700 hover:text-[#0D6938] hover:bg-emerald-50 transition active:scale-95 cursor-pointer"
              title="Notificaciones de acceso escolar"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#D91A2A] text-[10px] font-black text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Manual de Usuario PDF Button */}
          <button
            onClick={() => setIsManualOpen(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#D91A2A] text-xs sm:text-sm font-black transition active:scale-95 cursor-pointer shadow-2xs"
            title="Abrir y Descargar Manual del Usuario en PDF para el Cliente"
          >
            <FileText className="w-4 h-4 text-[#D91A2A] shrink-0" />
            <span className="hidden md:inline">Manual PDF</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Current Role badge info */}
          {currentRole && currentMeta && (
            <div className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-extrabold ${currentMeta.badgeColor}`}>
              <currentMeta.icon className="w-4 h-4" />
              <span>{currentMeta.label}</span>
            </div>
          )}

          {/* Logout button */}
          {currentRole ? (
            <button
              id="logout-btn"
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#111827] hover:bg-black transition-all shadow-sm active:scale-95 cursor-pointer border border-slate-800"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap font-bold">Cerrar Sesión</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Printable / Downloadable PDF User Manual Modal */}
      <UserManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </header>
  );
};
