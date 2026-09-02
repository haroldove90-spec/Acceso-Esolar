import React, { useState } from 'react';
import { UserCheck, QrCode, ScanLine, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessControlModule } from './AccessControlModule';
import { RealTimeStatusModule } from './RealTimeStatusModule';
import { DirectNoticesModule } from './DirectNoticesModule';
import { FloatingQRScannerButton } from './FloatingQRScannerButton';
import { QuickQRScannerModal } from './QuickQRScannerModal';

export const StaffDashboard: React.FC = () => {
  const { activeTab } = useApp();
  const [showQuickModal, setShowQuickModal] = useState(false);

  return (
    <div className="space-y-5 relative">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-5 sm:p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
            <UserCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Docente / Personal de Puerta
              </span>
              <span className="bg-emerald-400/20 text-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300/30">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Abrir Lector QR Rápido</span>
          </button>

          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-2xl border border-white/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white">Listo</span>
          </div>
        </div>
      </div>

      {/* Render Active Tab */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'access' && <AccessControlModule />}
        {activeTab === 'status' && <RealTimeStatusModule />}
        {activeTab === 'notices' && <DirectNoticesModule />}
      </div>

      {/* Floating Action Button for 1-Tap QR Access on any Tab */}
      <FloatingQRScannerButton />

      {/* Standalone Quick QR Scanner Modal if triggered from banner */}
      {showQuickModal && <QuickQRScannerModal onClose={() => setShowQuickModal(false)} />}
    </div>
  );
};

