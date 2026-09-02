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
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">Tablón de Avisos Escolares</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Circulares oficiales, comunicados de dirección y calendario escolar.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveSection('circulares')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl transition ${
              activeSection === 'circulares'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Circulares y Avisos
          </button>
          <button
            onClick={() => setActiveSection('eventos')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl transition ${
              activeSection === 'eventos'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Calendario Escolar
          </button>
        </div>
      </div>

      {/* Circulares Section */}
      {activeSection === 'circulares' && (
        <div className="space-y-3">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-sky-300 transition shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{ann.date}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">{ann.title}</h3>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{ann.content}</p>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 text-[11px]">
                  Publicado por: <strong className="text-slate-800">{ann.author}</strong>
                </span>

                {ann.attachmentName && (
                  <button
                    onClick={() => handleDownloadAttachment(ann.attachmentName!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
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
        <div className="space-y-3">
          {events.map(evt => (
            <div
              key={evt.id}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
                  <span className="text-xs uppercase">{new Date(evt.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                  <span className="text-sm font-black leading-none">{evt.date.split('-')[2]}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {evt.type}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-500">{evt.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {evt.location}
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
