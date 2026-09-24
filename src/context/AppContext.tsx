import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoleType,
  Student,
  StaffMember,
  AccessRecord,
  DirectNotice,
  Announcement,
  SchoolEvent,
  AttendanceStatus,
  GateType
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_ACCESS_RECORDS,
  INITIAL_NOTICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS
} from '../mockData';
import { soundEffects } from '../utils/audioNotification';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  time: string;
}

interface AppContextType {
  // Role and Navigation
  currentRole: RoleType | null;
  setCurrentRole: (role: RoleType | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  logout: () => void;

  // Data Collections
  students: Student[];
  staff: StaffMember[];
  accessRecords: AccessRecord[];
  notices: DirectNotice[];
  announcements: Announcement[];
  events: SchoolEvent[];

  // Selected entities for detail/actions
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  parentSelectedStudentId: string;
  setParentSelectedStudentId: (id: string) => void;

  // Real-time Student Entrance Floating Notification Alert for Parent
  entranceAlert: { student: Student; accessRecord: AccessRecord } | null;
  setEntranceAlert: (alert: { student: Student; accessRecord: AccessRecord } | null) => void;
  simulateStudentEntrance: (studentId?: string, isLate?: boolean) => void;

  // Floating Official Notice / Citation Alert for Parent
  officialNoticeAlert: { notice: DirectNotice; student?: Student } | null;
  setOfficialNoticeAlert: (alert: { notice: DirectNotice; student?: Student } | null) => void;
  createAndSendOfficialNotice: (params: {
    category: DirectNotice['category'];
    title: string;
    message: string;
    priority: DirectNotice['priority'];
    targetScope: 'individual' | 'grade_group' | 'masivo';
    targetStudentId?: string;
    targetGrade?: string;
    targetGroup?: string;
    citatorioDate?: string;
    citatorioTime?: string;
    citatorioLocation?: string;
    requiresConfirmation?: boolean;
    senderStaffName?: string;
    senderRole?: string;
  }) => { success: boolean; count: number; notice?: DirectNotice };
  confirmNoticeReceipt: (noticeId: string) => void;
  simulateOfficialCitationAlert: (studentId?: string) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'qrCodeValue'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  toggleStudentStatus: (studentId: string) => void;
  addStaff: (staffMember: Omit<StaffMember, 'id'>) => void;
  updateStaff: (staffMember: StaffMember) => void;
  deleteStaff: (staffId: string) => void;
  toggleStaffStatus: (staffId: string) => void;
  registerAccess: (studentId: string, gate: GateType, status?: AttendanceStatus, type?: 'Entrada' | 'Salida', notes?: string) => { success: boolean; message: string; record?: AccessRecord };
  updateAccessStatus: (recordId: string, status: AttendanceStatus) => void;
  sendDirectNotice: (studentId: string, category: DirectNotice['category'], title: string, message: string, priority?: DirectNotice['priority']) => void;
  markNoticeAsRead: (noticeId: string) => void;
  
  // Toast notifications
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  
  // PWA Install helper
  showPWAInstallModal: boolean;
  setShowPWAInstallModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const VALID_TABS_BY_ROLE: Record<RoleType, string[]> = {
  admin: ['students', 'staff', 'reports'],
  staff: ['access', 'status', 'notices'],
  parent: ['notifications', 'reports_citatorios', 'access_history', 'student_profile', 'announcements'],
};

export const getDefaultTabForRole = (role: RoleType | null, currentTab?: string | null): string => {
  if (!role) return 'students';
  const validTabs = VALID_TABS_BY_ROLE[role] || ['students'];
  if (currentTab && validTabs.includes(currentTab)) {
    return currentTab;
  }
  return validTabs[0];
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<RoleType | null>(() => {
    try {
      const saved = localStorage.getItem('sa_current_role');
      if (saved === 'admin' || saved === 'staff' || saved === 'parent') {
        return saved as RoleType;
      }
    } catch (e) {
      console.error('Error reading saved role:', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const savedRole = (localStorage.getItem('sa_current_role') as RoleType) || null;
      const savedTab = localStorage.getItem('sa_active_tab');
      return getDefaultTabForRole(savedRole, savedTab);
    } catch (e) {
      console.error('Error reading saved active tab:', e);
      return 'students';
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load / Store Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('sa_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch (e) {
      return INITIAL_STUDENTS;
    }
  });

  // Load / Store Staff
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('sa_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch (e) {
      return INITIAL_STAFF;
    }
  });

  // Load / Store Access Records
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>(() => {
    try {
      const saved = localStorage.getItem('sa_access_records');
      return saved ? JSON.parse(saved) : INITIAL_ACCESS_RECORDS;
    } catch (e) {
      return INITIAL_ACCESS_RECORDS;
    }
  });

  // Load / Store Notices
  const [notices, setNotices] = useState<DirectNotice[]>(() => {
    try {
      const saved = localStorage.getItem('sa_notices');
      return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    } catch (e) {
      return INITIAL_NOTICES;
    }
  });

  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [events] = useState<SchoolEvent[]>(INITIAL_EVENTS);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [parentSelectedStudentId, setParentSelectedStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem('sa_parent_selected_student') || 'alu-001';
    } catch (e) {
      return 'alu-001';
    }
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);

  // Entrance floating modal alert for Parent role
  const [entranceAlert, setEntranceAlert] = useState<{ student: Student; accessRecord: AccessRecord } | null>(null);

  // Official Report / Citation floating modal alert for Parent role
  const [officialNoticeAlert, setOfficialNoticeAlert] = useState<{ notice: DirectNotice; student?: Student } | null>(null);

  // Cross-tab synchronization: notify Parent role when an entrance or official notice is recorded in another tab/window
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('school_access_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'STUDENT_ENTRANCE' && event.data?.record) {
            const studentId = event.data.studentId;
            const stu = students.find(s => s.id === studentId);
            if (stu && currentRole === 'parent') {
              soundEffects.playEntranceBeep();
              setEntranceAlert({ student: stu, accessRecord: event.data.record });
            }
          } else if (event.data?.type === 'OFFICIAL_NOTICE' && event.data?.notice) {
            const notice: DirectNotice = event.data.notice;
            const stu = students.find(s => s.id === notice.studentId);
            if (currentRole === 'parent') {
              if (notice.priority === 'Urgente') {
                soundEffects.playUrgentAlert();
              } else {
                soundEffects.playNoticeAlert();
              }
              setOfficialNoticeAlert({ notice, student: stu });
            }
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sa_last_entrance_event' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.studentId && parsed.record) {
            const stu = students.find(s => s.id === parsed.studentId);
            if (stu && currentRole === 'parent') {
              soundEffects.playEntranceBeep();
              setEntranceAlert({ student: stu, accessRecord: parsed.record });
            }
          }
        } catch (err) {}
      } else if (e.key === 'sa_last_official_notice' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.notice) {
            const stu = students.find(s => s.id === parsed.notice.studentId);
            if (currentRole === 'parent') {
              if (parsed.notice.priority === 'Urgente') {
                soundEffects.playUrgentAlert();
              } else {
                soundEffects.playNoticeAlert();
              }
              setOfficialNoticeAlert({ notice: parsed.notice, student: stu });
            }
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      try {
        channel?.close();
      } catch (e) {}
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [students, currentRole]);

  // Sync session and state to local storage
  useEffect(() => {
    try {
      if (currentRole) {
        localStorage.setItem('sa_current_role', currentRole);
      } else {
        localStorage.removeItem('sa_current_role');
      }
    } catch (e) {
      console.error('Error saving role:', e);
    }
  }, [currentRole]);

  useEffect(() => {
    try {
      if (activeTab) {
        localStorage.setItem('sa_active_tab', activeTab);
      }
    } catch (e) {
      console.error('Error saving active tab:', e);
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      if (parentSelectedStudentId) {
        localStorage.setItem('sa_parent_selected_student', parentSelectedStudentId);
      }
    } catch (e) {
      console.error('Error saving selected student ID:', e);
    }
  }, [parentSelectedStudentId]);

  useEffect(() => {
    try {
      localStorage.setItem('sa_students', JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('sa_staff', JSON.stringify(staff));
    } catch (e) {
      console.error('Error saving staff:', e);
    }
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem('sa_access_records', JSON.stringify(accessRecords));
    } catch (e) {
      console.error('Error saving access records:', e);
    }
  }, [accessRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('sa_notices', JSON.stringify(notices));
    } catch (e) {
      console.error('Error saving notices:', e);
    }
  }, [notices]);

  const setCurrentRole = (role: RoleType | null) => {
    setCurrentRoleState(role);
    const newTab = getDefaultTabForRole(role);
    setActiveTab(newTab);
    try {
      if (role) {
        localStorage.setItem('sa_current_role', role);
        localStorage.setItem('sa_active_tab', newTab);
      } else {
        localStorage.removeItem('sa_current_role');
        localStorage.removeItem('sa_active_tab');
      }
    } catch (e) {
      console.error('Error updating role in localStorage:', e);
    }
  };

  const logout = () => {
    setCurrentRoleState(null);
    setIsSidebarOpen(false);
    try {
      localStorage.removeItem('sa_current_role');
      localStorage.removeItem('sa_active_tab');
    } catch (e) {
      console.error('Error clearing session in localStorage:', e);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newToast: ToastNotification = {
      id: 'toast-' + Date.now() + '-' + Math.random(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      dismissToast(newToast.id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'qrCodeValue'>) => {
    const id = 'alu-' + (students.length + 1).toString().padStart(3, '0');
    const newStudent: Student = {
      ...studentData,
      id,
      qrCodeValue: `ESC-${studentData.enrollmentId}-${studentData.fullName.toUpperCase().replace(/\s+/g, '-')}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast('Alumno Registrado', `${newStudent.fullName} asignado a ${newStudent.grade} ${newStudent.group}`, 'success');
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast('Padrón Actualizado', `Datos de ${updatedStudent.fullName} guardados correctamente.`, 'info');
  };

  const deleteStudent = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    showToast('Alumno Eliminado', `${target?.fullName || 'El registro'} fue removido del padrón escolar.`, 'warning');
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const nextStatus = s.status === 'Activo' ? 'Inactivo' : 'Activo';
          showToast(
            nextStatus === 'Activo' ? 'Alumno Activado' : 'Alumno Desactivado',
            `${s.fullName} ahora está ${nextStatus}.`,
            nextStatus === 'Activo' ? 'success' : 'warning'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const addStaff = (staffData: Omit<StaffMember, 'id'>) => {
    const id = 'stf-' + (staff.length + 1).toString().padStart(3, '0');
    const newStaff: StaffMember = {
      ...staffData,
      id,
    };
    setStaff(prev => [newStaff, ...prev]);
    showToast('Personal Registrado', `${newStaff.fullName} asignado a ${newStaff.assignedGate}`, 'success');
  };

  const updateStaff = (updatedStaff: StaffMember) => {
    setStaff(prev => prev.map(s => (s.id === updatedStaff.id ? updatedStaff : s)));
    showToast('Personal Actualizado', `Responsabilidad de ${updatedStaff.fullName} actualizada.`, 'info');
  };

  const deleteStaff = (staffId: string) => {
    const target = staff.find(s => s.id === staffId);
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showToast('Personal Eliminado', `${target?.fullName || 'El personal'} fue removido del sistema.`, 'warning');
  };

  const toggleStaffStatus = (staffId: string) => {
    setStaff(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          const nextStatus = s.status === 'Inactivo' ? 'En Turno' : 'Inactivo';
          showToast(
            nextStatus === 'Inactivo' ? 'Personal Desactivado' : 'Personal Activado',
            `${s.fullName} ahora está ${nextStatus}.`,
            nextStatus === 'Inactivo' ? 'warning' : 'success'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const registerAccess = (
    studentId: string,
    gate: GateType,
    statusOverride?: AttendanceStatus,
    type: 'Entrada' | 'Salida' = 'Entrada',
    notes?: string
  ) => {
    const student = students.find(s => s.id === studentId || s.enrollmentId === studentId || s.qrCodeValue === studentId);
    if (!student) {
      return { success: false, message: 'Alumno no encontrado en el padrón escolar.' };
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Determine on_time or late automatically if not overridden:
    // Standard school entry: 07:00 AM - 07:50 AM on time; after 07:50 AM is late
    let determinedStatus: AttendanceStatus = statusOverride || 'on_time';
    if (!statusOverride) {
      if (type === 'Entrada') {
        if (hours > 7 || (hours === 7 && minutes > 50)) {
          determinedStatus = 'late';
        } else {
          determinedStatus = 'on_time';
        }
      } else {
        determinedStatus = 'present';
      }
    }

    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: AccessRecord = {
      id: 'acc-' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      enrollmentId: student.enrollmentId,
      grade: student.grade,
      group: student.group,
      type,
      timestamp: now.toISOString(),
      formattedTime,
      date: dateStr,
      status: determinedStatus,
      gate,
      registeredBy: 'Personal Operativo de Portón',
      notes,
    };

    setAccessRecords(prev => [newRecord, ...prev]);

    // Create automatic instantaneous notification to Parent
    const noticeTitle = type === 'Entrada'
      ? (determinedStatus === 'late' ? '⚠️ Entrada con Retardo Registrada' : '✅ Ingreso Escolar Confirmado')
      : '🚪 Salida Escolar Registrada';

    const noticeMsg = `${student.fullName} registró ${type.toLowerCase()} a las ${formattedTime} en ${gate} (${determinedStatus === 'late' ? 'Retardo' : 'A tiempo'}).`;

    const autoNotice: DirectNotice = {
      id: 'not-' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      tutorName: student.tutorName,
      senderStaffName: 'Control de Puerta & Accesos',
      senderRole: 'Personal de Portón',
      category: 'Puntualidad',
      title: noticeTitle,
      message: noticeMsg,
      timestamp: now.toISOString(),
      isRead: false,
      priority: determinedStatus === 'late' ? 'Importante' : 'Normal',
    };

    setNotices(prev => [autoNotice, ...prev]);

    // Handle real-time entrance event for Parent role:
    if (type === 'Entrada') {
      // If currently viewing as parent, play beep and pop up floating modal
      if (currentRole === 'parent') {
        soundEffects.playEntranceBeep();
        setEntranceAlert({ student, accessRecord: newRecord });
      }

      // Broadcast event to other tabs or windows
      try {
        if (typeof window !== 'undefined') {
          if ('BroadcastChannel' in window) {
            const bc = new BroadcastChannel('school_access_channel');
            bc.postMessage({
              type: 'STUDENT_ENTRANCE',
              studentId: student.id,
              record: newRecord,
            });
            bc.close();
          }
          localStorage.setItem(
            'sa_last_entrance_event',
            JSON.stringify({ studentId: student.id, record: newRecord, time: Date.now() })
          );
        }
      } catch (e) {
        console.warn('Cross-tab broadcast error:', e);
      }
    }

    showToast(
      noticeTitle,
      `${student.fullName} (${student.grade} ${student.group}) - ${formattedTime}`,
      determinedStatus === 'late' ? 'warning' : 'success'
    );

    return { success: true, message: 'Acceso registrado correctamente.', record: newRecord };
  };

  const simulateStudentEntrance = (studentId?: string, isLate: boolean = false) => {
    const targetStudentId = studentId || parentSelectedStudentId || students[0]?.id;
    const student = students.find(s => s.id === targetStudentId) || students[0];
    if (!student) return;

    if (student.id !== parentSelectedStudentId) {
      setParentSelectedStudentId(student.id);
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const determinedStatus: AttendanceStatus = isLate ? 'late' : 'on_time';
    const gate: GateType = 'Portón Principal (Entrada General)';

    const newRecord: AccessRecord = {
      id: 'acc-' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      enrollmentId: student.enrollmentId,
      grade: student.grade,
      group: student.group,
      type: 'Entrada',
      timestamp: now.toISOString(),
      formattedTime,
      date: dateStr,
      status: determinedStatus,
      gate,
      registeredBy: 'Lector Óptico QR • Puerta Principal',
      notes: 'Ingreso verificado por credencial QR digital (Simulación para Cliente).',
    };

    setAccessRecords(prev => [newRecord, ...prev]);

    const noticeTitle = determinedStatus === 'late'
      ? '⚠️ Entrada con Retardo Registrada'
      : '✅ Ingreso Escolar Confirmado';

    const noticeMsg = `${student.fullName} ingresó al plantel a las ${formattedTime} por el ${gate} (${determinedStatus === 'late' ? 'Retardo' : 'A tiempo'}).`;

    const autoNotice: DirectNotice = {
      id: 'not-' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      tutorName: student.tutorName,
      senderStaffName: 'Control de Puerta & Accesos',
      senderRole: 'Lector QR Automatizado',
      category: 'Puntualidad',
      title: noticeTitle,
      message: noticeMsg,
      timestamp: now.toISOString(),
      isRead: false,
      priority: determinedStatus === 'late' ? 'Importante' : 'Normal',
    };

    setNotices(prev => [autoNotice, ...prev]);

    // Play instant BEEP sound!
    soundEffects.playEntranceBeep();

    // Trigger floating modal window for parent!
    setEntranceAlert({ student, accessRecord: newRecord });

    showToast(
      noticeTitle,
      `${student.fullName} • ${formattedTime} (${gate})`,
      determinedStatus === 'late' ? 'warning' : 'success'
    );
  };

  const updateAccessStatus = (recordId: string, newStatus: AttendanceStatus) => {
    setAccessRecords(prev =>
      prev.map(r => (r.id === recordId ? { ...r, status: newStatus } : r))
    );
    showToast('Estatus Modificado', 'Puntualidad actualizada en tiempo real.', 'info');
  };

  const sendDirectNotice = (
    studentId: string,
    category: DirectNotice['category'],
    title: string,
    message: string,
    priority: DirectNotice['priority'] = 'Normal'
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newNotice: DirectNotice = {
      id: 'not-' + Date.now(),
      studentId: student.id,
      studentName: student.fullName,
      tutorName: student.tutorName,
      senderStaffName: 'Mtra. Elena Bustamante Ramos',
      senderRole: 'Docente Titular',
      category,
      title,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority,
    };

    setNotices(prev => [newNotice, ...prev]);
    showToast('Aviso Enviado', `Notificación enviada a ${student.tutorName}`, 'success');
  };

  const markNoticeAsRead = (noticeId: string) => {
    setNotices(prev =>
      prev.map(n => (n.id === noticeId ? { ...n, isRead: true } : n))
    );
  };

  const createAndSendOfficialNotice = (params: {
    category: DirectNotice['category'];
    title: string;
    message: string;
    priority: DirectNotice['priority'];
    targetScope: 'individual' | 'grade_group' | 'masivo';
    targetStudentId?: string;
    targetGrade?: string;
    targetGroup?: string;
    citatorioDate?: string;
    citatorioTime?: string;
    citatorioLocation?: string;
    requiresConfirmation?: boolean;
    senderStaffName?: string;
    senderRole?: string;
  }) => {
    let targetStudents: Student[] = [];

    if (params.targetScope === 'individual') {
      const stu = students.find(s => s.id === params.targetStudentId);
      if (stu) targetStudents = [stu];
    } else if (params.targetScope === 'grade_group') {
      targetStudents = students.filter(
        s =>
          (!params.targetGrade || s.grade === params.targetGrade) &&
          (!params.targetGroup || s.group === params.targetGroup)
      );
    } else {
      // Masivo (toda la escuela)
      targetStudents = [...students];
    }

    if (targetStudents.length === 0) {
      showToast('Error de Destinatario', 'No se encontraron alumnos para los criterios seleccionados.', 'warning');
      return { success: false, count: 0 };
    }

    const nowIso = new Date().toISOString();
    const newNotices: DirectNotice[] = targetStudents.map((stu, idx) => ({
      id: `not-${Date.now()}-${idx}`,
      studentId: stu.id,
      studentName: stu.fullName,
      tutorName: stu.tutorName,
      senderStaffName: params.senderStaffName || 'Dra. Carmen Estrada Montes',
      senderRole: params.senderRole || 'Dirección Escolar',
      category: params.category,
      title: params.title,
      message: params.message,
      timestamp: nowIso,
      isRead: false,
      priority: params.priority,
      citatorioDate: params.citatorioDate,
      citatorioTime: params.citatorioTime,
      citatorioLocation: params.citatorioLocation,
      requiresConfirmation: params.requiresConfirmation ?? (params.category === 'Citatorio' || params.category === 'Citatorio Dirección'),
      isConfirmedByTutor: false,
      targetScope: params.targetScope,
      targetGrade: params.targetGrade,
      targetGroup: params.targetGroup,
    }));

    setNotices(prev => [...newNotices, ...prev]);

    // Audio chime notification
    if (params.priority === 'Urgente') {
      soundEffects.playUrgentAlert();
    } else {
      soundEffects.playNoticeAlert();
    }

    // Set floating alert for the first notice so current session/parent immediately sees the popup
    const firstNotice = newNotices[0];
    const firstStudent = targetStudents[0];
    setOfficialNoticeAlert({ notice: firstNotice, student: firstStudent });

    // Broadcast across windows/tabs
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'sa_last_official_notice',
          JSON.stringify({ notice: firstNotice, timestamp: Date.now() })
        );
        if ('BroadcastChannel' in window) {
          const ch = new BroadcastChannel('school_access_channel');
          ch.postMessage({ type: 'OFFICIAL_NOTICE', notice: firstNotice });
          ch.close();
        }
      }
    } catch (e) {
      console.warn('Error broadcasting notice:', e);
    }

    const scopeLabel =
      params.targetScope === 'masivo'
        ? `Toda la Escuela (${targetStudents.length} tutores)`
        : params.targetScope === 'grade_group'
        ? `${params.targetGrade} ${params.targetGroup} (${targetStudents.length} alumnos)`
        : targetStudents[0].fullName;

    showToast(
      'Documento Emitido con Éxito',
      `${params.category} enviado a: ${scopeLabel}. Notificación sonora y ventana flotante activadas.`,
      'success'
    );

    return { success: true, count: targetStudents.length, notice: firstNotice };
  };

  const confirmNoticeReceipt = (noticeId: string) => {
    const nowIso = new Date().toISOString();
    setNotices(prev =>
      prev.map(n =>
        n.id === noticeId
          ? { ...n, isConfirmedByTutor: true, confirmedAt: nowIso, isRead: true }
          : n
      )
    );
    showToast('Acuse Registrado', 'Has confirmado la recepción y asistencia del documento oficial.', 'success');
  };

  const simulateOfficialCitationAlert = (studentId?: string) => {
    const stu = students.find(s => s.id === (studentId || parentSelectedStudentId)) || students[0];
    const demoNotice: DirectNotice = {
      id: `demo-cit-${Date.now()}`,
      studentId: stu.id,
      studentName: stu.fullName,
      tutorName: stu.tutorName,
      senderStaffName: 'Dra. Carmen Estrada Montes',
      senderRole: 'Dirección Escolar',
      category: 'Citatorio',
      title: '🚨 CITATORIO URGENTE: Asunto Administrativo en Dirección',
      message: 'Estimado Tutor: Se solicita su presencia formal e indispensable el día de mañana para atender asuntos relativos al expediente y desempeño escolar del alumno.',
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'Urgente',
      citatorioDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      citatorioTime: '08:30 AM',
      citatorioLocation: 'Dirección Escolar (Planta Alta)',
      requiresConfirmation: true,
      isConfirmedByTutor: false,
      targetScope: 'individual',
    };

    setNotices(prev => [demoNotice, ...prev]);
    soundEffects.playUrgentAlert();
    setOfficialNoticeAlert({ notice: demoNotice, student: stu });
    showToast('Alerta Flotante Activada', `Citatorio simulado para ${stu.fullName}`, 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        logout,
        students,
        staff,
        accessRecords,
        notices,
        announcements,
        events,
        selectedStudent,
        setSelectedStudent,
        parentSelectedStudentId,
        setParentSelectedStudentId,
        entranceAlert,
        setEntranceAlert,
        simulateStudentEntrance,
        officialNoticeAlert,
        setOfficialNoticeAlert,
        createAndSendOfficialNotice,
        confirmNoticeReceipt,
        simulateOfficialCitationAlert,
        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffStatus,
        registerAccess,
        updateAccessStatus,
        sendDirectNotice,
        markNoticeAsRead,
        toasts,
        dismissToast,
        showToast,
        showPWAInstallModal,
        setShowPWAInstallModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
