import React from 'react';
import { QrCode, Clock, Send, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessControlModule } from './AccessControlModule';
import { RealTimeStatusModule } from './RealTimeStatusModule';
import { DirectNoticesModule } from './DirectNoticesModule';

export const StaffDashboard: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'access', label: 'Control de Acceso Ágil', icon: QrCode },
    { id: 'status', label: 'Estatus en Tiempo Real', icon: Clock },
    { id: 'notices', label: 'Avisos Directos', icon: Send },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-4 sm:p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Docente / Personal de Puerta
              </span>
              <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300/30">
                Operativo
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
              Estación de Registro & Control Escolar
            </h2>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`staff-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-emerald-950 shadow-sm'
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

      {/* Render Active Tab */}
      {activeTab === 'access' && <AccessControlModule />}
      {activeTab === 'status' && <RealTimeStatusModule />}
      {activeTab === 'notices' && <DirectNoticesModule />}
    </div>
  );
};
