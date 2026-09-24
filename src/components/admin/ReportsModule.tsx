import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserX,
  Search,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';

export const ReportsModule: React.FC = () => {
  const { accessRecords, students } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Metrics
  const totalStudents = 700; // Capacity from PDF
  const registeredCount = accessRecords.length;
  const onTimeCount = accessRecords.filter(r => r.status === 'on_time' || r.status === 'present').length;
  const lateCount = accessRecords.filter(r => r.status === 'late').length;
  const absentEstimated = Math.max(0, students.length - accessRecords.filter(r => r.type === 'Entrada').length);
  const punctualityRate = registeredCount > 0 ? Math.round((onTimeCount / registeredCount) * 100) : 100;

  // Filtered records
  const filteredRecords = accessRecords.filter(record => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.gate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'todos' || record.grade === selectedGrade;
    const matchesStatus = selectedStatus === 'todos' || record.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Matricula', 'Alumno', 'Grado', 'Grupo', 'Tipo', 'Hora', 'Fecha', 'Estatus', 'Porton', 'RegistradoPor'];
    const rows = filteredRecords.map(r => [
      r.enrollmentId,
      `"${r.studentName}"`,
      r.grade,
      r.group,
      r.type,
      r.formattedTime,
      r.date,
      r.status,
      `"${r.gate}"`,
      `"${r.registeredBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Accesos_Escolares_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'on_time':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> A tiempo
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Retardo
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <UserX className="w-3 h-3" /> Inasistencia
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-900">Módulo de Reportes & Historial Consolidado</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Monitoreo consolidado de entradas, salidas, retardos e incidencias por día, grado o alumno.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-black transition cursor-pointer"
            title="Imprimir reporte"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600">Ingresos Hoy</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{registeredCount}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">De {students.length} activos en padrón</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600">Puntualidad</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{punctualityRate}%</p>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">{onTimeCount} ingresos a tiempo</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600">Retardos</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{lateCount}</p>
          <p className="text-xs font-bold text-amber-700 mt-0.5">Notificados a tutores</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600">Capacidad Total</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalStudents}</p>
          <p className="text-xs font-bold text-slate-600 mt-0.5">Matrícula escolar máxima</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alumno, matrícula o portón..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full py-2.5 px-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Grados</option>
            <option value="1°">1° Primaria</option>
            <option value="2°">2° Primaria</option>
            <option value="3°">3° Primaria</option>
            <option value="4°">4° Primaria</option>
            <option value="5°">5° Primaria</option>
            <option value="6°">6° Primaria</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Estatus</option>
            <option value="on_time">A tiempo</option>
            <option value="late">Retardos</option>
            <option value="absent">Inasistencias</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Alumno</th>
                <th className="py-3.5 px-3 sm:px-4">Grado / Grupo</th>
                <th className="py-3.5 px-3 sm:px-4">Tipo & Hora</th>
                <th className="py-3.5 px-3 sm:px-4">Estatus</th>
                <th className="py-3.5 px-3 sm:px-4">Portón de Acceso</th>
                <th className="py-3.5 px-4 sm:px-5">Responsable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 sm:px-5">
                      <p className="font-black text-slate-900 text-sm sm:text-base">{rec.studentName}</p>
                      <span className="font-mono text-xs sm:text-sm text-blue-700 font-extrabold">{rec.enrollmentId}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-black text-slate-800 text-xs sm:text-sm">
                      {rec.grade} - {rec.group}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{rec.formattedTime}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">{rec.type}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">{getStatusBadge(rec.status)}</td>
                    <td className="py-3.5 px-3 sm:px-4 text-slate-800 font-bold text-xs sm:text-sm">
                      <span className="truncate max-w-[180px] block">{rec.gate}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 text-slate-600 text-xs sm:text-sm font-semibold">
                      {rec.registeredBy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-sm font-semibold">
                    No se registraron movimientos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
