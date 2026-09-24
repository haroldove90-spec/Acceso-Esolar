import React, { useState } from 'react';
import {
  X,
  QrCode,
  DoorClosed,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Search,
  Zap,
  Volume2,
  Sparkles,
  ArrowRightCircle,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GateType, Student, AttendanceStatus } from '../../types';
import { RealQRScanner } from '../common/RealQRScanner';

interface QuickQRScannerModalProps {
  onClose: () => void;
}

export const QuickQRScannerModal: React.FC<QuickQRScannerModalProps> = ({ onClose }) => {
  const { students, registerAccess, accessRecords } = useApp();

  const [selectedGate, setSelectedGate] = useState<GateType>('Portón Principal (Entrada General)');
  const [accessType, setAccessType] = useState<'Entrada' | 'Salida'>('Entrada');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [manualQuery, setManualQuery] = useState('');
  const [sessionScanCount, setSessionScanCount] = useState(0);

  const [lastScannedResult, setLastScannedResult] = useState<{
    student: Student;
    status: AttendanceStatus;
    time: string;
    type: 'Entrada' | 'Salida';
    gate: GateType;
  } | null>(null);

  const [scanNotice, setScanNotice] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Parse and match scanned code to a student
  const handleDecodedString = (scannedText: string) => {
    const raw = scannedText.trim();
    if (!raw) return;
    const query = raw.toLowerCase();
    
    // 1. Direct match on qrCodeValue, enrollmentId, id
    let matched = students.find(
      s =>
        s.qrCodeValue.toLowerCase() === query ||
        s.enrollmentId.toLowerCase() === query ||
        s.id.toLowerCase() === query
    );

    // 2. Multi-pattern match: check clean enrollmentId
    if (!matched) {
      matched = students.find(s => {
        const cleanEnrollment = s.enrollmentId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanQuery = query.replace(/[^a-z0-9]/g, '');
        return cleanQuery.includes(cleanEnrollment) || query.includes(s.enrollmentId.toLowerCase());
      });
    }

    // 3. Name match
    if (!matched) {
      matched = students.find(
        s =>
          s.fullName.toLowerCase() === query ||
          query.includes(s.fullName.toLowerCase()) ||
          s.fullName.toLowerCase().includes(query)
      );
    }

    if (matched) {
      const result = registerAccess(matched.id, selectedGate, undefined, accessType);
      if (result.success && result.record) {
        setLastScannedResult({
          student: matched,
          status: result.record.status,
          time: result.record.formattedTime,
          type: accessType,
          gate: selectedGate,
        });
        setSessionScanCount(prev => prev + 1);
        setScanNotice({
          text: `Acceso registrado: ${matched.fullName} (${result.record.status === 'late' ? 'Retardo' : 'A tiempo'})`,
          isError: false,
        });
      }
    } else {
      setScanNotice({
        text: `Código no reconocido: "${scannedText.slice(0, 30)}..."`,
        isError: true,
      });
    }

    setTimeout(() => {
      setScanNotice(null);
    }, 4000);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    const query = manualQuery.trim().toLowerCase();
    const matched = students.find(
      s =>
        s.enrollmentId.toLowerCase() === query ||
        s.id.toLowerCase() === query ||
        s.qrCodeValue.toLowerCase() === query ||
        s.fullName.toLowerCase().includes(query)
    );

    if (matched) {
      handleDecodedString(matched.id);
      setManualQuery('');
    } else {
      setScanNotice({
        text: `No se encontró ningún alumno con el criterio: "${manualQuery}"`,
        isError: true,
      });
    }
  };

  // Recent 4 records
  const recentSessionLogs = accessRecords.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header Bar */}
        <div className="bg-[#0D6938] border-b-4 border-[#D91A2A] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-xl font-black tracking-tight">Estación Independiente de Escaneo QR</h3>
                <span className="hidden sm:inline-block bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full border border-white/30">
                  Lector Activo
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">Reconocimiento continuo de credenciales en puerta de acceso</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black/25 px-3 py-1.5 rounded-2xl border border-white/10 text-xs font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{sessionScanCount} Registrados</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Cerrar Lector"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Toolbar: Gate & Access Type Switchers */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm shrink-0">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <span className="font-black text-slate-700 flex items-center gap-1.5">
              <DoorClosed className="w-4 h-4 text-[#0D6938]" /> Portón:
            </span>
            <select
              value={selectedGate}
              onChange={e => setSelectedGate(e.target.value as GateType)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-[#0D6938] focus:outline-none"
            >
              <option value="Portón Principal (Entrada General)">Portón Principal (Entrada General)</option>
              <option value="Portón 2 (Primaria / Vehicular)">Portón 2 (Primaria / Vehicular)</option>
              <option value="Portón 3 (Peatonal / Secundaria)">Portón 3 (Peatonal / Secundaria)</option>
            </select>
          </div>

          <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300 text-xs font-black">
            <button
              onClick={() => setAccessType('Entrada')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                accessType === 'Entrada' ? 'bg-[#0D6938] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Entrada Escolar
            </button>
            <button
              onClick={() => setAccessType('Salida')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                accessType === 'Salida' ? 'bg-[#D91A2A] text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Salida Escolar
            </button>
          </div>
        </div>

        {/* Modal Main Content: 2-Column Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Live Camera Scanner */}
          <div className="lg:col-span-7 space-y-3.5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Visor Óptico de la Cámara
              </span>
              <span className="text-xs font-bold text-slate-500">
                Apunte al código QR de la credencial
              </span>
            </div>

            {/* Real Camera Scanner Component */}
            <RealQRScanner
              isActive={isCameraActive}
              onToggleActive={setIsCameraActive}
              onScanResult={handleDecodedString}
              compact={false}
              showControls={true}
            />

            {/* Notice alert banner if scan error or match info */}
            {scanNotice && (
              <div className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-150 ${
                scanNotice.isError
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                {scanNotice.isError ? (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                <span>{scanNotice.text}</span>
              </div>
            )}

            {/* Manual matricula bar inside the modal */}
            <form onSubmit={handleManualSubmit} className="pt-2">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Registro manual: Ingrese matrícula o nombre..."
                    value={manualQuery}
                    onChange={e => setManualQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs transition cursor-pointer"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Match Card & Notification Confirmation */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            
            {/* Last Scanned Student Card */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-3.5 flex-1">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                Última Credencial Escaneada
              </span>

              {lastScannedResult ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <img
                      src={lastScannedResult.student.photoUrl}
                      alt={lastScannedResult.student.fullName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-blue-700 font-black">
                        {lastScannedResult.student.enrollmentId}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
                        {lastScannedResult.student.fullName}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                        {lastScannedResult.student.grade} - Grupo {lastScannedResult.student.group} ({lastScannedResult.student.shift})
                      </p>
                    </div>
                  </div>

                  {/* Status & Hour Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                      <span className="text-[11px] font-black text-emerald-800 block">Hora de Registro</span>
                      <span className="text-base sm:text-lg font-black text-emerald-700">{lastScannedResult.time}</span>
                    </div>

                    <div className={`p-3 rounded-2xl border text-center ${
                      lastScannedResult.status === 'late'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-blue-50 border-blue-200 text-blue-800'
                    }`}>
                      <span className="text-[11px] font-black block">Puntualidad</span>
                      <span className="text-base sm:text-lg font-black capitalize">
                        {lastScannedResult.status === 'late' ? 'Retardo' : 'A tiempo'}
                      </span>
                    </div>
                  </div>

                  {/* Tutor contact & push verification */}
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-bold">Tutor notificado:</span>
                      <span className="font-black text-slate-900">{lastScannedResult.student.tutorName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>Teléfono:</span>
                      <span className="font-bold text-slate-700">{lastScannedResult.student.tutorPhone}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Aviso instantáneo emitido con éxito.</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <UserCheck className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-700">Esperando escaneo</p>
                  <p className="text-xs text-slate-400">Presente el código QR frente a la cámara para registrar el ingreso.</p>
                </div>
              )}
            </div>

            {/* Quick Demo Scan Buttons */}
            <div className="p-3.5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] font-black text-slate-500 uppercase block">
                Simulación Rápida (1 Clic):
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {students.slice(0, 4).map(stu => (
                  <button
                    key={stu.id}
                    onClick={() => handleDecodedString(stu.qrCodeValue)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition cursor-pointer"
                  >
                    <img src={stu.photoUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                    <div className="truncate">
                      <p className="font-black text-slate-900 text-xs truncate">{stu.fullName.split(' ')[0]}</p>
                      <span className="text-[10px] text-slate-500 font-bold">{stu.grade} {stu.group}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-600">
            Modo Ráfaga de Portón • Listo para escanear
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs sm:text-sm transition cursor-pointer"
          >
            Cerrar Lector
          </button>
        </div>

      </div>
    </div>
  );
};
