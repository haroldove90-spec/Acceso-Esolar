import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-100 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D91A2A] border border-red-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">{message}</p>
        </div>

        <div className="p-3.5 bg-red-50/70 rounded-2xl border border-red-200">
          <span className="text-xs font-bold text-red-900 block">Registro a eliminar:</span>
          <span className="text-sm font-black text-[#D91A2A]">{itemName}</span>
        </div>

        <p className="text-[11px] font-semibold text-slate-400">
          Esta acción es permanente y eliminará el registro de la base de datos local.
        </p>

        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#D91A2A] hover:bg-[#b81220] text-white text-xs sm:text-sm font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirmar Eliminación</span>
          </button>
          <button
            onClick={onCancel}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
