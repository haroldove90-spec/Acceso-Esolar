import React from 'react';
import {
  Users,
  UserCheck,
  BarChart3,
  QrCode,
  Clock,
  Send,
  Bell,
  IdCard,
  Megaphone,
  X,
  LogOut,
  Shield,
  ChevronRight,
  School,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentRole, setCurrentRole, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, logout } = useApp();

  if (!currentRole) return null;

  const adminNavItems = [
    { id: 'students', label: 'Gestión de Alumnos', sub: 'Padrón 700 y Grupos', icon: Users },
    { id: 'staff', label: 'Gestión de Personal', sub: 'Docentes y Portones', icon: UserCheck },
    { id: 'reports', label: 'Módulo de Reportes', sub: 'Historial e Incidencias', icon: BarChart3 },
  ];

  const staffNavItems = [
    { id: 'access', label: 'Control de Acceso Ágil', sub: 'Escaneo QR y Registro', icon: QrCode },
    { id: 'status', label: 'Estatus en Tiempo Real', sub: 'Puntualidad en vivo', icon: Clock },
    { id: 'notices', label: 'Avisos Directos', sub: 'Reportes al Tutor', icon: Send },
  ];

  const parentNavItems = [
    { id: 'notifications', label: 'Notificaciones de Acceso', sub: 'Alertas automáticas', icon: Bell },
    { id: 'student_profile', label: 'Perfil y Asistencia', sub: 'Historial y Credencial', icon: IdCard },
    { id: 'announcements', label: 'Tablón de Avisos', sub: 'Circulares y Eventos', icon: Megaphone },
  ];

  const currentItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'staff'
      ? staffNavItems
      : parentNavItems;

  const rolesList: { role: RoleType; name: string; icon: any }[] = [
    { role: 'admin', name: 'Administrador (Dirección)', icon: Shield },
    { role: 'staff', name: 'Docente / Puerta', icon: UserCheck },
    { role: 'parent', name: 'Padres de Familia / App', icon: Users },
  ];

  return (
    <>
      {/* Backdrop for mobile / overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="app-navigation-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              <p className="text-xs font-black text-slate-800 leading-tight uppercase">Sistema Aire Aondicionado</p>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Módulos Escolares</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Role Header */}
        <div className="p-4 bg-blue-50/60 border-b border-blue-100/60">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Rol Activo:</span>
          <p className="text-sm font-extrabold text-slate-900 mt-0.5">
            {currentRole === 'admin'
              ? 'Administrador (Dirección)'
              : currentRole === 'staff'
              ? 'Docente / Personal de Puerta'
              : 'Padres de Familia / Tutores'}
          </p>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Módulos del Rol
          </div>
          {currentItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm leading-tight font-bold">{item.label}</div>
                    <div
                      className={`text-[11px] ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
              </button>
            );
          })}

          {/* Quick Role Switcher section */}
          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Cambiar de Rol
          </div>
          <div className="space-y-1">
            {rolesList.map(r => {
              const Icon = r.icon;
              const isCurrent = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentRole(r.role);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition font-semibold ${
                    isCurrent
                      ? 'bg-slate-100 font-bold text-blue-600 border border-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with logout button */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión (Ir a Inicio)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
