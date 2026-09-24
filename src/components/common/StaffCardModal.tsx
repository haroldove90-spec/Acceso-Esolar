import React from 'react';
import { X, Shield, Phone, Mail, DoorClosed, Clock, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { StaffMember } from '../../types';

interface StaffCardModalProps {
  staff: StaffMember | null;
  onClose: () => void;
  onEdit?: (staff: StaffMember) => void;
}

export const StaffCardModal: React.FC<StaffCardModalProps> = ({ staff, onClose, onEdit }) => {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#111827] border-b-4 border-[#0D6938] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide">Ficha de Personal Escolar</h2>
              <p className="text-[11px] text-emerald-200 font-medium">Credencial y Responsabilidades de Acceso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border-3 border-[#0D6938] shadow-md bg-slate-100 flex items-center justify-center">
            {staff.photoUrl ? (
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-3xl font-black">
                {staff.fullName.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">{staff.fullName}</h3>
            <p className="text-xs font-bold text-blue-700 mt-0.5">{staff.roleTitle}</p>
            <p className="text-xs font-semibold text-slate-500">{staff.subjectOrArea}</p>
            
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs font-bold border">
              <span
                className={`inline-flex items-center gap-1 ${
                  staff.status === 'En Turno'
                    ? 'text-emerald-700'
                    : staff.status === 'Inactivo'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {staff.status === 'En Turno' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                {staff.status}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-700">Turno: {staff.shift}</span>
            </div>
          </div>

          {/* Assigned Responsibility */}
          <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-left space-y-2">
            <div className="flex items-center gap-2">
              <DoorClosed className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">
                  Responsabilidad en Puerta
                </span>
                <p className="text-sm font-black text-slate-900">{staff.assignedGate}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Teléfono Móvil</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{staff.phone}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Correo Institucional</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{staff.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(staff);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition cursor-pointer"
            >
              Editar Registro
            </button>
          )}
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
