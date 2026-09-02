import React, { useState } from 'react';
import { QrCode, ScanLine, Sparkles } from 'lucide-react';
import { QuickQRScannerModal } from './QuickQRScannerModal';

export const FloatingQRScannerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-40 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white pl-4 pr-5 py-3.5 rounded-full shadow-[0_10px_25px_rgba(5,150,105,0.4)] border-2 border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          title="Abrir Lector de Código QR en Puerta"
          id="btn-floating-qr-scanner"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-400/50 animate-pulse pointer-events-none"></span>

          {/* Icon with pulsing badge */}
          <div className="relative w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-300 border-2 border-emerald-800 rounded-full animate-ping"></span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-wide leading-tight">
              Lector QR en Vivo
            </span>
            <span className="text-[10px] text-emerald-100 font-bold leading-none hidden sm:inline">
              Acceso Rápido en Puerta
            </span>
          </div>
        </button>
      </div>

      {/* Standalone Scanner Modal */}
      {isOpen && <QuickQRScannerModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
