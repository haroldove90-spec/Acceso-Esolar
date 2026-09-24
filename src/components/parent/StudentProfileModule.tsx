import React, { useState } from 'react';
import {
  IdCard,
  QrCode,
  Heart,
  Send,
  Download,
  School,
  Sparkles,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentCardModal } from '../common/StudentCardModal';
import { StudentQRCodeWhatsAppModal } from './StudentQRCodeWhatsAppModal';

export const StudentProfileModule: React.FC = () => {
  const { parentSelectedStudentId, students } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const student = students.find(s => s.id === parentSelectedStudentId) || students[0];

  if (!student) return null;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Student Identification Banner */}
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
                {student.grade} de Secundaria • Grupo {student.group} • Turno {student.shift}
              </p>
              <span className="inline-block mt-1 text-[11px] font-black text-[#5B92C8] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Esc. Sec. Gral. No. 1 Moisés Sáenz
              </span>
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
      </div>

      {/* Official Credential Preview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#111827] text-white p-6 rounded-3xl border-2 border-[#D91A2A] shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-[#D91A2A] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Credencial Escolar Oficial
              </span>
              <span className="text-slate-400 text-xs font-bold">Ciclo Escolar 2025-2026</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white">
              {student.fullName}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Grado y Grupo</span>
                <span className="text-white font-black">{student.grade} - Grupo {student.group}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Turno</span>
                <span className="text-white font-black">{student.shift}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Tutor Legal</span>
                <span className="text-white font-black truncate block">{student.tutorName}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-black text-slate-400 block">Estatus</span>
                <span className="text-emerald-400 font-black">Activo Oficial</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2.5 bg-white p-4 rounded-2xl shadow-md shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(student.qrCodeValue)}`}
              alt="QR Alumno"
              className="w-32 h-32 object-contain"
            />
            <span className="text-[10px] font-mono font-black text-slate-700">{student.enrollmentId}</span>
          </div>
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
