import React, { useState, useEffect } from 'react';
import { X, QrCode, Printer, Phone, Heart, CheckCircle2, School } from 'lucide-react';
import QRCode from 'qrcode';
import { Student } from '../../types';

interface StudentCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (student) {
      const qrValue = student.qrCodeValue || student.enrollmentId;
      QRCode.toDataURL(qrValue, {
        width: 260,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('Error generating QR', err));
    }
  }, [student]);

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
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border-3 border-blue-600 shadow-md">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">{student.fullName}</h3>
            <p className="text-xs font-semibold text-blue-700 mt-0.5">
              Matrícula: <span className="font-mono font-bold">{student.enrollmentId}</span>
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700">
              <span>Grado: {student.grade}</span>
              <span>•</span>
              <span>Grupo: {student.group}</span>
              <span>•</span>
              <span>Turno {student.shift}</span>
            </div>
          </div>

          {/* Real Generated QR Code section */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center space-y-2">
            <div className="w-40 h-40 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code ${student.fullName}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-xl animate-pulse text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-600 font-bold">{student.qrCodeValue}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Código Óptico Válido para Lectores en Puerta</span>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tutor Legal</span>
              <p className="font-bold text-slate-800 truncate">{student.tutorName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Teléfono Tutor</span>
              <p className="font-bold text-slate-800 truncate">{student.tutorPhone}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tipo Sanguíneo</span>
              <p className="font-black text-rose-600">{student.bloodType}</p>
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Credencial</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

