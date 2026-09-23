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
  UserCheck,
  Send,
  Share2,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentCardModal } from '../common/StudentCardModal';
import { StudentQRCodeWhatsAppModal } from './StudentQRCodeWhatsAppModal';

export const StudentProfileModule: React.FC = () => {
  const { parentSelectedStudentId, students, accessRecords } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

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
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-600 shadow-md">
              <img src={student.photoUrl} alt={student.fullName} className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 mb-1.5 font-mono">
                Matrícula: {student.enrollmentId}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">{student.fullName}</h2>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
                {student.grade} de Primaria • Grupo {student.group} • Turno {student.shift}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
              title="Crear y enviar código QR por WhatsApp a tu hijo"
            >
              <Send className="w-4 h-4" />
              <span>Enviar QR a mi Hijo (WhatsApp)</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
              <span>Ver Credencial Digital</span>
            </button>
          </div>
        </div>

        {/* Live Attendance Status Today Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-500 block uppercase tracking-wider">Estatus de Hoy:</span>
              <p className="font-black text-slate-900 text-sm sm:text-base">
                {studentLogs.length > 0 ? 'Dentro del Plantel Escolar' : 'Sin ingreso registrado aún'}
              </p>
            </div>
          </div>

          {studentLogs.length > 0 && (
            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100/90 px-3.5 py-1.5 rounded-xl border border-emerald-300 inline-block">
                Ingreso: {studentLogs[0].formattedTime} ({studentLogs[0].status === 'late' ? 'Retardo' : 'Puntual'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Asistencias</span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalEntries}</p>
          <span className="text-xs text-emerald-700 font-black">100% Registro</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Puntualidad</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{punctualityScore}%</p>
          <span className="text-xs text-slate-500 font-bold">{onTimeEntries} a tiempo</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 text-center shadow-xs">
          <span className="text-xs font-black text-slate-500 uppercase block tracking-wider">Retardos</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{lateEntries}</p>
          <span className="text-xs text-slate-500 font-bold">Ciclo escolar</span>
        </div>
      </div>

      {/* Detailed Attendance History Table */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" /> Historial Diario de Asistencia y Retardos
          </h3>
          <span className="text-xs font-bold text-slate-500">Últimos movimientos</span>
        </div>

        <div className="space-y-2.5">
          {studentLogs.length > 0 ? (
            studentLogs.map(log => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    log.status === 'late' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xs sm:text-sm">{log.type} Escolar</p>
                    <span className="text-xs font-bold text-slate-500">{log.gate} • {log.date}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-black text-slate-900 text-xs sm:text-sm block">{log.formattedTime}</span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                    log.status === 'late'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {log.status === 'late' ? 'Retardo' : 'A tiempo'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs sm:text-sm font-semibold">
              No hay historial de asistencia disponible aún.
            </div>
          )}
        </div>
      </div>

      {/* Emergency & Health Info Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
        <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" /> Ficha Médica y Contacto de Emergencia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-xs font-black text-slate-500 block uppercase">Tipo de Sangre</span>
            <p className="font-black text-rose-600 text-base sm:text-lg mt-0.5">{student.bloodType}</p>
          </div>
          <div>
            <span className="text-xs font-black text-slate-500 block uppercase">Contacto de Emergencia</span>
            <p className="font-black text-slate-900 text-sm sm:text-base mt-0.5">{student.emergencyContact}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs font-black text-slate-500 block uppercase">Notas Médicas / Alergias</span>
            <p className="font-bold text-slate-700 mt-1 text-xs sm:text-sm">{student.medicalNotes || 'Sin observaciones médicas registradas.'}</p>
          </div>
        </div>
      </div>

      {/* Credential Modal */}
      {showModal && (
        <StudentCardModal student={student} onClose={() => setShowModal(false)} />
      )}

      {/* QR Code WhatsApp Share Modal */}
      <StudentQRCodeWhatsAppModal
        student={student}
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </div>
  );
};
