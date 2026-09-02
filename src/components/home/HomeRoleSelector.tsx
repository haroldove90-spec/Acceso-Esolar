import React from 'react';
import { Shield, UserCheck, Users, School } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';

export const HomeRoleSelector: React.FC = () => {
  const { setCurrentRole } = useApp();

  const roles: {
    id: RoleType;
    name: string;
    icon: any;
    cardBorderHover: string;
    shadowHover: string;
    circleBg: string;
    iconColor: string;
    circleHoverBg: string;
    labelHoverColor: string;
    colSpanClass: string;
  }[] = [
    {
      id: 'admin',
      name: 'Administrador',
      icon: Shield,
      cardBorderHover: 'hover:border-blue-500',
      shadowHover: 'hover:shadow-blue-500/15',
      circleBg: 'bg-blue-600 text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-blue-700',
      labelHoverColor: 'group-hover:text-blue-700',
      colSpanClass: 'col-span-1',
    },
    {
      id: 'staff',
      name: 'Docente / Puerta',
      icon: UserCheck,
      cardBorderHover: 'hover:border-orange-500',
      shadowHover: 'hover:shadow-orange-500/15',
      circleBg: 'bg-orange-600 text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-orange-700',
      labelHoverColor: 'group-hover:text-orange-700',
      colSpanClass: 'col-span-1',
    },
    {
      id: 'parent',
      name: 'Padres de Familia',
      icon: Users,
      cardBorderHover: 'hover:border-teal-500',
      shadowHover: 'hover:shadow-teal-500/15',
      circleBg: 'bg-teal-600 text-white',
      iconColor: 'text-white',
      circleHoverBg: 'group-hover:bg-teal-700',
      labelHoverColor: 'group-hover:text-teal-700',
      colSpanClass: 'col-span-2 md:col-span-1',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-8 py-6 sm:py-12 animate-in fade-in duration-300">
      {/* Central School Brand Emblem */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 shadow-xl shadow-blue-600/20 rounded-3xl mx-auto flex items-center justify-center mb-4 text-white">
          <School className="w-11 h-11 sm:w-13 sm:h-13 stroke-[2.2]" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">
          Acceso Escolar
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base font-bold">
          Seleccione el rol correspondiente para acceder a sus funciones
        </p>
      </div>

      {/* 2 Columns on Mobile, 3 on Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6 w-full max-w-4xl">
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              id={`select-role-${role.id}`}
              onClick={() => setCurrentRole(role.id)}
              className={`${role.colSpanClass} group bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[36px] shadow-sm border-2 border-slate-200 ${role.cardBorderHover} hover:shadow-xl ${role.shadowHover} flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all duration-200 cursor-pointer active:scale-95 text-center`}
            >
              <div
                className={`w-14 h-14 sm:w-18 sm:h-18 ${role.circleBg} rounded-2xl sm:rounded-3xl flex items-center justify-center ${role.iconColor} ${role.circleHoverBg} transition-all duration-200 shadow-md group-hover:scale-105`}
              >
                <Icon className="h-7 w-7 sm:h-9 sm:w-9 stroke-[2.2]" />
              </div>
              <span
                className={`font-black text-slate-900 ${role.labelHoverColor} uppercase text-sm sm:text-base tracking-wide transition-colors leading-tight`}
              >
                {role.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
