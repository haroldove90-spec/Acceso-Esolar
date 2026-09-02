import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  QrCode,
  Edit2,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  X,
  FileText,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StudentCardModal } from '../common/StudentCardModal';

export const StudentsModule: React.FC = () => {
  const { students, addStudent, updateStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('todos');
  const [selectedGroup, setSelectedGroup] = useState<string>('todos');
  const [cardModalStudent, setCardModalStudent] = useState<Student | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tutorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === 'todos' || s.grade === selectedGrade;
    const matchesGroup = selectedGroup === 'todos' || s.group === selectedGroup;

    return matchesSearch && matchesGrade && matchesGroup;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-xl font-black text-slate-900">Gestión de Alumnos y Grupos</h2>
            <span className="bg-sky-100 text-sky-900 text-xs sm:text-sm font-black px-3 py-1 rounded-full border border-sky-200">
              Padrón: 700 Plazas ({students.length} Registrados)
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Consulta del padrón escolar, asignación por grado y vinculación con tutores legales.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          <span>Registrar Alumno</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o tutor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full py-2.5 px-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Grados (1° a 6°)</option>
            <option value="1°">1° Primaria</option>
            <option value="2°">2° Primaria</option>
            <option value="3°">3° Primaria</option>
            <option value="4°">4° Primaria</option>
            <option value="5°">5° Primaria</option>
            <option value="6°">6° Primaria</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="w-full py-2.5 px-3.5 text-sm sm:text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los Grupos (A, B, C)</option>
            <option value="A">Grupo A</option>
            <option value="B">Grupo B</option>
            <option value="C">Grupo C</option>
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
                <th className="py-3.5 px-3 sm:px-4">Estatus</th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Credencial / Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={student.photoUrl}
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
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{student.tutorName}</p>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{student.tutorPhone}</span>
                      </p>
                    </td>
                    <td className="py-3.5 px-3 sm:px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setCardModalStudent(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs sm:text-sm border border-blue-200 transition cursor-pointer"
                          title="Ver Credencial Digital y QR"
                        >
                          <QrCode className="w-4 h-4" />
                          <span className="hidden sm:inline">Credencial QR</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                          title="Editar Alumno"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
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
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingStudent ? 'Actualizar Datos de Alumno' : 'Registrar Nuevo Alumno al Padrón'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3.5">
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
                  <label className="font-black text-slate-800 text-sm block mb-1">Grado *</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="1°">1° de Primaria</option>
                    <option value="2°">2° de Primaria</option>
                    <option value="3°">3° de Primaria</option>
                    <option value="4°">4° de Primaria</option>
                    <option value="5°">5° de Primaria</option>
                    <option value="6°">6° de Primaria</option>
                  </select>
                </div>

                <div>
                  <label className="font-black text-slate-800 text-sm block mb-1">Grupo *</label>
                  <select
                    value={formData.group}
                    onChange={e => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="A">Grupo A</option>
                    <option value="B">Grupo B</option>
                    <option value="C">Grupo C</option>
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
                <span className="font-black text-slate-900 text-base block mb-2">Vinculación con Tutor Legal</span>
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

              {/* Medical and Emergency */}
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
                  <label className="font-bold text-slate-700 text-sm block mb-1">Estatus del Alumno</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

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

      {/* Credential Modal */}
      {cardModalStudent && (
        <StudentCardModal
          student={cardModalStudent}
          onClose={() => setCardModalStudent(null)}
        />
      )}
    </div>
  );
};
