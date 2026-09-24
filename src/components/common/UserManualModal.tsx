import React from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  QrCode,
  Bell,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DoorClosed,
  School,
  Users,
  Smartphone,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-tight">Manual del Usuario en PDF</h2>
              <p className="text-xs text-slate-300">Guía de Operación: Acceso QR y Notificaciones al Tutor</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black shadow transition active:scale-95 cursor-pointer"
              title="Descargar o Guardar como PDF usando el cuadro de impresión"
            >
              <Printer className="w-4 h-4" />
              <span>Guardar como PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Cerrar manual"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Printable Manual Content */}
        <div
          id="printable-user-manual"
          className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-800 bg-white"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-black shadow-md shrink-0">
                <School className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-700 block">
                  SISTEMA OFICIAL DE CONTROL ESCOLAR Y SEGURIDAD
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  MANUAL DE USUARIO
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-bold">
                  Operación de Acceso Escolar mediante Código QR y Notificaciones en Tiempo Real al Tutor
                </p>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 font-mono font-black text-xs rounded-full border border-emerald-300">
                VERSIÓN 2.4 - PRODUCCIÓN
              </span>
              <p className="text-xs text-slate-500 font-bold mt-1">Capacidad: 700 Alumnos Activos</p>
              <p className="text-xs text-slate-400 font-medium">Ciclo Escolar Vigente</p>
            </div>
          </div>

          {/* Quick Overview Summary Banner */}
          <div className="bg-blue-50/70 border border-blue-200 p-5 rounded-2xl space-y-2">
            <h2 className="text-sm font-black text-blue-900 uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" /> Resumen Ejecutivo
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Este manual describe detalladamente el procedimiento estandarizado para registrar la entrada del alumno al plantel educativo mediante su credencial oficial con código QR y la recepción automática de la notificación acústica (sonido <strong>Beep</strong>) y visual (<strong>ventana flotante interactiva</strong>) en el dispositivo del padre de familia o tutor.
            </p>
          </div>

          {/* SECTION 1: CÓMO FUNCIONA EL ACCESO DEL ALUMNO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-black text-sm flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Cómo Funciona el Acceso del Alumno con Código QR
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              El proceso de acceso está diseñado para ser ultra rápido (menos de 1 segundo por estudiante), eliminando filas en la entrada y garantizando la plena verificación de identidad del alumno.
            </p>

            {/* Step-by-Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                  Paso 1
                </div>
                <h3 className="text-sm font-black text-slate-900">Portación de Credencial QR</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El alumno porta su credencial física o digital en el móvil con su código QR único institucional encriptado con su matrícula (ej. <code className="font-mono bg-white px-1 border rounded">ESC-2026-001</code>).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                  Paso 2
                </div>
                <h3 className="text-sm font-black text-slate-900">Lectura Óptica en Portón</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Al llegar al portón asignado (Portón Principal, Secundario o Vehicular), el estudiante acerca su código QR a la cámara del docente o escáner óptico de puerta.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xs">
                  Paso 3
                </div>
                <h3 className="text-sm font-black text-slate-900">Validación y Registro Inmediato</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El sistema valida la matrícula, fotografía y horario oficial (07:00 a 07:50 AM = <strong>Puntual</strong>; posterior = <strong>Retardo</strong>) y sella la hora en el registro escolar.
                </p>
              </div>
            </div>

            {/* Verification Detail Box */}
            <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-300/80 text-xs space-y-1.5">
              <span className="font-black text-slate-900 block">
                Regla de Contingencia sin Credencial:
              </span>
              <p className="text-slate-700">
                Si el alumno olvidó o extravió su credencial, el docente en puerta puede digitar rápidamente su nombre o matrícula en el buscador inteligente del módulo de acceso; el registro de entrada y la notificación al padre se emitirán con exactamente la misma validez y rapidez.
              </p>
            </div>
          </div>

          {/* SECTION 2: CÓMO RECIBE LA NOTIFICACIÓN EL PADRE DE FAMILIA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                2
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Cómo Recibe la Notificación el Padre de Familia
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              En la fracción de segundo en que el código QR es decodificado en la puerta de la escuela, el sistema sincroniza el evento de manera inalámbrica hacia la sesión del tutor, activando tres mecanismos de aviso simultáneos:
            </p>

            {/* Notification Mechanisms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                  <span>A. Sonido Acústico Oficial «Beep»</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  El dispositivo del padre emite un <strong>tono doble harmónico claro y perceptible</strong> sintetizado con Web Audio API, alertando auditivamente al tutor incluso si no está mirando la pantalla en ese momento.
                </p>
                <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100/80 p-2 rounded-xl border border-emerald-300">
                  Frecuencias acústicas: 880 Hz (A5) &rarr; 1,318 Hz (E6). Cero consumo de datos de audio.
                </div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-blue-400 bg-blue-50/40 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-900 font-black text-sm">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span>B. Ventana Flotante Emergente (Modal)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Aparece una <strong>tarjeta flotante superpuesta</strong> de alta prioridad con los datos completos del ingreso, foto del alumno y botón de acuse de recibo para confirmar que está enterado.
                </p>
                <div className="text-[11px] font-mono text-blue-800 bg-blue-100/80 p-2 rounded-xl border border-blue-300">
                  Incluye botón directo para reenviar o compartir a WhatsApp del tutor o familiares.
                </div>
              </div>
            </div>

            {/* Data Table of Notification Content */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="bg-slate-900 text-white font-black px-4 py-2.5 uppercase tracking-wide">
                Datos Incluidos en la Ventana Flotante del Tutor
              </div>
              <div className="divide-y divide-slate-200 bg-white">
                <div className="grid grid-cols-3 p-3 font-medium">
                  <span className="font-black text-slate-900 col-span-1">Fotografía del Alumno</span>
                  <span className="text-slate-600 col-span-2">Imagen oficial cargada en el padrón escolar con distintivo de validación biométrica.</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-medium">
                  <span className="font-black text-slate-900 col-span-1">Hora Exacta de Entrada</span>
                  <span className="text-slate-600 col-span-2">Timestamp oficial del sistema en formato de 12 horas (ejemplo: <strong>07:48 AM</strong>).</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-medium">
                  <span className="font-black text-slate-900 col-span-1">Portón de Acceso</span>
                  <span className="text-slate-600 col-span-2">Ubicación física específica de ingreso (ej. <em>Portón Principal - Entrada General</em>).</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-medium">
                  <span className="font-black text-slate-900 col-span-1">Estatus de Asistencia</span>
                  <span className="text-slate-600 col-span-2">Indicador visual: <strong>Puntual</strong> (Verde) o <strong>Retardo</strong> (Ámbar con motivo preventivo).</span>
                </div>
                <div className="grid grid-cols-3 p-3 font-medium">
                  <span className="font-black text-slate-900 col-span-1">Garantía de Resguardo</span>
                  <span className="text-slate-600 col-span-2">Leyenda oficial: <em>"El alumno se encuentra dentro de las instalaciones escolares"</em>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: CREAR CÓDIGO QR Y ENVIARLO POR WHATSAPP AL ALUMNO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-[#0D6938] text-white font-black text-sm flex items-center justify-center">
                3
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Guía Paso a Paso: Cómo Crear el Código QR y Enviarlo por WhatsApp a su Hijo
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              El padre de familia o tutor tiene la facultad de generar la credencial de acceso escolar de su hijo directamente desde la plataforma y enviársela de forma inmediata a su teléfono celular por WhatsApp sin necesidad de acudir a la oficina escolar:
            </p>

            {/* Step-by-Step Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0D6938] text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Ingresar al Rol de "Padres de Familia"
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  En el menú principal o barra de navegación superior, asegúrate de estar en el rol <strong>Padres de Familia</strong>. Si tienes más de un hijo inscrito en el colegio, selecciona el nombre de tu alumno en el selector superior de estudiantes.
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0D6938] text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Abrir el Generador de Acceso QR
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Haz clic en la pestaña <strong>"Credencial QR & WhatsApp"</strong>. A continuación, pulsa el botón verde principal: <strong className="text-[#0D6938]">"📲 Enviar QR a mi Hijo (WhatsApp)"</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0D6938] text-white font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Crear & Descargar la Imagen Óptica (PNG)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  El sistema genera en tiempo real el código QR criptográfico de alta resolución con corrección de errores <em>Nivel H</em>. Puedes presionar <strong>"Descargar Imagen QR (PNG)"</strong> para que tu hijo guarde la imagen en la galería de fotos de su celular (funciona sin internet en el portón).
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0D6938] text-white font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Enviar el Mensaje Oficial por WhatsApp
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-8">
                  Puedes escribir el número celular de tu hijo en el recuadro (ej. <em>+52 55...</em>) o dejarlo vacío para que WhatsApp te permita elegir su contacto. Luego haz clic en <strong>"Enviar por WhatsApp"</strong>.
                </p>
              </div>
            </div>

            {/* Message Template Preview Box */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2 font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-2">
                <span>💬 Mensaje Institucional que se envía a WhatsApp:</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">Pre-redactado</span>
              </div>
              <div className="space-y-1 text-slate-300 pl-1 text-[11px] leading-relaxed">
                <p className="text-emerald-300 font-bold">🎓 *CREDENCIAL ESCOLAR DIGITAL - CÓDIGO QR DE ACCESO*</p>
                <p>Hola *[Nombre del Alumno]*, aquí tienes tu código oficial para registrar tu entrada y salida del plantel escolar:</p>
                <p>👤 *Alumno:* [Nombre Completo]</p>
                <p>📋 *Matrícula:* [2026-001]</p>
                <p>🏫 *Grado y Grupo:* [3° Secundaria - Grupo A]</p>
                <p>🕒 *Turno:* [Matutino]</p>
                <p>🔑 *Código de Acceso:* [ESC-2026-001-ALUMNO]</p>
                <p className="pt-1 text-amber-200">📱 *Instrucciones para el Alumno:*</p>
                <p>1. Guarda este mensaje o descarga la imagen de tu código QR en tu galería.</p>
                <p>2. Al llegar y salir del colegio, muestra este código QR ante el lector en el portón.</p>
                <p>3. El sistema registrará tu puntualidad y notificará automáticamente a tu tutor en tiempo real con sonido Beep.</p>
              </div>
            </div>

            {/* Student Best Practices */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <span className="font-black text-amber-950 flex items-center gap-1.5">
                💡 Recomendaciones para el Alumno en el Portón:
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90 pl-1">
                <li><strong>Sin internet:</strong> El alumno puede abrir la imagen del código QR guardada en su galería sin requerir saldo ni datos móviles.</li>
                <li><strong>Brillo de Pantalla:</strong> Se recomienda tener el brillo de pantalla al menos al 60% para una lectura óptica instantánea en menos de 1 segundo.</li>
                <li><strong>Distancia Óptima:</strong> Colocar el celular a 15-25 centímetros de la lente de la cámara del portón.</li>
              </ul>
            </div>
          </div>

          {/* SECTION 4: MÓDULO REGISTRO DE ACCESOS (HISTORIAL CON DÍA Y HORA) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-[#0D6938] text-white font-black text-sm flex items-center justify-center">
                4
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Módulo "Registro de Accesos": Historial de Entradas y Salidas con Día y Hora
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              El rol Padre de Familia incluye el módulo oficial <strong>"Registro de Accesos"</strong> para la consulta histórica de todos los movimientos de su hijo con validez institucional:
            </p>

            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-700 pl-2">
              <li><strong>Día y Fecha Completa:</strong> Visualización del día de la semana (ej. <em>Miércoles, 23 de Septiembre de 2026</em>) y fecha numérica.</li>
              <li><strong>Hora Exacta:</strong> Sellado de tiempo en formato de alta precisión (ej. <em>07:48 AM</em>).</li>
              <li><strong>Tipo de Movimiento:</strong> Identificación clara entre <em>Entrada Escolar</em> y <em>Salida Escolar</em>.</li>
              <li><strong>Portón Escolar:</strong> Detalle del portón utilizado (Portón Principal, Secundario o Vehicular).</li>
              <li><strong>Puntualidad:</strong> Indicador de <em>"A tiempo / Puntual"</em> o <em>"Retardo"</em>.</li>
              <li><strong>Filtros y Búsqueda:</strong> Filtrado dinámico por fecha, tipo de movimiento o palabra clave.</li>
              <li><strong>Impresión y PDF:</strong> Botón para imprimir el concentrado de asistencia para justificar faltas ante la dirección o médicos.</li>
            </ul>
          </div>

          {/* SECTION 5: HERRAMIENTAS DE DEMOSTRACIÓN PARA EL CLIENTE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-sm flex items-center justify-center">
                5
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Guía Rápida para Demostración en Vivo a Clientes
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Para mostrar el funcionamiento al director, comité de padres o cliente sin requerir lectores físicos:
            </p>

            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 pl-1 font-medium">
              <li>
                Inicia sesión en el rol <strong>"Padres de Familia"</strong>.
              </li>
              <li>
                En la parte superior verás el banner interactivo <strong>"Demostración para Cliente: Simulador de Entrada Escolar QR"</strong>.
              </li>
              <li>
                Haz clic en el botón verde <strong>"Simular Entrada QR (Puntual)"</strong>:
                <ul className="list-disc list-inside pl-5 mt-1 text-slate-600 text-xs">
                  <li>Se escuchará de forma inmediata el sonido oficial <strong>Beep</strong>.</li>
                  <li>Se desplegará sobre la pantalla la <strong>ventana flotante</strong> con los datos de tu alumno seleccionado.</li>
                  <li>El estatus de la pantalla cambiará en vivo a <strong>"Dentro del Plantel"</strong>.</li>
                </ul>
              </li>
              <li>
                Puedes probar también <strong>"Con Retardo"</strong> para mostrar cómo cambia el color de alerta o presionar <strong>"Probar Beep"</strong> para verificar el audio.
              </li>
            </ol>
          </div>

          {/* SECTION 6: ESPECIFICACIONES TÉCNICAS Y SEGURIDAD */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <span className="w-7 h-7 rounded-lg bg-slate-800 text-white font-black text-sm flex items-center justify-center">
                6
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Especificaciones Técnicas y Seguridad
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 block">Encriptación y Privacidad</span>
                <p className="text-slate-600">
                  Los códigos QR contienen exclusivamente identificadores criptográficos institucionales, sin exponer datos sensibles del menor.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-black text-slate-900 block">Persistencia Continua</span>
                <p className="text-slate-600">
                  El sistema almacena el historial de accesos localmente, permitiendo operar incluso si se corta temporalmente la señal de internet.
                </p>
              </div>
            </div>
          </div>

          {/* Document Signatures / Institutional Footer */}
          <div className="border-t-2 border-slate-900 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-black text-slate-800">Control Escolar Digital • Plataforma de Seguridad y Accesos</p>
              <p>Manual de Operación de Acceso Escolar y Notificaciones Inmediatas</p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-slate-700">Documento Oficial para Directivos y Clientes</p>
              <p className="text-[11px] text-slate-400">Generado el 23 de Septiembre de 2026</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div className="no-print bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-600 font-semibold text-center sm:text-left">
            💡 <strong>Tip para tu cliente:</strong> Al hacer clic en <em>"Guardar como PDF / Imprimir"</em>, selecciona en tu navegador la opción <strong>"Guardar como PDF"</strong> en la sección Destino.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Descargar en PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
