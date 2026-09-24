import React from 'react';
import { Shield, UserCheck, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';

export const HomeRoleSelector: React.FC = () => {
  const { setCurrentRole } = useApp();

  const roles: {
    id: RoleType;
    name: string;
    subtitle: string;
    icon: any;
    cardBorderHover: string;
    shadowHover: string;
    circleBg: string;
    iconColor: string;
    circleHoverBg: string;
    labelHoverColor: string;
    badgeText: string;
    badgeStyle: string;
    colSpanClass: string;
  }[] = [
    {
      id: 'admin',
      name: 'Dirección Escolar',
      subtitle: 'Control Escolar & Matrícula',
      icon: Shield,
      cardBorderHover: 'hover:border-[#D91A2A]',
      shadowHover: 'hover:shadow-[#D91A2A]/20',
      circleBg: 'bg-[#D91A2A] text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-[#B91222]',
      labelHoverColor: 'group-hover:text-[#D91A2A]',
      badgeText: 'Administrador',
      badgeStyle: 'bg-red-50 text-[#D91A2A] border-red-200',
      colSpanClass: 'col-span-1',
    },
    {
      id: 'staff',
      name: 'Docente / Puerta',
      subtitle: 'Lector Óptico de Portón',
      icon: UserCheck,
      cardBorderHover: 'hover:border-[#D97706]',
      shadowHover: 'hover:shadow-[#D97706]/20',
      circleBg: 'bg-[#D97706] text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-[#B45309]',
      labelHoverColor: 'group-hover:text-[#D97706]',
      badgeText: 'Registro QR',
      badgeStyle: 'bg-amber-50 text-amber-900 border-amber-200',
      colSpanClass: 'col-span-1',
    },
    {
      id: 'parent',
      name: 'Padres de Familia',
      subtitle: 'Notificaciones & Credencial QR',
      icon: Users,
      cardBorderHover: 'hover:border-[#0D6938]',
      shadowHover: 'hover:shadow-[#0D6938]/20',
      circleBg: 'bg-[#0D6938] text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-[#094d28]',
      labelHoverColor: 'group-hover:text-[#0D6938]',
      badgeText: 'Tutores & Familia',
      badgeStyle: 'bg-emerald-50 text-[#0D6938] border-emerald-200',
      colSpanClass: 'col-span-2 md:col-span-1',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-8 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Central School Brand Emblem */}
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
        <img
          src="https://kabris.com.mx/moiseslogo.png"
          alt="Moises saenz"
          className="h-32 sm:h-44 md:h-52 w-auto object-contain drop-shadow-md mb-4"
          loading="eager"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase max-w-2xl">
          Moises saenz
        </h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
          <span className="text-xs font-black uppercase tracking-wider text-[#5B92C8] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            Esc. Sec. Gral. No. 1 • C.C.T. 30DES0040L
          </span>
          <span className="text-xs font-black text-slate-700">Coatzacoalcos, Veracruz</span>
          <span className="text-xs font-black bg-emerald-100 text-[#0D6938] px-2.5 py-0.5 rounded-full border border-emerald-300">
            55 Aniversario 1970-2025
          </span>
        </div>
        <p className="text-slate-600 max-w-lg mx-auto text-xs sm:text-sm font-bold mt-2">
          Sistema Institucional de Control de Accesos & Notificaciones en Tiempo Real
        </p>
      </div>

      {/* 3 Role Selection Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 w-full max-w-4xl">
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              id={`select-role-${role.id}`}
              onClick={() => setCurrentRole(role.id)}
              className={`${role.colSpanClass} group bg-white p-5 sm:p-7 rounded-3xl sm:rounded-[32px] shadow-sm border-2 border-slate-200 ${role.cardBorderHover} hover:shadow-xl ${role.shadowHover} flex flex-col items-center justify-center gap-3 sm:gap-3.5 transition-all duration-200 cursor-pointer active:scale-95 text-center`}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 ${role.circleBg} rounded-2xl sm:rounded-3xl flex items-center justify-center ${role.iconColor} ${role.circleHoverBg} transition-all duration-200 shadow-md group-hover:scale-105`}
              >
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 stroke-[2.2]" />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${role.badgeStyle}`}>
                  {role.badgeText}
                </span>
                <span
                  className={`block font-black text-slate-900 ${role.labelHoverColor} uppercase text-sm sm:text-base tracking-wide transition-colors leading-tight mt-1.5`}
                >
                  {role.name}
                </span>
                <span className="text-xs text-slate-500 font-bold block mt-0.5">
                  {role.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
