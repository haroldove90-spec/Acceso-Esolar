import React, { useState } from 'react';
import {
  FileText,
  Send,
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Printer,
  Download,
  Filter,
  Search,
  Volume2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Megaphone,
  UserCheck,
  UserX,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DirectNotice, AttendanceStatus, Student } from '../../types';
import { OfficialCitationPrintModal } from './OfficialCitationPrintModal';
import { soundEffects } from '../../utils/audioNotification';
import { SECONDARY_GRADES, SECONDARY_GROUPS } from '../../constants/schoolStructure';

export const ReportsModule: React.FC = () => {
  const {
    accessRecords,
    students,
    notices,
    createAndSendOfficialNotice,
    simulateOfficialCitationAlert,
    showToast,
  } = useApp();

  // Main Active Subtab inside Reports Module
  const [subTab, setSubTab] = useState<'create' | 'history' | 'attendance'>('create');

  // Form State for creating new Official Report / Citation / Notice
  const [docCategory, setDocCategory] = useState<DirectNotice['category']>('Citatorio');
  const [targetScope, setTargetScope] = useState<'individual' | 'grade_group' | 'masivo'>('individual');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [selectedGrade, setSelectedGrade] = useState<string>('3°');
  const [selectedGroup, setSelectedGroup] = useState<string>('A');
  const [priority, setPriority] = useState<DirectNotice['priority']>('Urgente');
  const [title, setTitle] = useState<string>('Citatorio Oficial: Reunión de Seguimiento en Dirección');
  const [message, setMessage] = useState<string>(
    'Se solicita atentamente la presencia del padre de familia o tutor en la Dirección del plantel para tratar asuntos urgentes relacionados con el desempeño escolar y acuerdos de apoyo mutuo.'
  );
  const [citatorioDate, setCitatorioDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [citatorioTime, setCitatorioTime] = useState<string>('08:30 AM');
  const [citatorioLocation, setCitatorioLocation] = useState<string>('Dirección Escolar (Planta Alta)');
  const [requiresConfirmation, setRequiresConfirmation] = useState<boolean>(true);
  const [studentSearchTerm, setStudentSearchTerm] = useState<string>('');

  // Print Modal State
  const [printNotice, setPrintNotice] = useState<DirectNotice | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Filters for History Subtab
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('todos');
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');

  // Attendance Subtab Filters & Metrics
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attGrade, setAttGrade] = useState<string>('todos');
  const [attStatus, setAttStatus] = useState<string>('todos');
  const [attSearch, setAttSearch] = useState<string>('');

  // Metrics for attendance
  const registeredCount = accessRecords.length;
  const onTimeCount = accessRecords.filter(r => r.status === 'on_time' || r.status === 'present').length;
  const lateCount = accessRecords.filter(r => r.status === 'late').length;
  const punctualityRate = registeredCount > 0 ? Math.round((onTimeCount / registeredCount) * 100) : 100;

  // Selected student entity
  const currentSelectedStudent = students.find(s => s.id === selectedStudentId);

  // Filtered Students for the Search Picker
  const matchingStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    s.enrollmentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    s.tutorName.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Group student count
  const groupStudentCount = students.filter(
    s => s.grade === selectedGrade && s.group === selectedGroup
  ).length;

  // Quick preset templates
  const applyPreset = (type: 'citatorio_conducta' | 'citatorio_academico' | 'reporte_indisciplina' | 'aviso_asamblea' | 'aviso_boletas') => {
    switch (type) {
      case 'citatorio_conducta':
        setDocCategory('Citatorio');
        setPriority('Urgente');
        setTitle('🚨 CITATORIO URGENTE: Asunto de Conducta y Disciplina');
        setMessage(
          'Se solicita de manera urgente e inaplazable la presencia del tutor del alumno en las oficinas de Dirección Escolar para atender incidencias de conducta registradas durante la jornada.'
        );
        setCitatorioLocation('Dirección Escolar (Planta Alta)');
        setRequiresConfirmation(true);
        break;
      case 'citatorio_academico':
        setDocCategory('Citatorio');
        setPriority('Importante');
        setTitle('Citatorio Académico: Revisión de Desempeño y Calificaciones');
        setMessage(
          'Se convoca al padre o tutor a una entrevista pedagógica con los docentes de grado para coordinar estrategias de nivelación académica y entrega de proyectos pendientes.'
        );
        setCitatorioLocation('Sala de Docentes / Coordinación Académica');
        setRequiresConfirmation(true);
        break;
      case 'reporte_indisciplina':
        setDocCategory('Reporte Disciplinario');
        setPriority('Importante');
        setTitle('Reporte Disciplinario: Incidencia preventiva en aula');
        setMessage(
          'Se emite el presente reporte debido a la distracción constante y falta de cumplimiento del reglamento escolar. Solicitamos platicar con el alumno para mantener una convivencia armónica.'
        );
        setRequiresConfirmation(true);
        break;
      case 'aviso_asamblea':
        setDocCategory('Aviso General');
        setPriority('Normal');
        setTargetScope('masivo');
        setTitle('📢 CONVOCATORIA: Asamblea General de Padres de Familia');
        setMessage(
          'Estimada comunidad escolar: Se convoca a todos los padres, madres y tutores a la Asamblea General del ciclo escolar en el domo principal del plantel. Su participación es muy valiosa.'
        );
        setRequiresConfirmation(false);
        break;
      case 'aviso_boletas':
        setDocCategory('Aviso General');
        setPriority('Normal');
        setTargetScope('grade_group');
        setTitle('Aviso de Entrega de Boletas del Periodo');
        setMessage(
          'Se informa que este viernes se llevará a cabo la entrega de evaluaciones trimestrales. Favor de asistir puntualmente con una identificación.'
        );
        setRequiresConfirmation(true);
        break;
    }
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Campos Incompletos', 'Por favor ingresa un título y mensaje.', 'warning');
      return;
    }

    if (targetScope === 'individual' && !selectedStudentId) {
      showToast('Selecciona un Alumno', 'Debes seleccionar al alumno destinatario.', 'warning');
      return;
    }

    const result = createAndSendOfficialNotice({
      category: docCategory,
      title: title.trim(),
      message: message.trim(),
      priority,
      targetScope,
      targetStudentId: selectedStudentId,
      targetGrade: selectedGrade,
      targetGroup: selectedGroup,
      citatorioDate: docCategory === 'Citatorio' || docCategory === 'Citatorio Dirección' ? citatorioDate : undefined,
      citatorioTime: docCategory === 'Citatorio' || docCategory === 'Citatorio Dirección' ? citatorioTime : undefined,
      citatorioLocation: docCategory === 'Citatorio' || docCategory === 'Citatorio Dirección' ? citatorioLocation : undefined,
      requiresConfirmation,
    });

    if (result.success) {
      // Auto-switch to history tab to see the created record and print option
      setSubTab('history');
    }
  };

  // Filter notices for history
  const filteredNotices = notices.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      n.studentName.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      n.tutorName.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(historySearchTerm.toLowerCase());

    const matchesCat =
      historyCategoryFilter === 'todos' ||
      (historyCategoryFilter === 'citatorios' && (n.category === 'Citatorio' || n.category === 'Citatorio Dirección')) ||
      (historyCategoryFilter === 'reportes' && (n.category === 'Reporte Disciplinario' || n.category === 'Conducta')) ||
      (historyCategoryFilter === 'avisos' && n.category === 'Aviso General');

    return matchesSearch && matchesCat;
  });

  // Export CSV for attendance
  const handleExportCSV = () => {
    const filteredRecords = accessRecords.filter(record => {
      const matchesSearch =
        record.studentName.toLowerCase().includes(attSearch.toLowerCase()) ||
        record.enrollmentId.toLowerCase().includes(attSearch.toLowerCase()) ||
        record.gate.toLowerCase().includes(attSearch.toLowerCase());
      const matchesGrade = attGrade === 'todos' || record.grade === attGrade;
      const matchesStatus = attStatus === 'todos' || record.status === attStatus;
      return matchesSearch && matchesGrade && matchesStatus;
    });

    const headers = ['Matricula', 'Alumno', 'Grado', 'Grupo', 'Tipo', 'Hora', 'Fecha', 'Estatus', 'Porton', 'RegistradoPor'];
    const rows = filteredRecords.map(r => [
      r.enrollmentId,
      `"${r.studentName}"`,
      r.grade,
      r.group,
      r.type,
      r.formattedTime,
      r.date,
      r.status,
      `"${r.gate}"`,
      `"${r.registeredBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Accesos_Moisés_Sáenz_${attDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Section Header & Subnavigation */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#D91A2A] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Módulo Oficial de Reportes
              </span>
              <span className="text-xs font-bold text-slate-500">
                Emisión Individual & Masiva
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Gestor de Citatorios, Reportes & Avisos a Padres de Familia
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
              Crea comunicados oficiales con confirmación de acuse, activa notificaciones sonoras y envía alertas flotantes en tiempo real.
            </p>
          </div>

          {/* Subnavigation Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start lg:self-auto overflow-x-auto w-full lg:w-auto">
            <button
              onClick={() => setSubTab('create')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
                subTab === 'create'
                  ? 'bg-[#0D6938] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Emitir Comunicado</span>
            </button>

            <button
              onClick={() => setSubTab('history')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
                subTab === 'history'
                  ? 'bg-[#0D6938] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Historial & Acuses</span>
              <span className="ml-1 px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
                {notices.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('attendance')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
                subTab === 'attendance'
                  ? 'bg-[#0D6938] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Reporte de Accesos</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: CREAR CITATORIO / REPORTE / AVISO */}
      {subTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: The Builder Form */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
            {/* Quick Preset Buttons */}
            <div className="mb-6 pb-5 border-b border-slate-100">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-4 h-4 text-[#D91A2A]" /> Plantillas Rápidas Preconfiguradas:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('citatorio_conducta')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-red-50 hover:bg-red-100 text-[#D91A2A] border border-red-200 transition cursor-pointer"
                >
                  🚨 Citatorio de Conducta
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('citatorio_academico')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                >
                  📋 Citatorio Académico
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('reporte_indisciplina')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition cursor-pointer"
                >
                  ⚠️ Reporte de Aula
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('aviso_asamblea')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 hover:bg-emerald-100 text-[#0D6938] border border-emerald-200 transition cursor-pointer"
                >
                  📢 Aviso Masivo a Toda la Escuela
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('aviso_boletas')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-sky-50 hover:bg-sky-100 text-[#5B92C8] border border-sky-200 transition cursor-pointer"
                >
                  📑 Entrega de Boletas
                </button>
              </div>
            </div>

            <form onSubmit={handleSendNotice} className="space-y-5">
              {/* Row 1: Document Type & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Tipo de Documento Oficial:
                  </label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value as DirectNotice['category'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                  >
                    <option value="Citatorio">🚨 Citatorio Oficial (Cita en Plantel)</option>
                    <option value="Citatorio Dirección">🏢 Citatorio de Dirección Escolar</option>
                    <option value="Reporte Disciplinario">📋 Reporte de Conducta / Disciplina</option>
                    <option value="Aviso General">📢 Aviso Institucional / Circular</option>
                    <option value="Tareas y Materiales">📚 Reporte Académico / Tareas</option>
                    <option value="Felicitación">⭐ Felicitación / Mención Honorífica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Nivel de Prioridad:
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as DirectNotice['priority'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                  >
                    <option value="Urgente">🔴 Urgente (Alerta Inmediata con Sonido y Ventana Flotante)</option>
                    <option value="Importante">🟡 Importante (Notificación Prioritaria)</option>
                    <option value="Normal">🟢 Normal (Informativo)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Scope Selector (Individual / Por Grupo / Masivo) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Modalidad de Envío y Destinatarios:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTargetScope('individual')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 text-xs font-black transition cursor-pointer ${
                      targetScope === 'individual'
                        ? 'border-[#D91A2A] bg-red-50/70 text-[#D91A2A] shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Individual (1 Alumno)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetScope('grade_group')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 text-xs font-black transition cursor-pointer ${
                      targetScope === 'grade_group'
                        ? 'border-[#0D6938] bg-emerald-50/70 text-[#0D6938] shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Por Grado y Grupo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetScope('masivo')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 text-xs font-black transition cursor-pointer ${
                      targetScope === 'masivo'
                        ? 'border-[#5B92C8] bg-sky-50 text-[#1e40af] shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>Masivo (Toda la Escuela)</span>
                  </button>
                </div>
              </div>

              {/* Conditional Recipient Pickers */}
              {targetScope === 'individual' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-black uppercase text-slate-800">
                      Buscar y Seleccionar Alumno:
                    </label>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o matrícula..."
                        value={studentSearchTerm}
                        onChange={e => setStudentSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                      />
                    </div>
                  </div>

                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                  >
                    {matchingStudents.map(stu => (
                      <option key={stu.id} value={stu.id}>
                        {stu.fullName} • Grado {stu.grade} {stu.group} • Tutor: {stu.tutorName}
                      </option>
                    ))}
                  </select>

                  {currentSelectedStudent && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <img
                        src={currentSelectedStudent.photoUrl}
                        alt={currentSelectedStudent.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-slate-900 truncate">{currentSelectedStudent.fullName}</p>
                        <p className="text-slate-600 font-bold text-[11px]">
                          Tutor: {currentSelectedStudent.tutorName} • Tel: {currentSelectedStudent.tutorPhone}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0D6938] font-black text-[11px] whitespace-nowrap">
                        {currentSelectedStudent.grade} {currentSelectedStudent.group}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {targetScope === 'grade_group' && (
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase text-[#0D6938] mb-1">
                        Grado Escolar (Secundaria):
                      </label>
                      <select
                        value={selectedGrade}
                        onChange={e => setSelectedGrade(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-slate-900"
                      >
                        {SECONDARY_GRADES.map(g => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-[#0D6938] mb-1">
                        Grupo (12 Grupos A al L):
                      </label>
                      <select
                        value={selectedGroup}
                        onChange={e => setSelectedGroup(e.target.value)}
                        className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs sm:text-sm font-bold text-slate-900"
                      >
                        {SECONDARY_GROUPS.map(grp => (
                          <option key={grp} value={grp}>Grupo {grp}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-xs font-black text-[#0D6938] mt-2.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> Se enviará a todos los padres de familia del grupo: {selectedGrade} {selectedGroup} ({groupStudentCount} alumnos activos en sistema).
                  </p>
                </div>
              )}

              {targetScope === 'masivo' && (
                <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 flex items-center gap-3">
                  <div className="p-3 bg-sky-100 rounded-xl text-[#5B92C8]">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Emisión Masiva Institucional</h4>
                    <p className="text-xs font-semibold text-slate-600">
                      El comunicado llegará simultáneamente a los teléfonos y portales de los <strong>{students.length} padres de familia</strong> registrados en el padrón escolar de la Moisés Sáenz.
                    </p>
                  </div>
                </div>
              )}

              {/* Citatorio Specific Fields */}
              {(docCategory === 'Citatorio' || docCategory === 'Citatorio Dirección') && (
                <div className="bg-red-50/50 p-4 sm:p-5 rounded-2xl border border-red-200 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#D91A2A] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Datos Específicos para el Citatorio Obligatorio:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                        Fecha de la Cita:
                      </label>
                      <input
                        type="date"
                        value={citatorioDate}
                        onChange={e => setCitatorioDate(e.target.value)}
                        className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                        Hora de la Cita:
                      </label>
                      <input
                        type="text"
                        value={citatorioTime}
                        onChange={e => setCitatorioTime(e.target.value)}
                        placeholder="ej. 08:30 AM"
                        className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                        Lugar / Despacho:
                      </label>
                      <input
                        type="text"
                        value={citatorioLocation}
                        onChange={e => setCitatorioLocation(e.target.value)}
                        placeholder="ej. Dirección Escolar"
                        className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Message */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Título / Asunto Oficial:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="ej. Citatorio Oficial a Dirección por Asunto de Conducta..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Mensaje Institucional Detallado:
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Detalla las razones del citatorio o el reporte escolar..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
                  required
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requiresConfirmation}
                    onChange={e => setRequiresConfirmation(e.target.checked)}
                    className="w-4 h-4 text-[#0D6938] rounded-md focus:ring-[#0D6938]"
                  />
                  <span>Requerir Acuse de Asistencia / Confirmación Digital del Tutor</span>
                </label>

                <button
                  type="button"
                  onClick={() => soundEffects.playNoticeAlert()}
                  className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#D91A2A]" />
                  <span>Probar Timbre Sonoro</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0D6938] hover:bg-[#094d28] text-white text-sm font-black shadow-md transition active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Emitir y Enviar Notificación a Padres</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Col: Interactive Preview & Live Simulation Card */}
          <div className="space-y-4">
            {/* Live Document Preview Card */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-800">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="https://kabris.com.mx/moiseslogo.png"
                    alt="Logo Moisés Sáenz"
                    className="h-10 w-auto object-contain shrink-0"
                  />
                  <div>
                    <p className="text-[11px] font-black uppercase text-amber-300 leading-tight">Moisés Sáenz</p>
                    <p className="text-[10px] text-slate-400">Vista Previa de Notificación</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                  priority === 'Urgente' ? 'bg-[#D91A2A] text-white' : 'bg-amber-400 text-black'
                }`}>
                  {priority}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 block">
                  {docCategory}
                </span>
                <h4 className="font-black text-sm text-white leading-tight">
                  {title || 'Título del documento'}
                </h4>
                <p className="text-slate-300 font-medium text-[11px] line-clamp-3">
                  {message || 'Mensaje del documento...'}
                </p>

                {(docCategory === 'Citatorio' || docCategory === 'Citatorio Dirección') && (
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 mt-3 space-y-1">
                    <p className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {citatorioDate} a las {citatorioTime}
                    </p>
                    <p className="text-[10px] text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {citatorioLocation}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Destinatario:</span>
                  <span className="font-bold text-white">
                    {targetScope === 'masivo'
                      ? 'Toda la Escuela'
                      : targetScope === 'grade_group'
                      ? `${selectedGrade} ${selectedGroup}`
                      : currentSelectedStudent?.fullName || 'Alumno'}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Simulation Card for Client */}
            <div className="bg-amber-50 p-5 rounded-3xl border-2 border-amber-300 text-slate-900 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase mb-2">
                <Sparkles className="w-4 h-4 text-[#D91A2A]" />
                <span>Demostración en Vivo para Cliente</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed mb-3">
                ¿Deseas probar cómo suena el timbre y cómo se ve la <strong>ventana flotante de Citatorio</strong> en la pantalla del padre de familia?
              </p>
              <button
                type="button"
                onClick={() => simulateOfficialCitationAlert()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D91A2A] hover:bg-[#b81422] text-white text-xs font-black shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Simular Citatorio Flotante & Sonido</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: HISTORIAL DE COMUNICADOS Y ACUSES */}
      {subTab === 'history' && (
        <div className="space-y-4">
          {/* History Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-slate-500">Filtrar:</span>
              <button
                onClick={() => setHistoryCategoryFilter('todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  historyCategoryFilter === 'todos'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todos ({notices.length})
              </button>
              <button
                onClick={() => setHistoryCategoryFilter('citatorios')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  historyCategoryFilter === 'citatorios'
                    ? 'bg-[#D91A2A] text-white'
                    : 'bg-red-50 text-[#D91A2A] hover:bg-red-100'
                }`}
              >
                Citatorios ({notices.filter(n => n.category === 'Citatorio' || n.category === 'Citatorio Dirección').length})
              </button>
              <button
                onClick={() => setHistoryCategoryFilter('reportes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  historyCategoryFilter === 'reportes'
                    ? 'bg-[#0D6938] text-white'
                    : 'bg-emerald-50 text-[#0D6938] hover:bg-emerald-100'
                }`}
              >
                Reportes Disciplinarios ({notices.filter(n => n.category === 'Reporte Disciplinario' || n.category === 'Conducta').length})
              </button>
              <button
                onClick={() => setHistoryCategoryFilter('avisos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                  historyCategoryFilter === 'avisos'
                    ? 'bg-[#5B92C8] text-white'
                    : 'bg-sky-50 text-[#5B92C8] hover:bg-sky-100'
                }`}
              >
                Avisos Generales ({notices.filter(n => n.category === 'Aviso General').length})
              </button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por título, alumno o tutor..."
                value={historySearchTerm}
                onChange={e => setHistorySearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D91A2A]"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-black text-slate-700">No se encontraron comunicados con ese filtro</p>
                <p className="text-xs text-slate-400 mt-1">Intenta con otro término o emite un nuevo citatorio.</p>
              </div>
            ) : (
              filteredNotices.map(item => {
                const isCit = item.category === 'Citatorio' || item.category === 'Citatorio Dirección';
                const relatedStudent = students.find(s => s.id === item.studentId);

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isCit
                            ? 'bg-red-100 text-[#D91A2A] border border-red-200'
                            : item.category === 'Reporte Disciplinario'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-[#0D6938] border border-emerald-200'
                        }`}>
                          {item.category}
                        </span>

                        <span className="text-[11px] font-bold text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Title & Message */}
                      <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-1.5 line-clamp-2">
                        {item.message}
                      </p>

                      {/* Citation Date/Time if applicable */}
                      {isCit && item.citatorioDate && (
                        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs">
                          <span className="font-black text-[#D91A2A] flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" /> Cita: {item.citatorioDate} • {item.citatorioTime}
                          </span>
                          <span className="text-[11px] font-bold text-slate-600">
                            {item.citatorioLocation}
                          </span>
                        </div>
                      )}

                      {/* Recipient Details */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold">Alumno:</span>
                        <span className="font-black text-slate-900 truncate max-w-[200px]">
                          {item.studentName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-500 font-bold">Tutor:</span>
                        <span className="font-bold text-slate-800">{item.tutorName}</span>
                      </div>
                    </div>

                    {/* Footer Actions: Acuse de Recibo & Print */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        {item.isConfirmedByTutor ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acuse Confirmado
                          </span>
                        ) : item.requiresConfirmation ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /> Acuse Pendiente
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400">
                            Informativo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setPrintNotice(item);
                            setIsPrintModalOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition cursor-pointer"
                          title="Imprimir formato oficial en hoja membretada"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Formato Oficial</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: REPORTE CONSOLIDADO DE ACCESOS Y ESTADÍSTICAS */}
      {subTab === 'attendance' && (
        <div className="space-y-4">
          {/* Header & Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Historial Consolidado de Asistencia en Portón</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Bitácora de entradas registradas con QR y reportes de puntualidad.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D6938] hover:bg-[#094d28] text-white text-xs font-black shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-black text-slate-500">Ingresos Hoy</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{registeredCount}</p>
              <p className="text-[11px] font-bold text-slate-400">De {students.length} alumnos</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-black text-slate-500">Puntualidad</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{punctualityRate}%</p>
              <p className="text-[11px] font-bold text-emerald-700">{onTimeCount} a tiempo</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-black text-slate-500">Retardos</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{lateCount}</p>
              <p className="text-[11px] font-bold text-amber-700">Llegadas tarde</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-black text-slate-500">Capacidad Total</span>
              <p className="text-2xl font-black text-slate-900 mt-1">700</p>
              <p className="text-[11px] font-bold text-slate-400">Plazas en plantel</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3.5">Matrícula</th>
                    <th className="px-4 py-3.5">Alumno</th>
                    <th className="px-4 py-3.5">Grado / Grupo</th>
                    <th className="px-4 py-3.5">Hora</th>
                    <th className="px-4 py-3.5">Estatus</th>
                    <th className="px-4 py-3.5">Portón</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {accessRecords.slice(0, 10).map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-600">{rec.enrollmentId}</td>
                      <td className="px-4 py-3 font-black text-slate-900">{rec.studentName}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black">
                          {rec.grade} {rec.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">{rec.formattedTime}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          rec.status === 'on_time'
                            ? 'bg-emerald-50 text-[#0D6938] border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rec.status === 'on_time' ? 'A tiempo' : 'Retardo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{rec.gate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Citation Print Modal */}
      <OfficialCitationPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        notice={printNotice}
        student={students.find(s => s.id === printNotice?.studentId) || null}
      />
    </div>
  );
};
