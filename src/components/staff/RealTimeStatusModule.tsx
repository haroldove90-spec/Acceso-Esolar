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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Estatus en Tiempo Real</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro y ajuste directo de la puntualidad de los alumnos ingresados hoy (A tiempo, Retardo, Inasistencia).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{accessRecords.length} Registros Activos Hoy</span>
        </div>
      </div>

      {/* Filter and search */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative sm:col-span-8">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alumno o matrícula..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      </div>

      {/* Table list with interactive status changers */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Alumno</th>
                <th className="py-3 px-3">Grado / Grupo</th>
                <th className="py-3 px-3">Hora de Ingreso</th>
                <th className="py-3 px-3">Portón</th>
                <th className="py-3 px-4 text-right">Estatus de Puntualidad (Modificar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{rec.studentName}</p>
                      <span className="font-mono text-[11px] text-sky-700">{rec.enrollmentId}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {rec.grade} - {rec.group}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rec.formattedTime}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rec.type}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      <span className="truncate max-w-[140px] block">{rec.gate}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateAccessStatus(rec.id, 'on_time')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'on_time' || rec.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title="Marcar A Tiempo"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>A Tiempo</span>
                        </button>

                        <button
                          onClick={() => updateAccessStatus(rec.id, 'late')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title="Marcar Retardo"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Retardo</span>
                        </button>

                        <button
                          onClick={() => updateAccessStatus(rec.id, 'absent')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            rec.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                          }`}
                          title="Marcar Inasistencia"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Inasistencia</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
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
