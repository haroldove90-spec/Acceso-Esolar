import { RoleType } from '../types';

export interface GradeOption {
  value: string;
  label: string;
}

export const SECONDARY_GRADES: GradeOption[] = [
  { value: '1°', label: '1° de Secundaria' },
  { value: '2°', label: '2° de Secundaria' },
  { value: '3°', label: '3° de Secundaria' },
];

export const SECONDARY_GROUPS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
] as const;

export type SecondaryGroup = typeof SECONDARY_GROUPS[number];

export interface DemoCredential {
  role: RoleType;
  title: string;
  badge: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
  textColorClass: string;
  btnClass: string;
  emailOrUser: string;
  password: string;
  subtitle: string;
  description: string;
  permissions: string[];
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: 'admin',
    title: 'Dirección Escolar / Administrador',
    badge: 'Control Total',
    badgeClass: 'bg-red-100 text-[#D91A2A] border-red-300',
    borderClass: 'border-red-200 hover:border-[#D91A2A]',
    bgLightClass: 'bg-red-50/50',
    textColorClass: 'text-[#D91A2A]',
    btnClass: 'bg-[#D91A2A] hover:bg-[#b91222] text-white',
    emailOrUser: 'admin@moises.edu.mx',
    password: 'admin123',
    subtitle: 'Dirección y Control Escolar',
    description: 'Alta de alumnos (Secundaria), gestión de 12 grupos (A-L), emisión de citatorios y reportes oficiales.',
    permissions: ['Alta y edición de alumnos (Secundaria)', 'Gestión de 12 grupos (A a la L)', 'Emisión de citatorios y reportes masivos', 'Control de personal docente']
  },
  {
    role: 'staff',
    title: 'Docente / Control de Puerta',
    badge: 'Lector Óptico QR',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    borderClass: 'border-amber-200 hover:border-[#D97706]',
    bgLightClass: 'bg-amber-50/50',
    textColorClass: 'text-[#D97706]',
    btnClass: 'bg-[#D97706] hover:bg-[#b45309] text-white',
    emailOrUser: 'docente@moises.edu.mx',
    password: 'docente123',
    subtitle: 'Prefectura & Escaneo de Portón',
    description: 'Lector óptico con cámara activa, registro de entradas/salidas en tiempo real y pase de lista.',
    permissions: ['Escaneo de credencial QR en portones', 'Registro de puntualidad y retardos', 'Emisión de avisos inmediatos al tutor', 'Monitoreo de aforo escolar']
  },
  {
    role: 'parent',
    title: 'Padre de Familia / Tutor',
    badge: 'Portal Familiar',
    badgeClass: 'bg-emerald-100 text-[#0D6938] border-emerald-300',
    borderClass: 'border-emerald-200 hover:border-[#0D6938]',
    bgLightClass: 'bg-emerald-50/50',
    textColorClass: 'text-[#0D6938]',
    btnClass: 'bg-[#0D6938] hover:bg-[#094d28] text-white',
    emailOrUser: 'padre@moises.edu.mx',
    password: 'tutor123',
    subtitle: 'Tutores & Familia de Secundaria',
    description: 'Recepción de citatorios oficiales, alertas flotantes con timbre sonoro y credencial digital del alumno.',
    permissions: ['Notificación flotante al ingresar al plantel', 'Visualización de citatorios y acuses de recibo', 'Descarga de credencial QR oficial', 'Comunicaciones directas con prefectura']
  }
];
