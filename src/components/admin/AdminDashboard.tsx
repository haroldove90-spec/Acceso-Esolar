import React from 'react';
import { Users, UserCheck, BarChart3, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentsModule } from './StudentsModule';
import { StaffModule } from './StaffModule';
import { ReportsModule } from './ReportsModule';

export const AdminDashboard: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'students', label: 'Gestión de Alumnos y Grupos', icon: Users },
    { id: 'staff', label: 'Gestión de Personal y Portones', icon: UserCheck },
    { id: 'reports', label: 'Módulo de Reportes', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Context Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Dirección / Control Escolar
              </span>
              <span className="bg-indigo-400/20 text-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-300/30">
                Gestión Global
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              Panel Administrativo Institucional
            </h2>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Module */}
      {activeTab === 'students' && <StudentsModule />}
      {activeTab === 'staff' && <StaffModule />}
      {activeTab === 'reports' && <ReportsModule />}
    </div>
  );
};
