import React from 'react';
import { X, QrCode, Printer, Phone, Heart, CheckCircle2, School } from 'lucide-react';
import { Student } from '../../types';

interface StudentCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top bar */}
        <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <School className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs font-bold leading-none uppercase">Acceso Escolar</p>
              <p className="text-[10px] text-blue-100 font-medium">Credencial Escolar Digital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border-3 border-sky-600 shadow-md">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">{student.fullName}</h3>
            <p className="text-xs font-semibold text-sky-700 mt-0.5">
              Matrícula: <span className="font-mono">{student.enrollmentId}</span>
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
              <span>Grado: {student.grade}</span>
              <span>•</span>
              <span>Grupo: {student.group}</span>
              <span>•</span>
              <span>Turno {student.shift}</span>
            </div>
          </div>

          {/* QR Code section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center space-y-2">
            {/* SVG generated QR pattern */}
            <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simulated high-fidelity 2D QR matrix */}
                <rect x="0" y="0" width="30" height="30" fill="#0f172a" rx="2" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" rx="1" />
                <rect x="9" y="9" width="12" height="12" fill="#0f172a" rx="1" />

                <rect x="70" y="0" width="30" height="30" fill="#0f172a" rx="2" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" rx="1" />
                <rect x="79" y="9" width="12" height="12" fill="#0f172a" rx="1" />

                <rect x="0" y="70" width="30" height="30" fill="#0f172a" rx="2" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" rx="1" />
                <rect x="9" y="79" width="12" height="12" fill="#0f172a" rx="1" />

                {/* Data modules */}
                <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="14" width="6" height="6" fill="#0f172a" />
                <rect x="58" y="8" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="38" width="6" height="6" fill="#0f172a" />
                <rect x="18" y="46" width="6" height="6" fill="#0f172a" />

                <rect x="36" y="36" width="28" height="28" fill="#0284c7" rx="4" />
                <circle cx="50" cy="50" r="8" fill="#ffffff" />
                <circle cx="50" cy="50" r="4" fill="#0284c7" />

                <rect x="72" y="38" width="6" height="6" fill="#0f172a" />
                <rect x="84" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="72" y="58" width="6" height="6" fill="#0f172a" />

                <rect x="38" y="74" width="6" height="6" fill="#0f172a" />
                <rect x="48" y="82" width="6" height="6" fill="#0f172a" />
                <rect x="62" y="74" width="6" height="6" fill="#0f172a" />
                <rect x="80" y="80" width="12" height="12" fill="#0f172a" rx="1" />
              </svg>
            </div>
            <p className="text-[11px] font-mono text-slate-500 font-semibold">{student.qrCodeValue}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Válido para lector en portón</span>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tutor Legal</span>
              <p className="font-semibold text-slate-800 truncate">{student.tutorName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Teléfono Tutor</span>
              <p className="font-semibold text-slate-800 truncate">{student.tutorPhone}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tipo Sanguíneo</span>
              <p className="font-bold text-rose-600">{student.bloodType}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Estatus</span>
              <p className="font-bold text-emerald-600">{student.status}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Credencial</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
