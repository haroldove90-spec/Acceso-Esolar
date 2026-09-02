import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstalledSuccess(true);
        setTimeout(() => setInstalledSuccess(false), 3000);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled && !showModal) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Instalada</span>
      </div>
    );
  }

  return (
    <>
      <button
        id="pwa-install-header-btn"
        onClick={handleInstallClick}
        aria-label="Instalar aplicación Aire Acondicionado"
        className={`group relative flex items-center gap-2 rounded-full transition-all duration-200 shadow-sm font-semibold ${
          compact
            ? 'p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl'
            : 'px-3.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm active:scale-95'
        }`}
      >
        <Download className="w-4 h-4 animate-bounce group-hover:animate-none" />
        <span className="whitespace-nowrap">Instalar App</span>
        <span className="hidden md:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-blue-100 uppercase tracking-wider">
          Móvil
        </span>
      </button>

      {/* Guide & Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Instalar Aire Acondicionado</h3>
                <p className="text-xs text-slate-500">Acceso rápido, notificaciones y uso sin conexión</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              {isIOS ? (
                <div className="rounded-xl bg-sky-50 p-4 border border-sky-100 text-xs text-slate-700 space-y-2.5">
                  <p className="font-bold text-sky-950 flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-sky-700" /> Instrucciones para iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
                    <li>Presiona el botón <strong>Compartir</strong> <Share2 className="inline w-3.5 h-3.5 text-sky-600" /> en Safari.</li>
                    <li>Desplázate hacia abajo y pulsa <strong>"Agregar a Inicio"</strong> <PlusSquare className="inline w-3.5 h-3.5 text-sky-600" />.</li>
                    <li>Confirma haciendo clic en <strong>Agregar</strong> en la esquina superior.</li>
                  </ol>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <p className="font-semibold text-slate-900">En Android / Chrome o Navegadores de Escritorio:</p>
                  <p className="text-slate-600">
                    Pulsa el menú de opciones de tu navegador (⋮) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla de inicio"</strong>.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Alertas instantáneas</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Credencial escolar offline</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow transition"
                >
                  Instalar Ahora
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
