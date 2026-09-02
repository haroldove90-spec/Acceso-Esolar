import React from 'react';
import { Menu, LogOut, Shield, Users, UserCheck, School } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, logout, toggleSidebar, notices, activeTab } = useApp();

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
    </header>
  );
};
