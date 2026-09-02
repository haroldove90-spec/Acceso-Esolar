export type RoleType = 'admin' | 'staff' | 'parent';

export type AttendanceStatus = 'on_time' | 'late' | 'absent' | 'early_exit' | 'present';

export type GateType = 'Portón Principal (Entrada General)' | 'Portón 2 (Primaria / Vehicular)' | 'Portón 3 (Peatonal / Secundaria)';

export interface Student {
  id: string;
  enrollmentId: string; // e.g., "ALU-2026-0142"
  fullName: string;
  grade: string; // "1°", "2°", "3°", "4°", "5°", "6°"
  group: string; // "A", "B", "C"
  shift: 'Matutino' | 'Vespertino';
  photoUrl: string;
  tutorName: string;
  tutorPhone: string;
  tutorEmail: string;
  status: 'Activo' | 'Inactivo';
  bloodType: string;
  emergencyContact: string;
  medicalNotes?: string;
  qrCodeValue: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  roleTitle: string; // "Docente de Grupo", "Prefecto de Acceso", "Coordinador"
  subjectOrArea: string; // "Matemáticas", "Control de Puerta", "Educación Física"
  assignedGate: GateType;
  phone: string;
  email: string;
  shift: 'Matutino' | 'Vespertino' | 'Completo';
  status: 'En Turno' | 'Fuera de Servicio' | 'Inactivo';
  photoUrl?: string;
}

export interface AccessRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  grade: string;
  group: string;
  type: 'Entrada' | 'Salida';
  timestamp: string; // ISO string
  formattedTime: string; // "07:48 AM"
  date: string; // "2026-09-01"
  status: AttendanceStatus;
  gate: string;
  registeredBy: string; // Staff member name
  notes?: string;
}

export interface DirectNotice {
  id: string;
  studentId: string;
  studentName: string;
  tutorName: string;
  senderStaffName: string;
  senderRole: string;
  category: 'Conducta' | 'Puntualidad' | 'Salud / Enfermería' | 'Tareas y Materiales' | 'Aviso General';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'Normal' | 'Importante' | 'Urgente';
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Circular Oficial' | 'Aviso General' | 'Urgente' | 'Evento Escolar';
  date: string;
  author: string;
  summary: string;
  content: string;
  attachmentName?: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Académico' | 'Reunión de Padres' | 'Suspensión' | 'Festividad';
  description: string;
}
