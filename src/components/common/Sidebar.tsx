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
  School
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, logout } = useApp();

  if (!currentRole) return null;

  const adminNavItems = [
    { id: 'students', label: 'Gestión de Alumnos y Grupos', sub: 'Padrón 700 Plazas y Tutores', icon: Users },
    { id: 'staff', label: 'Gestión de Personal Escolar', sub: 'Docentes y Portones Asignados', icon: UserCheck },
    { id: 'reports', label: 'Módulo de Reportes & Historial', sub: 'Estadísticas e Incidencias', icon: BarChart3 },
  ];

  const staffNavItems = [
    { id: 'access', label: 'Control de Acceso Ágil', sub: 'Escaneo QR y Entrada/Salida', icon: QrCode },
    { id: 'status', label: 'Estatus en Tiempo Real', sub: 'Puntualidad en vivo y Retardos', icon: Clock },
    { id: 'notices', label: 'Avisos Directos al Tutor', sub: 'Comunicados y Alertas al Móvil', icon: Send },
  ];

  const parentNavItems = [
    { id: 'notifications', label: 'Notificaciones de Acceso', sub: 'Alertas push y confirmaciones en vivo', icon: Bell },
    { id: 'access_history', label: 'Registro de Accesos', sub: 'Historial con día, hora y portón', icon: Clock },
    { id: 'student_profile', label: 'Credencial QR & WhatsApp', sub: 'Generar código y enviar a hijo', icon: IdCard },
    { id: 'announcements', label: 'Tablón de Avisos y Eventos', sub: 'Circulares Oficiales de Dirección', icon: Megaphone },
  ];

  const currentItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'staff'
      ? staffNavItems
      : parentNavItems;

  return (
    <>
      {/* Backdrop for overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* Sidebar panel */}
      <aside
        id="app-navigation-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-80 sm:w-88 bg-white border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
              <School className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900 leading-tight uppercase">Acceso Escolar</p>
              <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Menú de Navegación</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* Current Active Role Header */}
        <div className="p-4 sm:p-5 bg-blue-50/80 border-b border-blue-100">
          <span className="text-xs font-black text-blue-800 uppercase tracking-wider block">Rol Activo:</span>
          <p className="text-base font-black text-slate-900 mt-0.5">
            {currentRole === 'admin'
              ? 'Administrador (Dirección)'
              : currentRole === 'staff'
              ? 'Docente / Personal de Puerta'
              : 'Padres de Familia / Tutores'}
          </p>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-2 py-1 text-xs font-black text-slate-400 uppercase tracking-wider">
            Módulos del Sistema
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
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base leading-snug font-bold">{item.label}</div>
                    <div
                      className={`text-xs ${
                        isActive ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Footer with logout button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 p-3 rounded-2xl text-sm font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión (Ir a Inicio)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
