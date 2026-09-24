import React, { useState } from 'react';
import { UserCheck, QrCode, ScanLine, Sparkles, Clock, Send, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessControlModule } from './AccessControlModule';
import { RealTimeStatusModule } from './RealTimeStatusModule';
import { DirectNoticesModule } from './DirectNoticesModule';
import { FloatingQRScannerButton } from './FloatingQRScannerButton';
import { QuickQRScannerModal } from './QuickQRScannerModal';
import { UserManualModule } from '../common/UserManualModule';

export const StaffDashboard: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [showQuickModal, setShowQuickModal] = useState(false);

  return (
    <div className="space-y-5 relative">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0D6938] border-b-4 border-[#D97706] text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <UserCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Docente / Personal de Puerta
              </span>
              <span className="bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full border border-white/30">
                Lector de Portón
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Estación de Registro & Control Escolar
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              Escaneo óptico de credenciales QR, registro de puntualidad y emisión de avisos directos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowQuickModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#D97706] hover:bg-[#b45309] text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Abrir Lector QR Rápido</span>
          </button>

          <div className="flex items-center gap-2 bg-black/25 px-3.5 py-2 rounded-2xl border border-white/20">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white">Listo</span>
          </div>
        </div>
      </div>

      {/* Staff Module Switcher Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'access' || (!activeTab || (activeTab !== 'status' && activeTab !== 'notices' && activeTab !== 'manual'))
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Control de Acceso (QR)</span>
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'status'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Estatus en Tiempo Real</span>
        </button>
        <button
          onClick={() => setActiveTab('notices')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            activeTab === 'notices'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Avisos Directos al Tutor</span>
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

      {/* Render Active Tab */}
      <div className="animate-in fade-in duration-200">
        {(activeTab === 'access' || (!activeTab || (activeTab !== 'status' && activeTab !== 'notices' && activeTab !== 'manual'))) && <AccessControlModule />}
        {activeTab === 'status' && <RealTimeStatusModule />}
        {activeTab === 'notices' && <DirectNoticesModule />}
        {activeTab === 'manual' && <UserManualModule initialRole="staff" />}
      </div>

      {/* Floating Action Button for 1-Tap QR Access on any Tab */}
      <FloatingQRScannerButton />

      {/* Standalone Quick QR Scanner Modal if triggered from banner */}
      {showQuickModal && <QuickQRScannerModal onClose={() => setShowQuickModal(false)} />}
    </div>
  );
};

