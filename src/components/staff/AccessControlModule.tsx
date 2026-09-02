import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DoorClosed,
  ArrowRightCircle,
  Sparkles,
  Camera,
  Volume2,
  ScanLine,
  UserCheck,
  Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GateType, Student, AttendanceStatus } from '../../types';
import { RealQRScanner } from '../common/RealQRScanner';
import { QuickQRScannerModal } from './QuickQRScannerModal';

export const AccessControlModule: React.FC = () => {
  const { students, registerAccess, accessRecords } = useApp();

  const [selectedGate, setSelectedGate] = useState<GateType>('Portón Principal (Entrada General)');
  const [accessType, setAccessType] = useState<'Entrada' | 'Salida'>('Entrada');
  const [inputQuery, setInputQuery] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [lastScannedStudent, setLastScannedStudent] = useState<{
    student: Student;
    status: AttendanceStatus;
    time: string;
    type: 'Entrada' | 'Salida';
  } | null>(null);

  const handleRegister = (student: Student) => {
    const result = registerAccess(student.id, selectedGate, undefined, accessType);
    if (result.success && result.record) {
      setLastScannedStudent({
        student,
        status: result.record.status,
        time: result.record.formattedTime,
        type: accessType,
      });
      setInputQuery('');
    }
  };

  const handleDecodedQR = (scannedText: string) => {
    const query = scannedText.trim().toLowerCase();
    const matched = students.find(
      s =>
        s.qrCodeValue.toLowerCase() === query ||
        s.enrollmentId.toLowerCase() === query ||
        s.id.toLowerCase() === query ||
        query.includes(s.enrollmentId.toLowerCase()) ||
        query.includes(s.id.toLowerCase()) ||
        s.fullName.toLowerCase() === query
    );

    if (matched) {
      handleRegister(matched);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const query = inputQuery.trim().toLowerCase();
    const matched = students.find(
      s =>
        s.enrollmentId.toLowerCase() === query ||
        s.id.toLowerCase() === query ||
        s.qrCodeValue.toLowerCase() === query ||
        s.fullName.toLowerCase().includes(query)
    );

    if (matched) {
      handleRegister(matched);
    }
  };

  // Quick matches suggestions
  const suggestedStudents = inputQuery.trim()
    ? students.filter(
        s =>
          s.fullName.toLowerCase().includes(inputQuery.toLowerCase()) ||
          s.enrollmentId.toLowerCase().includes(inputQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  // Recent accesses at this gate
  const recentLogs = accessRecords.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Port & Mode Configuration Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <DoorClosed className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-900">Control de Acceso Ágil en Puerta</h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">Lector de código QR en vivo con cámara y registro por matrícula con confirmación al tutor.</p>
          </div>
        </div>

        {/* Gate Selector & Mode toggle */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedGate}
            onChange={e => setSelectedGate(e.target.value as GateType)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="Portón Principal (Entrada General)">Portón Principal (Entrada General)</option>
            <option value="Portón 2 (Primaria / Vehicular)">Portón 2 (Primaria / Vehicular)</option>
            <option value="Portón 3 (Peatonal / Secundaria)">Portón 3 (Peatonal / Secundaria)</option>
          </select>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs sm:text-sm font-black">
            <button
              onClick={() => setAccessType('Entrada')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                accessType === 'Entrada' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Entrada
            </button>
            <button
              onClick={() => setAccessType('Salida')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                accessType === 'Salida' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              Salida
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column: Real Camera Scanner + Quick Input */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Scanner Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-emerald-600" /> Escáner de Credencial Digital (Cámara en Vivo)
              </span>
              <button
                onClick={() => setShowFullscreenModal(true)}
                className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition cursor-pointer"
                title="Abrir Estación a Pantalla Completa"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Estación Rápida</span>
              </button>
            </div>

            {/* Real Camera Scanner Viewport */}
            <RealQRScanner
              isActive={isCameraActive}
              onToggleActive={setIsCameraActive}
              onScanResult={handleDecodedQR}
              showControls={true}
              compact={false}
            />

            {/* Manual Quick Search & Enter */}
            <form onSubmit={handleSearchSubmit} className="space-y-2.5">
              <label className="text-xs sm:text-sm font-black text-slate-800 block">
                Búsqueda Rápida / Entrada por Matrícula o Nombre:
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ej. ALU-2026-001 o 'Sofía Mendoza' y presione Enter..."
                    value={inputQuery}
                    onChange={e => setInputQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs sm:text-sm transition shadow-xs cursor-pointer"
                >
                  Registrar
                </button>
              </div>

              {/* Autocomplete Quick Match Dropdown */}
              {suggestedStudents.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-2 space-y-1.5 mt-1">
                  {suggestedStudents.map(student => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleRegister(student)}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl text-left text-xs sm:text-sm transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={student.photoUrl} alt="" className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="font-black text-slate-900">{student.fullName}</p>
                          <span className="text-xs text-blue-700 font-mono font-bold">{student.enrollmentId} • {student.grade} {student.group}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        Marcar {accessType}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Quick Demo Scan Buttons for 1-Click Verification */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-black text-slate-500 block mb-2.5">
                Simulación Rápida de Escaneo de Alumnos (1 Clic):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {students.slice(0, 6).map(stu => (
                  <button
                    key={stu.id}
                    onClick={() => handleRegister(stu)}
                    className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 text-left text-xs transition group cursor-pointer"
                  >
                    <img src={stu.photoUrl} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    <div className="truncate">
                      <p className="font-black text-slate-900 group-hover:text-emerald-950 truncate text-xs sm:text-sm">
                        {stu.fullName.split(' ')[0]} {stu.fullName.split(' ')[1] || ''}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">{stu.grade} {stu.group}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Last Registered Feedback Card & Realtime Gate Stream */}
        <div className="lg:col-span-5 space-y-4">
          {/* Feedback Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider block mb-3.5">
              Último Alumno Registrado
            </span>

            {lastScannedStudent ? (
              <div className="space-y-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={lastScannedStudent.student.photoUrl}
                    alt={lastScannedStudent.student.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-blue-700 font-black">
                      {lastScannedStudent.student.enrollmentId}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                      {lastScannedStudent.student.fullName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-bold">
                      {lastScannedStudent.student.grade} - Grupo {lastScannedStudent.student.group}
                    </p>
                  </div>
                </div>

                {/* Status & Time confirmation */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-xs font-black text-emerald-800 block">Hora Registrada</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-700">{lastScannedStudent.time}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-center ${
                    lastScannedStudent.status === 'late'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    <span className="text-xs font-black block">Puntualidad</span>
                    <span className="text-lg sm:text-xl font-black capitalize">
                      {lastScannedStudent.status === 'late' ? 'Retardo' : 'A tiempo'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-center justify-between">
                  <span className="font-bold">Tutor vinculado:</span>
                  <span className="font-black text-slate-900">{lastScannedStudent.student.tutorName}</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>Notificación automática enviada al teléfono del tutor.</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2.5">
                <UserCheck className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-600">Listo para registrar accesos</p>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Escanee un código QR con la cámara o seleccione un alumno.</p>
              </div>
            )}
          </div>

          {/* Recent accesses at gate */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <span className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Movimientos Recientes en Portón
            </span>
            <div className="space-y-2">
              {recentLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm"
                >
                  <div>
                    <p className="font-black text-slate-900 leading-tight text-xs sm:text-sm">{log.studentName}</p>
                    <span className="text-xs text-slate-500 font-bold">{log.grade} {log.group} • {log.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 block text-xs sm:text-sm">{log.formattedTime}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                      log.status === 'late' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {log.status === 'late' ? 'Retardo' : 'A tiempo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Modal triggered from AccessControlModule */}
      {showFullscreenModal && (
        <QuickQRScannerModal onClose={() => setShowFullscreenModal(false)} />
      )}
    </div>
  );
};

