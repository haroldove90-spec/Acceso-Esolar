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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900">Gestión de Alumnos y Grupos</h2>
            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Padrón: 700 Plazas ({students.length} Registrados)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta del padrón escolar, asignación por grado y vinculación con tutores legales.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Alumno</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o tutor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
            className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="todos">Todos los Grupos (A, B, C)</option>
            <option value="A">Grupo A</option>
            <option value="B">Grupo B</option>
            <option value="C">Grupo C</option>
          </select>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Alumno / Matrícula</th>
                <th className="py-3 px-3">Grado & Grupo</th>
                <th className="py-3 px-3">Tutor Legal & Contacto</th>
                <th className="py-3 px-3">Estatus</th>
                <th className="py-3 px-4 text-right">Credencial / Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photoUrl}
                          alt={student.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{student.fullName}</p>
                          <span className="font-mono text-[11px] text-sky-700 font-semibold">
                            {student.enrollmentId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 bg-sky-50 text-sky-800 font-extrabold rounded-md border border-sky-200">
                        {student.grade} - {student.group}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{student.shift}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{student.tutorName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.tutorPhone}</span>
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setCardModalStudent(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition"
                          title="Ver Credencial Digital y QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Credencial QR</span>
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="Editar Alumno"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
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

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Alumno *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="Ej. Sofía Mendoza Sanabria"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Matrícula Escolar *</label>
                  <input
                    type="text"
                    required
                    value={formData.enrollmentId}
                    onChange={e => setFormData({ ...formData, enrollmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grado *</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
                  <label className="font-bold text-slate-700 block mb-1">Grupo *</label>
                  <select
                    value={formData.group}
                    onChange={e => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="A">Grupo A</option>
                    <option value="B">Grupo B</option>
                    <option value="C">Grupo C</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Turno *</label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                </div>
              </div>

              {/* Tutor Details */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900 block mb-2">Vinculación con Tutor Legal</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-slate-600 block mb-1">Nombre del Tutor *</label>
                    <input
                      type="text"
                      required
                      value={formData.tutorName}
                      onChange={e => setFormData({ ...formData, tutorName: e.target.value })}
                      placeholder="Ej. Vita Aurora Sanabria Lara"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Teléfono Móvil (Alertas)</label>
                    <input
                      type="text"
                      value={formData.tutorPhone}
                      onChange={e => setFormData({ ...formData, tutorPhone: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.tutorEmail}
                      onChange={e => setFormData({ ...formData, tutorEmail: e.target.value })}
                      placeholder="tutor@email.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical and Emergency */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Tipo de Sangre</label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Estatus del Alumno</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition shadow"
                >
                  {editingStudent ? 'Guardar Cambios' : 'Registrar en Padrón'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
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
