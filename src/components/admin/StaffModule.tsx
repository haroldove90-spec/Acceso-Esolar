import React, { useState } from 'react';
import { UserCheck, Plus, Search, Shield, DoorClosed, Phone, Mail, CheckCircle, Edit3, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember, GateType } from '../../types';

export const StaffModule: React.FC = () => {
  const { staff, addStaff, updateStaff } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    roleTitle: 'Docente de Grupo',
    subjectOrArea: 'Educación Primaria',
    assignedGate: 'Portón Principal (Entrada General)' as GateType,
    phone: '',
    email: '',
    shift: 'Matutino' as 'Matutino' | 'Vespertino' | 'Completo',
    status: 'En Turno' as 'En Turno' | 'Fuera de Servicio',
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      fullName: '',
      roleTitle: 'Docente de Grupo',
      subjectOrArea: 'Educación Primaria',
      assignedGate: 'Portón Principal (Entrada General)',
      phone: '',
      email: '',
      shift: 'Matutino',
      status: 'En Turno',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      fullName: member.fullName,
      roleTitle: member.roleTitle,
      subjectOrArea: member.subjectOrArea,
      assignedGate: member.assignedGate,
      phone: member.phone,
      email: member.email,
      shift: member.shift,
      status: member.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingStaff) {
      updateStaff({
        ...editingStaff,
        ...formData,
      });
    } else {
      addStaff(formData);
    }
    setIsModalOpen(false);
  };

  const filteredStaff = staff.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.assignedGate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Gestión de Personal & Portones</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Alta de docentes, asignaturas y delegación de responsabilidad de control de acceso en puertas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Alta de Personal</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cargo o portón asignado..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {member.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{member.fullName}</h3>
                  <p className="text-xs font-semibold text-sky-700 mt-0.5">{member.roleTitle}</p>
                  <p className="text-[11px] text-slate-400">{member.subjectOrArea}</p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  member.status === 'En Turno'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {member.status}
              </span>
            </div>

            {/* Assigned Gate Box */}
            <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DoorClosed className="w-4 h-4 text-sky-700 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-sky-900 block leading-tight">Responsabilidad de Acceso:</span>
                  <span className="text-xs font-semibold text-slate-800">{member.assignedGate}</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200">
                {member.shift}
              </span>
            </div>

            {/* Contact & Actions */}
            <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {member.phone}
                </span>
              </div>
              <button
                onClick={() => handleOpenEdit(member)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-sky-50 font-semibold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Reasignar / Editar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingStaff ? 'Reasignar Responsabilidades de Personal' : 'Alta de Personal Escolar'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Docente / Personal *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Prof. Roberto Alarcón Díaz"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cargo / Título</label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Asignatura / Área</label>
                  <input
                    type="text"
                    value={formData.subjectOrArea}
                    onChange={e => setFormData({ ...formData, subjectOrArea: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Responsabilidad de Portón / Acceso *</label>
                <select
                  value={formData.assignedGate}
                  onChange={e => setFormData({ ...formData, assignedGate: e.target.value as GateType })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none font-semibold text-slate-800"
                >
                  <option value="Portón Principal (Entrada General)">Portón Principal (Entrada General)</option>
                  <option value="Portón 2 (Primaria / Vehicular)">Portón 2 (Primaria / Vehicular)</option>
                  <option value="Portón 3 (Peatonal / Secundaria)">Portón 3 (Peatonal / Secundaria)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turno</label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Completo">Completo</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estatus</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="En Turno">En Turno</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition shadow"
                >
                  {editingStaff ? 'Guardar Asignación' : 'Registrar Personal'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
