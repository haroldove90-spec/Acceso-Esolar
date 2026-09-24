import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Shield,
  DoorClosed,
  Phone,
  Mail,
  CheckCircle,
  Edit3,
  X,
  Trash2,
  Eye,
  Power,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StaffMember, GateType } from '../../types';
import { PhotoUploader } from '../common/PhotoUploader';
import { StaffCardModal } from '../common/StaffCardModal';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const StaffModule: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, toggleStaffStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGateFilter, setSelectedGateFilter] = useState<string>('todos');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    roleTitle: 'Docente de Grupo',
    subjectOrArea: 'Educación Secundaria / Tecnologías',
    assignedGate: 'Portón Principal (Entrada General)' as GateType,
    phone: '',
    email: '',
    shift: 'Matutino' as 'Matutino' | 'Vespertino' | 'Completo',
    status: 'En Turno' as 'En Turno' | 'Fuera de Servicio' | 'Inactivo',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      fullName: '',
      roleTitle: 'Docente de Grupo',
      subjectOrArea: 'Educación Secundaria / Tecnologías',
      assignedGate: 'Portón Principal (Entrada General)',
      phone: '',
      email: '',
      shift: 'Matutino',
      status: 'En Turno',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
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
      photoUrl: member.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
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

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete.id);
      setStaffToDelete(null);
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subjectOrArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.assignedGate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGate = selectedGateFilter === 'todos' || s.assignedGate === selectedGateFilter;
    const matchesStatus =
      selectedStatusFilter === 'todos' ||
      (selectedStatusFilter === 'Activos' && s.status !== 'Inactivo') ||
      (selectedStatusFilter === 'Inactivos' && s.status === 'Inactivo');

    return matchesSearch && matchesGate && matchesStatus;
  });

  const activeCount = staff.filter(s => s.status !== 'Inactivo').length;
  const inactiveCount = staff.filter(s => s.status === 'Inactivo').length;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-xl font-black text-slate-900">Gestión de Personal & Docentes</h2>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                {activeCount} Activos
              </span>
              {inactiveCount > 0 && (
                <span className="bg-slate-100 text-slate-700 text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-200">
                  {inactiveCount} Inactivos
                </span>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Alta de docentes con fotografía oficial, delegación de portones, edición, activación/desactivación y borrado.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>Alta de Personal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, cargo, materia o portón..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedGateFilter}
            onChange={e => setSelectedGateFilter(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Portones</option>
            <option value="Portón Principal (Entrada General)">Portón Principal</option>
            <option value="Portón 2 (Vehicular / Secundaria)">Portón 2 (Vehicular)</option>
            <option value="Portón 3 (Peatonal / Secundaria)">Portón 3 (Peatonal)</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Estatus</option>
            <option value="Activos">Solo Activos / En Turno</option>
            <option value="Inactivos">Solo Inactivos (Desactivados)</option>
          </select>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.length > 0 ? (
          filteredStaff.map(member => (
            <div
              key={member.id}
              className={`bg-white p-5 rounded-3xl border transition shadow-xs flex flex-col justify-between space-y-3.5 ${
                member.status === 'Inactivo'
                  ? 'border-slate-200 bg-slate-50/50 opacity-80'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center shadow-xs">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-lg">
                        {member.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-tight">{member.fullName}</h3>
                    <p className="text-xs font-bold text-blue-700 mt-0.5">{member.roleTitle}</p>
                    <p className="text-xs font-semibold text-slate-500">{member.subjectOrArea}</p>
                  </div>
                </div>

                {/* Status toggle button */}
                <button
                  onClick={() => toggleStaffStatus(member.id)}
                  className={`text-xs font-black px-3 py-1 rounded-full border flex items-center gap-1.5 transition cursor-pointer ${
                    member.status === 'En Turno'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                      : member.status === 'Inactivo'
                      ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-slate-100'
                  }`}
                  title={member.status === 'Inactivo' ? 'Clic para Activar Personal' : 'Clic para Desactivar Personal'}
                >
                  <Power className="w-3 h-3" />
                  <span>{member.status}</span>
                </button>
              </div>

              {/* Assigned Gate Box */}
              <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <DoorClosed className="w-5 h-5 text-blue-700 shrink-0 stroke-[2.2]" />
                  <div>
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider block leading-tight">
                      Responsabilidad de Acceso
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">{member.assignedGate}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-800 bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs">
                  {member.shift}
                </span>
              </div>

              {/* Contact & Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {member.phone || 'Sin tel.'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Ver Ficha */}
                  <button
                    onClick={() => setViewingStaff(member)}
                    className="p-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition cursor-pointer flex items-center gap-1"
                    title="Ver Ficha de Personal"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="p-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer flex items-center gap-1"
                    title="Editar Personal"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {/* Borrar */}
                  <button
                    onClick={() => setStaffToDelete(member)}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition cursor-pointer"
                    title="Eliminar Personal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-10 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 font-semibold">
            No se encontró personal docente con los criterios seleccionados.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingStaff ? 'Editar Ficha y Responsabilidad de Personal' : 'Alta de Personal Escolar'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {editingStaff ? 'Actualiza los datos, fotografía y portón asignado.' : 'Ingresa los datos oficiales y sube la fotografía del docente.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              {/* Photo Uploader */}
              <PhotoUploader
                photoUrl={formData.photoUrl}
                onChange={url => setFormData({ ...formData, photoUrl: url })}
                label="Fotografía del Docente / Personal"
                helperText="Sube foto (JPG/PNG) o toma con cámara"
                type="staff"
              />

              <div className="pt-2 border-t border-slate-100">
                <label className="font-black text-slate-800 text-sm block mb-1">
                  Nombre Completo del Docente / Personal *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Prof. Roberto Alarcón Díaz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Cargo / Título</label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={e => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Asignatura / Área</label>
                  <input
                    type="text"
                    value={formData.subjectOrArea}
                    onChange={e => setFormData({ ...formData, subjectOrArea: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-black text-slate-800 text-sm block mb-1">
                  Responsabilidad de Portón / Acceso *
                </label>
                <select
                  value={formData.assignedGate}
                  onChange={e => setFormData({ ...formData, assignedGate: e.target.value as GateType })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-800 text-sm"
                >
                  <option value="Portón Principal (Entrada General)">Portón Principal (Entrada General)</option>
                  <option value="Portón 2 (Vehicular / Secundaria)">Portón 2 (Vehicular / Secundaria)</option>
                  <option value="Portón 3 (Peatonal / Secundaria)">Portón 3 (Peatonal / Secundaria)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="docente@escuela.edu.mx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Turno</label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Completo">Completo</option>
                  </select>
                </div>
                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Estatus</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="En Turno">En Turno (Activo)</option>
                    <option value="Fuera de Servicio">Fuera de Servicio</option>
                    <option value="Inactivo">Inactivo (Desactivado)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons: Save & Cancel */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm sm:text-base transition shadow cursor-pointer"
                >
                  {editingStaff ? 'Guardar Cambios' : 'Registrar Personal'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Staff Card Modal */}
      {viewingStaff && (
        <StaffCardModal
          staff={viewingStaff}
          onClose={() => setViewingStaff(null)}
          onEdit={member => handleOpenEdit(member)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!staffToDelete}
        title="¿Eliminar Personal del Sistema?"
        message="Se removerá la asignación de portón y la ficha del docente."
        itemName={staffToDelete ? `${staffToDelete.fullName} (${staffToDelete.roleTitle})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStaffToDelete(null)}
      />
    </div>
  );
};
