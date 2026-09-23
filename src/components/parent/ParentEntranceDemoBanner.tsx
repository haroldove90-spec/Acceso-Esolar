import React, { useState } from 'react';
import {
  Sparkles,
  QrCode,
  Volume2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../utils/audioNotification';

interface ParentEntranceDemoBannerProps {
  onSimulateEntrance: (isLate: boolean) => void;
}

export const ParentEntranceDemoBanner: React.FC<ParentEntranceDemoBannerProps> = ({
  onSimulateEntrance,
}) => {
  const { students, parentSelectedStudentId } = useApp();
  const currentStudent = students.find(s => s.id === parentSelectedStudentId) || students[0];
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTestBeepOnly = () => {
    setIsPlayingTest(true);
    soundEffects.playEntranceBeep();
    setTimeout(() => setIsPlayingTest(false), 500);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-orange-50 border-2 border-amber-300/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                Demostración para Cliente
              </span>
              <span className="text-xs font-black text-slate-800 hidden sm:inline">
                Simulador de Entrada Escolar QR
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
              Simular escaneo de QR para: <span className="text-blue-700 underline font-black">{currentStudent?.fullName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons for Demonstration */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Simulation Button: On Time */}
          <button
            type="button"
            onClick={() => onSimulateEntrance(false)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95 cursor-pointer"
            title="Simula que el alumno pasa su código QR en la entrada a tiempo"
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Simular Entrada QR (Puntual)</span>
          </button>

          {/* Simulation Button: Late */}
          <button
            type="button"
            onClick={() => onSimulateEntrance(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm transition active:scale-95 cursor-pointer"
            title="Simula un escaneo fuera de horario para mostrar alerta de retardo"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Con Retardo</span>
          </button>

          {/* Test Sound Only */}
          <button
            type="button"
            onClick={handleTestBeepOnly}
            className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-black transition active:scale-95 cursor-pointer ${
              isPlayingTest
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
            title="Reproduce el sonido Beep de notificación sin abrir la ventana"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingTest ? 'animate-bounce' : 'text-blue-600'}`} />
            <span className="hidden md:inline">Probar Beep</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-amber-900/85 font-semibold bg-amber-200/50 px-3 py-1.5 rounded-xl border border-amber-300/40">
        <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
        <span>
          Al hacer clic, se reproduce el sonido <strong>Beep</strong> oficial en el navegador y se despliega la <strong>ventana flotante</strong> de confirmación con los datos del alumno y hora de llegada.
        </span>
      </div>
    </div>
  );
};
