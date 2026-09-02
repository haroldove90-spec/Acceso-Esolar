import React from 'react';
import { Shield, UserCheck, Users, School, GraduationCap } from 'lucide-react';
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
  }[] = [
    {
      id: 'admin',
      name: 'Administrador',
      icon: Shield,
      cardBorderHover: 'hover:border-blue-400',
      shadowHover: 'hover:shadow-blue-500/10',
      circleBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      circleHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      labelHoverColor: 'group-hover:text-blue-600',
    },
    {
      id: 'staff',
      name: 'Docente / Puerta',
      icon: UserCheck,
      cardBorderHover: 'hover:border-orange-400',
      shadowHover: 'hover:shadow-orange-500/10',
      circleBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      circleHoverBg: 'group-hover:bg-orange-600 group-hover:text-white',
      labelHoverColor: 'group-hover:text-orange-600',
    },
    {
      id: 'parent',
      name: 'Padres de Familia',
      icon: Users,
      cardBorderHover: 'hover:border-teal-400',
      shadowHover: 'hover:shadow-teal-500/10',
      circleBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      circleHoverBg: 'group-hover:bg-teal-600 group-hover:text-white',
      labelHoverColor: 'group-hover:text-teal-600',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 py-8 sm:py-12">
      {/* Central School Brand Emblem */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white shadow-xl rounded-3xl mx-auto flex items-center justify-center mb-4 border border-blue-100 shadow-blue-500/10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <School className="w-9 h-9 sm:w-10 sm:h-10 stroke-[1.8]" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-2 uppercase">
          Acceso Escolar
        </h2>
        <p className="text-slate-500 max-w-md mx-auto text-xs sm:text-sm font-medium">
          Control inteligente de accesos escolares, credenciales QR y monitoreo en tiempo real.
        </p>
      </div>

      {/* 3 Vibrant Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 w-full max-w-4xl">
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              id={`select-role-${role.id}`}
              onClick={() => setCurrentRole(role.id)}
              className={`group bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-slate-100 ${role.cardBorderHover} hover:shadow-xl ${role.shadowHover} flex flex-col items-center justify-center gap-4 transition-all duration-200 cursor-pointer active:scale-95 text-center`}
            >
              <div
                className={`w-18 h-18 sm:w-20 sm:h-20 ${role.circleBg} rounded-full flex items-center justify-center ${role.iconColor} ${role.circleHoverBg} transition-colors duration-200 shadow-xs`}
              >
                <Icon className="h-9 w-9 sm:h-10 sm:w-10 stroke-[1.8]" />
              </div>
              <span
                className={`font-bold text-slate-700 ${role.labelHoverColor} uppercase text-xs sm:text-sm tracking-widest transition-colors`}
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
