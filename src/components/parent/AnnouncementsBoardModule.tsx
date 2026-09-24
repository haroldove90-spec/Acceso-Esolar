import React, { useState } from 'react';
import { Megaphone, Calendar, FileText, Download, Clock, MapPin, Tag, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnnouncementsBoardModule: React.FC = () => {
  const { announcements, events } = useApp();
  const [activeSection, setActiveSection] = useState<'circulares' | 'eventos'>('circulares');

  const handleDownloadAttachment = (filename: string) => {
    alert(`Descargando documento oficial: ${filename}`);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header with Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-xl font-black text-slate-900">Tablón de Avisos Escolares</h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
            Circulares oficiales, comunicados de dirección y calendario escolar.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-black w-full sm:w-auto">
          <button
            onClick={() => setActiveSection('circulares')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSection === 'circulares'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Circulares y Avisos
          </button>
          <button
            onClick={() => setActiveSection('eventos')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSection === 'eventos'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Calendario Escolar
          </button>
        </div>
      </div>

      {/* Circulares Section */}
      {activeSection === 'circulares' && (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition shadow-xs space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-900">
                      {ann.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{ann.date}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{ann.title}</h3>
                </div>
              </div>

              <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">{ann.content}</p>

              <div className="pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-slate-600 font-semibold">
                  Publicado por: <strong className="font-black text-slate-900">{ann.author}</strong>
                </span>

                {ann.attachmentName && (
                  <button
                    onClick={() => handleDownloadAttachment(ann.attachmentName!)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs sm:text-sm border border-blue-200 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{ann.attachmentName}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Events Section */}
      {activeSection === 'eventos' && (
        <div className="space-y-4">
          {events.map(evt => (
            <div
              key={evt.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0D6938] border border-emerald-300 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                  <span className="text-xs uppercase font-black tracking-wider">{new Date(evt.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                  <span className="text-lg font-black leading-none">{evt.date.split('-')[2]}</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-50 text-[#0D6938] border border-emerald-200">
                    {evt.type}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">{evt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{evt.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0D6938]" /> {evt.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#0D6938]" /> {evt.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
