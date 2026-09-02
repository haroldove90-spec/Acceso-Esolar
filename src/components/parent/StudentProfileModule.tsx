import React, { useState } from 'react';
import {
  IdCard,
  QrCode,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Phone,
  Printer,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentCardModal } from '../common/StudentCardModal';

export const StudentProfileModule: React.FC = () => {
  const { parentSelectedStudentId, students, accessRecords } = useApp();
  const [showModal, setShowModal] = useState(false);

  const student = students.find(s => s.id === parentSelectedStudentId) || students[0];

  const studentLogs = accessRecords.filter(
    a => a.studentId === student?.id || a.enrollmentId === student?.enrollmentId
  );

  const totalEntries = studentLogs.filter(a => a.type === 'Entrada').length;
  const onTimeEntries = studentLogs.filter(a => a.status === 'on_time' || a.status === 'present').length;
  const lateEntries = studentLogs.filter(a => a.status === 'late').length;
  const punctualityScore = totalEntries > 0 ? Math.round((onTimeEntries / totalEntries) * 100) : 100;

  if (!student) return null;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Student Identification & Today's Status Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-500 shadow-md">
              <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 mb-1">
                Matrícula: {student.enrollmentId}
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-snug">{student.fullName}</h2>
              <p className="text-xs font-semibold text-slate-500">
                {student.grade} de Primaria • Grupo {student.group} • Turno {student.shift}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Ver Credencial Digital</span>
          </button>
        </div>

        {/* Live Attendance Status Today Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/50 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Estatus de Hoy:</span>
              <p className="font-extrabold text-slate-900 text-sm">
                {studentLogs.length > 0 ? 'Dentro del Plantel Escolar' : 'Sin ingreso registrado aún'}
              </p>
            </div>
          </div>

          {studentLogs.length > 0 && (
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                Ingreso: {studentLogs[0].formattedTime} ({studentLogs[0].status === 'late' ? 'Retardo' : 'Puntual'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Asistencias</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{totalEntries}</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% Registro</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Puntualidad</span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{punctualityScore}%</p>
          <span className="text-[10px] text-slate-400 font-medium">{onTimeEntries} a tiempo</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Retardos</span>
          <p className="text-xl font-black text-amber-600 mt-0.5">{lateEntries}</p>
          <span className="text-[10px] text-slate-400 font-medium">Ciclo escolar</span>
        </div>
      </div>

      {/* Detailed Attendance History Table */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" /> Historial Diario de Asistencia y Retardos
          </h3>
          <span className="text-xs text-slate-400 font-medium">Últimos movimientos</span>
        </div>

        <div className="space-y-2">
          {studentLogs.length > 0 ? (
            studentLogs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    log.status === 'late' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{log.type} Escolar</p>
                    <span className="text-[11px] text-slate-500">{log.gate} • {log.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-slate-900 text-xs block">{log.formattedTime}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    log.status === 'late'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {log.status === 'late' ? 'Retardo' : 'A tiempo'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No hay historial de asistencia disponible aún.
            </div>
          )}
        </div>
      </div>

      {/* Emergency & Health Info Card */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" /> Ficha Médica y Contacto de Emergencia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">Tipo de Sangre</span>
            <p className="font-extrabold text-rose-600 text-sm mt-0.5">{student.bloodType}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">Contacto de Emergencia</span>
            <p className="font-semibold text-slate-800 mt-0.5">{student.emergencyContact}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 block">Notas Médicas / Alergias</span>
            <p className="font-medium text-slate-700 mt-0.5">{student.medicalNotes || 'Sin observaciones médicas registradas.'}</p>
          </div>
        </div>
      </div>

      {/* Credential Modal */}
      {showModal && (
        <StudentCardModal student={student} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
