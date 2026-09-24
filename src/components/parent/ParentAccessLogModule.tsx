import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  DoorClosed,
  ArrowRightCircle,
  ArrowLeftCircle,
  Search,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  UserCheck,
  QrCode,
  FileSpreadsheet,
  Info,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccessRecord } from '../../types';

export const ParentAccessLogModule: React.FC = () => {
  const {
    students,
    parentSelectedStudentId,
    setParentSelectedStudentId,
    accessRecords,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Entrada' | 'Salida'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'on_time' | 'late'>('all');
  const [filterTimeRange, setFilterTimeRange] = useState<'all' | 'today' | 'week'>('all');

  const currentStudent = students.find(s => s.id === parentSelectedStudentId) || students[0];

  // Filter records belonging to the selected student
  const studentRecords = useMemo(() => {
    if (!currentStudent) return [];
    return accessRecords.filter(
      r => r.studentId === currentStudent.id || r.enrollmentId === currentStudent.enrollmentId
    );
  }, [accessRecords, currentStudent]);

  // Apply filters
  const filteredRecords = useMemo(() => {
    return studentRecords.filter(record => {
      // Type filter
      if (filterType !== 'all' && record.type !== filterType) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'late' && record.status !== 'late') return false;
        if (filterStatus === 'on_time' && (record.status !== 'on_time' && record.status !== 'present')) return false;
      }
      // Search query (date, time, gate, notes)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDate = record.date.toLowerCase().includes(query);
        const matchesTime = record.formattedTime.toLowerCase().includes(query);
        const matchesGate = record.gate.toLowerCase().includes(query);
        const matchesType = record.type.toLowerCase().includes(query);
        const matchesNotes = record.notes ? record.notes.toLowerCase().includes(query) : false;
        if (!matchesDate && !matchesTime && !matchesGate && !matchesType && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [studentRecords, filterType, filterStatus, searchQuery]);

  // Statistics calculation
  const totalEntries = studentRecords.filter(r => r.type === 'Entrada').length;
  const totalExits = studentRecords.filter(r => r.type === 'Salida').length;
  const lateEntries = studentRecords.filter(r => r.type === 'Entrada' && r.status === 'late').length;
  const onTimeEntries = studentRecords.filter(
    r => r.type === 'Entrada' && (r.status === 'on_time' || r.status === 'present')
  ).length;
  const punctualityScore = totalEntries > 0 ? Math.round((onTimeEntries / totalEntries) * 100) : 100;

  const handlePrintLog = () => {
    window.print();
  };

  // Format full friendly day and date in Spanish (e.g. Miércoles, 23 de Septiembre de 2026)
  const formatFriendlyDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day, 12, 0, 0);
        return d.toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  if (!currentStudent) return null;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top Banner & Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0D6938] border border-emerald-200 flex items-center justify-center font-black shadow-xs shrink-0">
            <Clock className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#0D6938]">
                Padrón Escolar Oficial
              </span>
              <span className="bg-emerald-100 text-[#0D6938] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                Sincronización en Vivo
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Registro Histórico de Accesos a la Escuela
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Consulta de entradas y salidas registradas por lector QR con día, hora exacta, portón y puntualidad.
            </p>
          </div>
        </div>

        {/* Action: Print or Export Attendance Sheet */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handlePrintLog}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
            title="Imprimir o guardar como PDF el concentrado de accesos de tu hijo"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Historial</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 border-l-4 border-l-[#0D6938] shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Entradas</span>
            <ArrowRightCircle className="w-4 h-4 text-[#0D6938]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalEntries}</p>
          <span className="text-xs text-[#0D6938] font-bold">Registradas en ciclo</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 border-l-4 border-l-[#5B92C8] shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Puntualidad</span>
            <CheckCircle2 className="w-4 h-4 text-[#5B92C8]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{punctualityScore}%</p>
          <span className="text-xs text-slate-500 font-bold">{onTimeEntries} a tiempo</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 border-l-4 border-l-[#EAB308] shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Retardos</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{lateEntries}</p>
          <span className="text-xs text-slate-500 font-bold">Llegadas tarde</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 border-l-4 border-l-[#D91A2A] shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-black uppercase tracking-wider">Salidas</span>
            <ArrowLeftCircle className="w-4 h-4 text-[#D91A2A]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#D91A2A] mt-2">{totalExits}</p>
          <span className="text-xs text-slate-500 font-bold">Término de jornada</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Keyword & Date Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por fecha (ej. 2026-09), hora o portón..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D6938]"
            />
          </div>

          {/* Movement Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterType === 'all' ? 'bg-[#111827] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('Entrada')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterType === 'Entrada' ? 'bg-[#0D6938] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo Entradas
            </button>
            <button
              onClick={() => setFilterType('Salida')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterType === 'Salida' ? 'bg-[#D91A2A] text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Solo Salidas
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setFilterStatus('on_time')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === 'on_time' ? 'bg-blue-600 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Puntual
            </button>
            <button
              onClick={() => setFilterStatus('late')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filterStatus === 'late' ? 'bg-amber-500 text-white shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Retardo
            </button>
          </div>
        </div>

        {/* Current Student Reference Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1 border-t border-slate-100">
          <span>
            Mostrando <strong>{filteredRecords.length}</strong> de <strong>{studentRecords.length}</strong> registros para:{' '}
            <strong className="text-slate-900">{currentStudent.fullName}</strong> ({currentStudent.grade} {currentStudent.group})
          </span>
          <span className="hidden sm:inline font-mono">Matrícula: {currentStudent.enrollmentId}</span>
        </div>
      </div>

      {/* Main Historical List */}
      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => {
            const isEntry = record.type === 'Entrada';
            const isLate = record.status === 'late';
            const friendlyDay = formatFriendlyDate(record.date);

            return (
              <div
                key={record.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-sm transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left Side: Icon, Type, Day & Date */}
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 ${
                      isEntry
                        ? isLate
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-[#0D6938]'
                        : 'bg-red-100 text-[#D91A2A]'
                    }`}
                  >
                    {isEntry ? (
                      <ArrowRightCircle className="w-6 h-6 stroke-[2.2]" />
                    ) : (
                      <ArrowLeftCircle className="w-6 h-6 stroke-[2.2]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {record.type} Escolar
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isLate
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {isLate ? '⚠️ Retardo' : '✅ Puntual / A tiempo'}
                      </span>
                    </div>

                    {/* Day and Full Date */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="capitalize">{friendlyDay}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono text-slate-500 font-semibold">{record.date}</span>
                    </div>

                    {/* Gate & Validation Notes */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                      <span className="flex items-center gap-1">
                        <DoorClosed className="w-3 h-3 text-slate-400" />
                        <strong>{record.gate}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 text-[11px] truncate max-w-xs">
                        {record.registeredBy || 'Lector Óptico QR'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Exact Time Stamp & Status Badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-black block">
                      Hora de Registro
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-950 tracking-tight">
                      {record.formattedTime}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl mt-1">
                    ID: {record.id.slice(-6).toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <CalendarDays className="w-7 h-7" />
            </div>
            <h4 className="text-base font-black text-slate-800">No se encontraron registros de acceso</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
              No hay movimientos que coincidan con los filtros seleccionados o aún no se han registrado accesos para este alumno.
            </p>
          </div>
        )}
      </div>

      {/* Institutional Legal & Auditing Banner */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block">Validez Oficial de los Registros:</span>
          <p className="mt-0.5 leading-relaxed">
            Cada registro de acceso cuenta con sellado de tiempo criptográfico inalterable. Los retardos o justificaciones deben gestionarse directamente con la dirección del plantel escolar presentando el comprobante oficial.
          </p>
        </div>
      </div>
    </div>
  );
};
