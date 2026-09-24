import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertTriangle, UserX, Search, Filter, Sparkles, Check, Edit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus } from '../../types';

export const RealTimeStatusModule: React.FC = () => {
  const { accessRecords, updateAccessStatus, students } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('todos');

  const filteredRecords = accessRecords.filter(rec => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'todos' || rec.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-900">Estatus en Tiempo Real</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Registro y ajuste directo de la puntualidad de los alumnos ingresados hoy (A tiempo, Retardo, Inasistencia).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-800 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{accessRecords.length} Registros Activos Hoy</span>
        </div>
      </div>

      {/* Filter and search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative sm:col-span-8">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alumno o matrícula..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="w-full py-2.5 px-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos los Grados (Secundaria)</option>
            <option value="1°">1° de Secundaria</option>
            <option value="2°">2° de Secundaria</option>
            <option value="3°">3° de Secundaria</option>
          </select>
        </div>
      </div>

      {/* Table list with interactive status changers */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Alumno</th>
                <th className="py-3.5 px-3 sm:px-4">Grado / Grupo</th>
                <th className="py-3.5 px-3 sm:px-4">Hora de Ingreso</th>
                <th className="py-3.5 px-3 sm:px-4">Portón</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Estatus de Puntualidad (Modificar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 sm:px-5">
                      <p className="font-black text-slate-900 text-sm sm:text-base">{rec.studentName}</p>
                      <span className="font-mono text-xs sm:text-sm text-blue-700 font-extrabold">{rec.enrollmentId}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 font-black text-slate-800 text-xs sm:text-sm">
                      {rec.grade} - {rec.group}
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="font-mono font-black text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{rec.formattedTime}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold">{rec.type}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-slate-800 font-bold text-xs sm:text-sm">
                      <span className="truncate max-w-[160px] block">{rec.gate}</span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button
                          onClick={() => updateAccessStatus(rec.id, 'on_time')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                            rec.status === 'on_time' || rec.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                          }`}
                          title="Marcar A Tiempo"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>A Tiempo</span>
                        </button>

                        <button
                          onClick={() => updateAccessStatus(rec.id, 'late')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                            rec.status === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-amber-800 hover:bg-amber-50'
                          }`}
                          title="Marcar Retardo"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>Retardo</span>
                        </button>

                        <button
                          onClick={() => updateAccessStatus(rec.id, 'absent')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                            rec.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-rose-800 hover:bg-rose-50'
                          }`}
                          title="Marcar Inasistencia"
                        >
                          <UserX className="w-4 h-4" />
                          <span>Inasistencia</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 text-sm font-semibold">
                    No hay registros de estatus coincidentes.
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
