import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  ShieldCheck,
  UserCheck,
  Users,
  Camera,
  QrCode,
  Bell,
  Clock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Smartphone,
  ChevronRight,
  School,
  Eye,
  Send,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';

interface UserManualModuleProps {
  initialRole?: RoleType;
}

export const UserManualModule: React.FC<UserManualModuleProps> = ({ initialRole }) => {
  const { currentRole } = useApp();
  const [selectedView, setSelectedView] = useState<'current' | 'all' | 'admin' | 'staff' | 'parent'>('current');

  const activeRoleForView: RoleType =
    selectedView === 'current'
      ? (currentRole || initialRole || 'admin')
      : selectedView === 'all'
      ? 'admin'
      : (selectedView as RoleType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Hidden on print) */}
      <div className="no-print bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#D91A2A] shrink-0 shadow-xs">
            <BookOpen className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#D91A2A]">
                Guía Oficial Paso a Paso
              </span>
              <span className="bg-slate-100 text-slate-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-slate-200">
                Fácil & Práctico
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Manual del Usuario del Sistema
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Instrucciones claras y sencillas para utilizar el sistema de acceso escolar y notificaciones QR.
            </p>
          </div>
        </div>

        {/* Action: Print / PDF Download */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D91A2A] hover:bg-[#b01422] text-white font-black text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
            title="Descargar este manual en formato PDF o mandarlo a imprimir"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Descargar Manual en PDF</span>
          </button>
        </div>
      </div>

      {/* Role Selector Tabs (Hidden on print) */}
      <div className="no-print bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setSelectedView('current')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            selectedView === 'current'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Mi Rol Actual ({currentRole === 'admin' ? 'Dirección' : currentRole === 'staff' ? 'Docente / Puerta' : 'Padre de Familia'})</span>
        </button>

        <button
          onClick={() => setSelectedView('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            selectedView === 'admin'
              ? 'bg-[#D91A2A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Manual de Dirección</span>
        </button>

        <button
          onClick={() => setSelectedView('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            selectedView === 'staff'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Manual de Docente / Puerta</span>
        </button>

        <button
          onClick={() => setSelectedView('parent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            selectedView === 'parent'
              ? 'bg-[#0D6938] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manual de Padres de Familia</span>
        </button>

        <button
          onClick={() => setSelectedView('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition cursor-pointer ${
            selectedView === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manual Completo Institucional</span>
        </button>
      </div>

      {/* Main Printable Document Area */}
      <div
        id="printable-user-manual"
        className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8"
      >
        {/* Document Official Header with School Logo (Visible in both screen and print) */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src="https://kabris.com.mx/moiseslogo.png"
              alt="Esc. Sec. Gral. No. 1 Moisés Sáenz"
              className="h-16 sm:h-20 w-auto object-contain shrink-0"
              loading="eager"
            />
            <div>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#D91A2A] block">
                SISTEMA INSTITUCIONAL DE CONTROL ESCOLAR Y SEGURIDAD
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                MANUAL DEL USUARIO
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mt-0.5">
                Esc. Sec. Gral. No. 1 Moisés Sáenz • C.C.T. 30DES0040L • Coatzacoalcos, Ver.
              </p>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-mono font-black text-xs rounded-full border border-emerald-300">
              GUÍA RÁPIDA 2026
            </span>
            <p className="text-xs text-slate-500 font-bold mt-1">Nivel: Secundaria</p>
            <p className="text-xs text-slate-400 font-medium">Ciclo Escolar Vigente</p>
          </div>
        </div>

        {/* Quick Summary Box */}
        <div className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-2xl space-y-1.5">
          <h3 className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> ¿Cómo funciona este sistema de forma sencilla?
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Este programa permite controlar la entrada y salida de los alumnos de secundaria mediante su credencial con código QR.
            Al registrarse el acceso en el portón, el padre de familia recibe de inmediato en su celular un <strong>aviso visual</strong> con la hora exacta y un <strong>sonido de confirmación (Beep)</strong>, garantizando que el tutor sepa que su hijo está dentro del plantel de forma segura.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: ROL DIRECCIÓN ESCOLAR                                            */}
        {/* ========================================================================= */}
        {(selectedView === 'all' || selectedView === 'admin' || (selectedView === 'current' && activeRoleForView === 'admin')) && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-red-500">
              <div className="w-9 h-9 rounded-xl bg-[#D91A2A] text-white flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  1. Guía para Dirección Escolar y Control Administrativo
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Administración del padrón de alumnos, docentes y emisión de citatorios oficiales.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Paso 1: Padrón de Alumnos */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D91A2A] text-white text-xs flex items-center justify-center">1</span>
                  <span>Padrón de Alumnos y Credenciales</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Ver Alumnos:</strong> Entra a la pestaña <em>Padrón de Alumnos</em> para consultar a los estudiantes por grado (1°, 2°, 3°) y grupo (del A al L).</li>
                  <li><strong>Dar de Alta a un Alumno:</strong> Pulsa el botón azul <strong>«Alta de Alumno»</strong>, escribe su nombre, matrícula, grado, grupo y datos del tutor.</li>
                  <li><strong>Subir Fotografía:</strong> Selecciona una foto oficial del alumno o toma una con la cámara.</li>
                  <li><strong>Credencial QR:</strong> Al darlo de alta, el sistema crea automáticamente su credencial con código QR para que pueda ingresar por los portones.</li>
                </ul>
              </div>

              {/* Paso 2: Personal y Portones */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D91A2A] text-white text-xs flex items-center justify-center">2</span>
                  <span>Personal Escolar & Portones</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Asignar Portones:</strong> En la pestaña <em>Personal & Portones</em>, registra a los docentes y prefectos.</li>
                  <li><strong>Puertas Oficiales:</strong> Asigna a cada uno su estación: <em>Portón Principal</em>, <em>Portón 2 (Vehicular)</em> o <em>Portón 3 (Peatonal)</em>.</li>
                  <li><strong>Seguridad:</strong> Solo el personal autorizado puede realizar lecturas de credenciales en las puertas escolares.</li>
                </ul>
              </div>

              {/* Paso 3: Citatorios y Avisos */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D91A2A] text-white text-xs flex items-center justify-center">3</span>
                  <span>Emisión de Citatorios y Reportes</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Citar a un Tutor:</strong> En la pestaña <em>Reportes, Citatorios & Avisos</em>, elige el alumno, la fecha, hora y motivo de la cita.</li>
                  <li><strong>Acuse de Recibo en Tiempo Real:</strong> El padre recibirá el citatorio en su teléfono y podrá presionar «Confirmar de Enterado», lo que registrará su acuse digital en Dirección.</li>
                  <li><strong>Formato Oficial:</strong> Puedes imprimir el formato en papel membretado en cualquier momento.</li>
                </ul>
              </div>

              {/* Paso 4: Estadísticas */}
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#D91A2A] text-white text-xs flex items-center justify-center">4</span>
                  <span>Estadísticas y Reportes de Asistencia</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li><strong>Módulo de Métricas:</strong> En la subpestaña <em>Reporte Consolidado de Asistencia</em> verás el total de alumnos puntuales, retardos e inasistencias.</li>
                  <li><strong>Exportación:</strong> Descarga la bitácora en formato <strong>CSV para Excel</strong> o manda a imprimir el reporte diario.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: ROL DOCENTE / PERSONAL DE PUERTA                                 */}
        {/* ========================================================================= */}
        {(selectedView === 'all' || selectedView === 'staff' || (selectedView === 'current' && activeRoleForView === 'staff')) && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-600">
              <div className="w-9 h-9 rounded-xl bg-[#0D6938] text-white flex items-center justify-center font-black">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  2. Guía para Docentes y Personal de Puerta (Lector QR)
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Operación del escáner en portón, lectura óptica de credenciales y avisos rápidos.
                </p>
              </div>
            </div>

            {/* Note about camera on demand */}
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3">
              <Camera className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-emerald-950">
                  Control Total de la Cámara: La Cámara NO se activa sola
                </h4>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  Por seguridad y ahorro de batería, la cámara permanece apagada cuando entras al sistema.
                  Para comenzar a leer códigos QR, solo pulsa el botón verde <strong>«Activar Cámara para Leer QR»</strong>.
                  Cuando no haya alumnos entrando o salgas a receso, puedes pulsar <strong>«Desactivar Cámara»</strong> en cualquier momento.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Paso 1 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#0D6938] text-white text-xs flex items-center justify-center">1</span>
                  <span>Activar la Cámara</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Al llegar al portón asignado, abre el módulo <strong>Control de Acceso</strong> y presiona el botón verde <strong>«Activar Cámara»</strong>. Permite el acceso a la cámara si el navegador lo solicita.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#0D6938] text-white text-xs flex items-center justify-center">2</span>
                  <span>Escanear la Credencial</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pide al estudiante que acerque el código QR de su credencial al visor. En menos de un segundo el sistema sonará con un timbre, mostrará su foto y registrará la entrada.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <span className="w-6 h-6 rounded-full bg-[#0D6938] text-white text-xs flex items-center justify-center">3</span>
                  <span>Si Olvidó su Credencial</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No detengas la fila: en el buscador rápido escribe su apellido o matrícula (ej. <em>ALU-2026-001</em>) y pulsa <strong>«Registrar»</strong>. El acceso y la notificación al padre se enviarán igual de rápido.
                </p>
              </div>
            </div>

            {/* Other staff features */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Otras funciones del personal:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Estatus en Tiempo Real:</strong> Revisa quién ha entrado hoy y modifica si fue "A tiempo" o "Retardo".</span>
                </div>
                <div className="flex items-start gap-2">
                  <Send className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Avisos Directos:</strong> Envía comunicados directos al tutor sobre tareas, uniforme o temas de salud escolar.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: ROL PADRE DE FAMILIA                                             */}
        {/* ========================================================================= */}
        {(selectedView === 'all' || selectedView === 'parent' || (selectedView === 'current' && activeRoleForView === 'parent')) && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-600">
              <div className="w-9 h-9 rounded-xl bg-[#0D6938] text-white flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  3. Guía para Padres de Familia y Tutores
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Cómo saber cuándo llega su hijo a la escuela, consultar asistencia y responder citatorios.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Notificación de entrada */}
              <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                  <span>Aviso Inmediato al Entrar (Sonido Beep)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  En el segundo en que tu hijo muestra su credencial en el portón:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Tu teléfono emitirá un sonido <strong>«Beep»</strong> claro y audible.</li>
                  <li>Aparecerá en pantalla una ventana flotante con la foto de tu hijo, la hora exacta (ej. <em>07:18 AM</em>) y el portón por el que ingresó.</li>
                </ul>
              </div>

              {/* Registro histórico */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Registro de Accesos Histórico</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  En la pestaña <strong>«Registro de Accesos»</strong> puedes consultar el historial de días anteriores:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Historial de entradas y salidas ordenadas por fecha.</li>
                  <li>Si la entrada fue a tiempo o retardo.</li>
                  <li>Botón para <strong>Imprimir Historial</strong> si necesitas un comprobante para el trabajo.</li>
                </ul>
              </div>

              {/* Citatorios oficiales */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <FileText className="w-5 h-5 text-[#D91A2A]" />
                  <span>Citatorios y Acuse de Recibo</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Si un docente o la Dirección escolar te envía un citatorio:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Verás la cita destacada en color rojo con el día y hora indicada.</li>
                  <li>Pulsa el botón verde <strong>«Confirmar de Enterado»</strong> para enviar tu confirmación digital a la escuela sin tener que firmar en papel.</li>
                </ul>
              </div>

              {/* Credencial digital */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                  <QrCode className="w-5 h-5 text-[#0D6938]" />
                  <span>Credencial QR & WhatsApp</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  En la pestaña <strong>«Credencial QR»</strong>:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Consulta la credencial oficial de tu hijo con fotografía y matrícula.</li>
                  <li>Puedes enviársela directamente a su celular por <strong>WhatsApp</strong> para que la muestre en el portón si olvidó la tarjeta plástica.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Help & FAQ Footer */}
        <div className="border-t-2 border-slate-200 pt-6 space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" /> Preguntas Frecuentes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-black text-slate-900">¿Qué pasa si la cámara no enfoca bien el QR?</p>
              <p className="text-slate-600 mt-1">Coloca la credencial a unos 15 cm de la cámara en un lugar bien iluminado. Si hay poca luz, puedes encender la linterna con el botón correspondiente.</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-black text-slate-900">¿El sistema funciona sin internet?</p>
              <p className="text-slate-600 mt-1">Sí, el sistema está programado como PWA y puede seguir operando en los portones aun cuando haya intermitencias en la red del plantel.</p>
            </div>
          </div>
        </div>

        {/* Official Sign-off Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-semibold">
          <span>Esc. Sec. Gral. No. 1 Moisés Sáenz • C.C.T. 30DES0040L</span>
          <span>Coatzacoalcos, Veracruz • Ciclo Escolar 2025-2026</span>
        </div>
      </div>
    </div>
  );
};
