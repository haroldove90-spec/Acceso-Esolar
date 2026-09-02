import React from 'react';
import { Menu, LogOut, Shield, Users, UserCheck, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, logout, toggleSidebar, notices, activeTab } = useApp();

  const roleMeta = {
    admin: {
      label: 'Administrador',
      icon: Shield,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    staff: {
      label: 'Docente / Puerta',
      icon: UserCheck,
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    parent: {
      label: 'Padres de Familia',
      icon: Users,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  };

  const currentMeta = currentRole ? roleMeta[currentRole] : null;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left side: Hamburger (for fullscreen/desktop sidebar toggle) + Logo + Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          {currentRole && (
            <button
              id="sidebar-toggle-btn"
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Abrir barra lateral de navegación"
              title="Menú de Navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo brand */}
          <div
            onClick={() => currentRole && logout()}
            className={`flex items-center gap-2.5 select-none ${
              currentRole ? 'cursor-pointer' : ''
            }`}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm font-black text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.05-.85 1.9-1.9 1.9H5.65c-1.05 0-1.9-.85-1.9-1.9v-4.25m16.5 0c0-1.05-.85-1.9-1.9-1.9H5.65c-1.05 0-1.9.85-1.9 1.9m16.5 0h-16.5M12 3v9m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight leading-tight uppercase">
                Sistema Aire Aondicionado
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider hidden sm:block uppercase">
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
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${currentMeta.badgeColor}`}>
              <currentMeta.icon className="w-3.5 h-3.5" />
              <span>{currentMeta.label}</span>
            </div>
          )}

          {/* Logout */}
          {currentRole ? (
            <button
              id="logout-btn"
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-xs active:scale-95"
              title="Cerrar sesión y volver al inicio para navegar en otros roles"
            >
              <LogOut className="w-4 h-4" />
              <span className="whitespace-nowrap hidden sm:inline">Cerrar Sesión</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
