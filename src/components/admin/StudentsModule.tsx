import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  QrCode,
  Edit2,
  Phone,
  CheckCircle2,
  X,
  Trash2,
  Eye,
  Power,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentCardModal } from '../common/StudentCardModal';
import { PhotoUploader } from '../common/PhotoUploader';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';
import { SECONDARY_GRADES, SECONDARY_GROUPS } from '../../constants/schoolStructure';

export const StudentsModule: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent, toggleStudentStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('todos');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  
  // Modals state
  const [cardModalStudent, setCardModalStudent] = useState<Student | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    enrollmentId: '',
    grade: '1°',
    group: 'A',
    shift: 'Matutino' as 'Matutino' | 'Vespertino',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
    tutorName: '',
    tutorPhone: '',
    tutorEmail: '',
    status: 'Activo' as 'Activo' | 'Inactivo',
    bloodType: 'O+',
    emergencyContact: '',
    medicalNotes: '',
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const nextNum = (students.length + 1).toString().padStart(3, '0');
    setFormData({
      fullName: '',
      enrollmentId: `ALU-2026-${nextNum}`,
      grade: '1°',
      group: 'A',
      shift: 'Matutino',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250',
      tutorName: '',
      tutorPhone: '',
      tutorEmail: '',
      status: 'Activo',
      bloodType: 'O+',
      emergencyContact: '',
      medicalNotes: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      enrollmentId: student.enrollmentId,
      grade: student.grade,
      group: student.group,
      shift: student.shift,
      photoUrl: student.photoUrl,
      tutorName: student.tutorName,
      tutorPhone: student.tutorPhone,
      tutorEmail: student.tutorEmail,
      status: student.status,
      bloodType: student.bloodType,
      emergencyContact: student.emergencyContact,
      medicalNotes: student.medicalNotes || '',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.tutorName.trim()) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      addStudent(formData);
    }
    setIsFormModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tutorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'todos' || s.grade === selectedGrade;
    const matchesGroup = selectedGroup === 'todos' || s.group === selectedGroup;
    const matchesStatus = selectedStatus === 'todos' || s.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesGroup && matchesStatus;
  });

  const activeCount = students.filter(s => s.status === 'Activo').length;
  const inactiveCount = students.filter(s => s.status === 'Inactivo').length;

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-xl font-black text-slate-900">Gestión de Alumnos y Grupos</h2>
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
            Administra el padrón escolar con alta fotográfica, credencial digital, edición, desactivación y borrado de registros.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>Alta de Alumno</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative sm:col-span-5">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o tutor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Grados (Secundaria)</option>
            {SECONDARY_GRADES.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Grupos (12)</option>
            {SECONDARY_GROUPS.map(grp => (
              <option key={grp} value={grp}>Grupo {grp}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Estatus</option>
            <option value="Activo">Solo Activos</option>
            <option value="Inactivo">Solo Inactivos (Desactivados)</option>
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-5">Alumno / Matrícula</th>
                <th className="py-3.5 px-3 sm:px-4">Grado & Grupo</th>
                <th className="py-3.5 px-3 sm:px-4">Tutor Legal & Contacto</th>
                <th className="py-3.5 px-3 sm:px-4 text-center">Estatus (Activar / Desactivar)</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className={`transition ${
                      student.status === 'Inactivo' ? 'bg-slate-50/60 opacity-80' : 'hover:bg-blue-50/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={student.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=250'}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200 shrink-0 shadow-xs"
                        />
                        <div>
                          <p className="font-black text-slate-900 text-sm sm:text-base leading-tight">{student.fullName}</p>
                          <span className="font-mono text-xs sm:text-sm text-blue-700 font-extrabold mt-0.5 inline-block">
                            {student.enrollmentId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <span className="inline-block px-2.5 py-1 bg-sky-50 text-sky-900 font-black text-xs sm:text-sm rounded-xl border border-sky-200">
                        {student.grade} - {student.group}
                      </span>
                      <span className="block text-xs font-bold text-slate-500 mt-1">{student.shift}</span>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <p className="font-bold text-slate-900 text-sm">{student.tutorName}</p>
                      <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.tutorPhone}</span>
                      </p>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      <button
                        onClick={() => toggleStudentStatus(student.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border transition cursor-pointer ${
                          student.status === 'Activo'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                        }`}
                        title={student.status === 'Activo' ? 'Clic para Desactivar Alumno' : 'Clic para Activar Alumno'}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{student.status}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ver / Credencial QR */}
                        <button
                          onClick={() => setCardModalStudent(student)}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition cursor-pointer flex items-center gap-1"
                          title="Ver Credencial Digital y Código QR"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden md:inline">Ver</span>
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                          title="Editar Registro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Borrar */}
                        <button
                          onClick={() => setStudentToDelete(student)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition cursor-pointer"
                          title="Eliminar Alumno"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 text-sm font-semibold">
                    No se encontraron alumnos con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingStudent ? 'Editar Registro de Alumno (Secundaria)' : 'Alta de Nuevo Alumno (Secundaria)'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {editingStudent ? 'Actualiza los datos y la fotografía del alumno de secundaria.' : 'Registro oficial en Secundaria General No. 1 Moisés Sáenz (Grupos A a la L).'}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              {/* Photo Uploader Field */}
              <PhotoUploader
                photoUrl={formData.photoUrl}
                onChange={url => setFormData({ ...formData, photoUrl: url })}
                label="Fotografía del Alumno"
                helperText="Sube foto (JPG/PNG) o toma con cámara"
                type="student"
              />

              {/* Student Basic Info */}
              <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                <div className="col-span-2">
                  <label className="font-black text-slate-800 text-sm block mb-1">Nombre Completo del Alumno *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ej. Sofía Mendoza Sanabria"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Matrícula Escolar *</label>
                  <input
                    type="text"
                    required
                    value={formData.enrollmentId}
                    onChange={e => setFormData({ ...formData, enrollmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Grado (Secundaria) *</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SECONDARY_GRADES.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Grupo (12 Grupos: A al L) *</label>
                  <select
                    value={formData.group}
                    onChange={e => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {SECONDARY_GROUPS.map(grp => (
                      <option key={grp} value={grp}>Grupo {grp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Turno *</label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                </div>
              </div>

              {/* Tutor Details */}
              <div className="pt-3 border-t border-slate-100">
                <span className="font-black text-slate-900 text-sm block mb-2">Vinculación con Tutor Legal</span>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="col-span-2">
                    <label className="font-bold text-slate-700 text-sm block mb-1">Nombre del Tutor *</label>
                    <input
                      type="text"
                      required
                      value={formData.tutorName}
                      onChange={e => setFormData({ ...formData, tutorName: e.target.value })}
                      placeholder="Ej. Vita Aurora Sanabria Lara"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 text-sm block mb-1">Teléfono Móvil (Alertas)</label>
                    <input
                      type="text"
                      value={formData.tutorPhone}
                      onChange={e => setFormData({ ...formData, tutorPhone: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 text-sm block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.tutorEmail}
                      onChange={e => setFormData({ ...formData, tutorEmail: e.target.value })}
                      placeholder="tutor@email.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical and Status */}
              <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 text-sm block mb-1">Tipo de Sangre</label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 text-sm block mb-1">Estatus del Registro</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Activo">Activo (Habilitado)</option>
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
                  {editingStudent ? 'Guardar Cambios' : 'Registrar en Padrón'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credential / View Modal */}
      {cardModalStudent && (
        <StudentCardModal
          student={cardModalStudent}
          onClose={() => setCardModalStudent(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!studentToDelete}
        title="¿Eliminar Alumno del Padrón?"
        message="Se eliminará la ficha escolar, credencial digital y vinculación con tutores."
        itemName={studentToDelete ? `${studentToDelete.fullName} (${studentToDelete.enrollmentId})` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};
