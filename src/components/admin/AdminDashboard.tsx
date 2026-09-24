import React from 'react';
import { ShieldCheck, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentsModule } from './StudentsModule';
import { StaffModule } from './StaffModule';
import { ReportsModule } from './ReportsModule';
import { UserManualModule } from '../common/UserManualModule';

export const AdminDashboard: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="space-y-5">
      {/* Top Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border-b-4 border-[#D91A2A] text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-red-400">
                Dirección / Control Escolar
              </span>
              <span className="bg-[#D91A2A]/30 text-white text-xs font-black px-2.5 py-0.5 rounded-full border border-red-400/40">
                Gestión Institucional
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Panel Administrativo Institucional
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Supervisión de matrícula escolar, registro docente y reportería de accesos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-bold text-white">Servidor Activo</span>
        </div>
      </div>

      {/* Admin Module Switcher Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'students' || (!activeTab || (activeTab !== 'staff' && activeTab !== 'reports' && activeTab !== 'manual'))
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Padrón de Alumnos
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Personal & Portones
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-[#D91A2A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          📝 Reportes, Citatorios & Avisos
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Manual de Usuario</span>
        </button>
      </div>

      {/* Render Active Module */}
      <div className="animate-in fade-in duration-200">
        {(activeTab === 'students' || (!activeTab || (activeTab !== 'staff' && activeTab !== 'reports' && activeTab !== 'manual'))) && <StudentsModule />}
        {activeTab === 'staff' && <StaffModule />}
        {activeTab === 'reports' && <ReportsModule />}
        {activeTab === 'manual' && <UserManualModule initialRole="admin" />}
      </div>
    </div>
  );
};
