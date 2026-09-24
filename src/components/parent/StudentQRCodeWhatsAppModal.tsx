import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Share2,
  Download,
  Copy,
  Check,
  Send,
  Smartphone,
  Phone,
  School,
  CheckCircle2,
  Sparkles,
  Info,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentQRCodeWhatsAppModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentQRCodeWhatsAppModal: React.FC<StudentQRCodeWhatsAppModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [childPhone, setChildPhone] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [customQrCode, setCustomQrCode] = useState<string>('');

  useEffect(() => {
    if (student) {
      const codeVal = customQrCode || student.qrCodeValue || `ESC-${student.enrollmentId}-${student.fullName.toUpperCase().replace(/\s+/g, '-')}`;
      setCustomQrCode(codeVal);

      QRCode.toDataURL(codeVal, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('Error generating QR', err));
    }
  }, [student, customQrCode]);

  if (!isOpen || !student) return null;

  const currentQrValue = customQrCode || student.qrCodeValue;

  // Format the official institutional message to send to the student via WhatsApp
  const whatsappMessageText = `🎓 *CREDENCIAL ESCOLAR DIGITAL - CÓDIGO QR DE ACCESO*

Hola *${student.fullName}*, aquí tienes tu código oficial para registrar tu entrada y salida del plantel escolar:

👤 *Alumno:* ${student.fullName}
📋 *Matrícula:* ${student.enrollmentId}
🏫 *Grado y Grupo:* ${student.grade} - Grupo ${student.group}
🕒 *Turno:* ${student.shift}
🔑 *Código de Acceso:* ${currentQrValue}

📱 *Instrucciones para el Alumno:*
1. Guarda este mensaje o descarga la imagen de tu código QR en tu galería.
2. Al llegar y salir del colegio, muestra este código QR ante el lector en el portón.
3. El sistema registrará tu puntualidad y notificará automáticamente a tu tutor en tiempo real.`;

  const encodedWhatsappMsg = encodeURIComponent(whatsappMessageText);
  const cleanPhone = childPhone.replace(/\D/g, '');
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedWhatsappMsg}`
    : `https://api.whatsapp.com/send?text=${encodedWhatsappMsg}`;

  // Download QR code image as PNG file
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-Acceso-${student.enrollmentId}-${student.fullName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Código QR Descargado', 'La imagen del QR se guardó en tu dispositivo para compartirla con tu hijo.', 'success');
  };

  // Copy WhatsApp message text to clipboard
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMessageText);
    setCopied(true);
    showToast('Mensaje Copiado', 'Texto con instrucciones de acceso copiado al portapapeles.', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  // Regenerate / Refresh QR Code token
  const handleRegenerateQR = () => {
    const freshCode = `ESC-${student.enrollmentId}-${Date.now().toString().slice(-4)}`;
    setCustomQrCode(freshCode);
    showToast('Código QR Actualizado', 'Se generó un nuevo identificador óptico para mayor seguridad.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transform animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#0D6938] border-b-4 border-[#D91A2A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black shadow-inner">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full border border-white/30 inline-block mb-0.5">
                Generador de Acceso Escolar
              </span>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                Crear & Enviar Código QR por WhatsApp
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Student Profile Quick Banner */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 shrink-0 bg-white shadow-xs">
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-emerald-600 text-white rounded-tl-md">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                Destinatario (Hijo / Alumno)
              </span>
              <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {student.fullName}
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Matrícula: <span className="font-mono font-bold text-blue-700">{student.enrollmentId}</span> • {student.grade} Grupo {student.group}
              </p>
            </div>
          </div>

          {/* Generated QR Code Display Box */}
          <div className="p-5 bg-gradient-to-b from-emerald-50/70 to-slate-50 rounded-3xl border-2 border-emerald-300/60 flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative bg-white p-3.5 rounded-2xl shadow-md border border-slate-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Código QR de ${student.fullName}`}
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-xl animate-pulse">
                  <QrCode className="w-12 h-12 text-slate-400" />
                </div>
              )}
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow border border-white whitespace-nowrap">
                Lectura Óptica HD
              </span>
            </div>

            <div className="pt-2 text-center">
              <p className="text-xs font-mono font-black text-slate-800 tracking-wide bg-white px-3 py-1 rounded-xl border border-slate-200 inline-block">
                {currentQrValue}
              </p>
              <p className="text-[11px] font-semibold text-slate-500 mt-1">
                Este código QR es compatible con todos los lectores de portón y cámaras del personal escolar.
              </p>
            </div>

            {/* Quick QR actions: Download Image & Regenerate */}
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
              <button
                type="button"
                onClick={handleDownloadQR}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-black text-xs border border-slate-300 shadow-2xs transition active:scale-95 cursor-pointer"
                title="Descargar imagen PNG para guardar en el celular de tu hijo"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Descargar Imagen QR (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateQR}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition active:scale-95 cursor-pointer"
                title="Generar un nuevo token para el código QR"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Regenerar</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Direct Send Section */}
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 sm:p-5 rounded-3xl space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
              <Smartphone className="w-5 h-5 text-emerald-700" />
              <span>Enviar Directo al WhatsApp de tu Hijo</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Número de Celular de tu hijo / estudiante (Opcional):
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={childPhone}
                  onChange={e => setChildPhone(e.target.value)}
                  placeholder="Ej. +52 55 1234 5678 (o déjalo en blanco para elegir en WhatsApp)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Si dejas el número vacío, WhatsApp te permitirá elegir el contacto de tu hijo o el grupo familiar.
              </p>
            </div>

            {/* Action Buttons: Open WhatsApp & Copy Text */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Mensaje'}</span>
              </button>
            </div>
          </div>

          {/* Explanatory Reassurance Note */}
          <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Consejo para el alumno:</strong> El estudiante puede guardar la imagen descargada en su celular o fijar el mensaje de WhatsApp. No necesita conexión a internet para mostrar el código QR en la entrada del colegio.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs sm:text-sm transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
