import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentsModule } from './StudentsModule';
import { StaffModule } from './StaffModule';
import { ReportsModule } from './ReportsModule';

export const AdminDashboard: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="space-y-5">
      {/* Top Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                Dirección / Control Escolar
              </span>
              <span className="bg-indigo-400/20 text-indigo-200 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-300/30">
                Padrón 700 Alumnos
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Panel Administrativo Institucional
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-0.5">
              Supervisión de matrícula escolar, registro docente y reportería de accesos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-bold text-white">Servidor Activo</span>
        </div>
      </div>

      {/* Render Active Module */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'students' && <StudentsModule />}
        {activeTab === 'staff' && <StaffModule />}
        {activeTab === 'reports' && <ReportsModule />}
      </div>
    </div>
  );
};
