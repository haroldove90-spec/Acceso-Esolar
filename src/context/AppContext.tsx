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
  parent: ['notifications', 'student_profile', 'announcements'],
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

    showToast(
      noticeTitle,
      `${student.fullName} (${student.grade} ${student.group}) - ${formattedTime}`,
      determinedStatus === 'late' ? 'warning' : 'success'
    );

    return { success: true, message: 'Acceso registrado correctamente.', record: newRecord };
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
