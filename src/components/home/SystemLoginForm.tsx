import React, { useState } from 'react';
import {
  Shield,
  UserCheck,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  School,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoleType } from '../../types';
import { DEMO_CREDENTIALS, DemoCredential } from '../../constants/schoolStructure';
import { soundEffects } from '../../utils/audioNotification';

export const SystemLoginForm: React.FC = () => {
  const { setCurrentRole, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<RoleType>('admin');
  const [emailOrUser, setEmailOrUser] = useState('admin@moises.edu.mx');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  // Handle switching role tabs
  const handleSelectRoleTab = (role: RoleType) => {
    setSelectedRole(role);
    setErrorMessage(null);
    const demo = DEMO_CREDENTIALS.find(d => d.role === role);
    if (demo) {
      setEmailOrUser(demo.emailOrUser);
      setPassword(demo.password);
    }
  };

  // Populate form from sample credential card
  const handleFillCredentials = (demo: DemoCredential) => {
    setSelectedRole(demo.role);
    setEmailOrUser(demo.emailOrUser);
    setPassword(demo.password);
    setErrorMessage(null);
    setCopiedRole(demo.role);
    soundEffects.playClick();
    showToast(
      'Credencial Cargada',
      `Credenciales de ${demo.title} aplicadas al formulario.`,
      'info'
    );
    setTimeout(() => setCopiedRole(null), 1800);
  };

  // Direct login with demo credentials (1 click)
  const handleDirectDemoLogin = (demo: DemoCredential) => {
    setSelectedRole(demo.role);
    setEmailOrUser(demo.emailOrUser);
    setPassword(demo.password);
    setIsLoading(true);
    setErrorMessage(null);
    soundEffects.playBeep();

    setTimeout(() => {
      setIsLoading(false);
      setCurrentRole(demo.role);
      showToast(
        'Acceso Autorizado',
        `Bienvenido al sistema como: ${demo.title}`,
        'success'
      );
    }, 350);
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = emailOrUser.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Por favor ingrese su usuario/correo institucional y contraseña.');
      return;
    }

    setIsLoading(true);
    soundEffects.playBeep();

    setTimeout(() => {
      setIsLoading(false);

      // Validate matching demo credential or infer role
      const matchedDemo = DEMO_CREDENTIALS.find(
        d =>
          d.emailOrUser.toLowerCase() === trimmedUser &&
          d.password === trimmedPass
      );

      if (matchedDemo) {
        setCurrentRole(matchedDemo.role);
        showToast(
          'Acceso Exitoso',
          `Sesión iniciada correctamente como ${matchedDemo.title}.`,
          'success'
        );
        return;
      }

      // If user typed custom credentials, check if role matches selected or detect from keyword
      let targetRole: RoleType = selectedRole;
      if (trimmedUser.includes('admin') || trimmedUser.includes('director')) {
        targetRole = 'admin';
      } else if (trimmedUser.includes('docente') || trimmedUser.includes('profe') || trimmedUser.includes('puerta')) {
        targetRole = 'staff';
      } else if (trimmedUser.includes('padre') || trimmedUser.includes('tutor') || trimmedUser.startsWith('alu-')) {
        targetRole = 'parent';
      }

      // If password has at least 4 characters, allow login with selected role for smooth testability
      if (trimmedPass.length >= 4) {
        setCurrentRole(targetRole);
        const roleLabel = targetRole === 'admin' ? 'Dirección Escolar' : targetRole === 'staff' ? 'Docente / Puerta' : 'Padre de Familia';
        showToast(
          'Acceso Concedido',
          `Bienvenido al sistema institucional (${roleLabel}).`,
          'success'
        );
      } else {
        setErrorMessage('Contraseña incorrecta. Puedes usar las credenciales de muestra disponibles abajo.');
      }
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 py-6 sm:py-8 animate-in fade-in duration-300">
      {/* Central School Brand Emblem */}
      <div className="text-center mb-6 sm:mb-8 flex flex-col items-center max-w-3xl mx-auto">
        <div className="relative mb-3.5 group">
          <img
            src="https://kabris.com.mx/moiseslogo.png"
            alt="Moises saenz"
            className="h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            loading="eager"
          />
          <div className="absolute -bottom-2 bg-gradient-to-r from-[#D91A2A] via-[#0D6938] to-[#5B92C8] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md">
            Secundaria Oficial
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
          Moisés Sáenz
        </h1>

        <div className="flex items-center gap-2 mt-2 flex-wrap justify-center text-xs font-black">
          <span className="text-[#5B92C8] bg-sky-50 px-3 py-1 rounded-full border border-sky-200 uppercase tracking-wider flex items-center gap-1.5">
            <School className="w-3.5 h-3.5" />
            Esc. Sec. Gral. No. 1 • C.C.T. 30DES0040L
          </span>
          <span className="text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Coatzacoalcos, Veracruz
          </span>
          <span className="bg-emerald-100 text-[#0D6938] px-3 py-1 rounded-full border border-emerald-300">
            55 Aniversario 1970-2025
          </span>
        </div>

        <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm font-bold mt-2.5">
          Portal de Autenticación & Control de Accesos QR para Alumnos de Secundaria (Grupos A al L)
        </p>
      </div>

      {/* Main Grid: Login Card + Sample Credentials Column */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Login Form (7 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl sm:rounded-[32px] border-2 border-slate-200 shadow-xl p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-[#D91A2A]" /> Iniciar Sesión
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Ingresa con tu perfil educativo o utiliza las credenciales de muestra
              </p>
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider bg-red-50 text-[#D91A2A] px-2.5 py-1 rounded-full border border-red-200">
              Acceso Seguro
            </span>
          </div>

          {/* Role selector tabs */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">
              Selecciona tu Perfil de Acceso:
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleSelectRoleTab('admin')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-white text-[#D91A2A] shadow-sm border border-red-200 scale-102'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="truncate">Dirección</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleTab('staff')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedRole === 'staff'
                    ? 'bg-white text-[#D97706] shadow-sm border border-amber-200 scale-102'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="truncate">Docente</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleTab('parent')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                  selectedRole === 'parent'
                    ? 'bg-white text-[#0D6938] shadow-sm border border-emerald-200 scale-102'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="truncate">Tutor / Padres</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs font-bold text-red-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const demo = DEMO_CREDENTIALS.find(d => d.role === selectedRole);
                        if (demo) handleFillCredentials(demo);
                      }}
                      className="text-red-700 underline font-black hover:text-red-900 cursor-pointer"
                    >
                      Autollenar credencial de muestra para {selectedRole}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* User / Email Input */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-1.5">
                Usuario / Correo Institucional / Matrícula *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrUser}
                  onChange={e => setEmailOrUser(e.target.value)}
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@moises.edu.mx'
                      : selectedRole === 'staff'
                      ? 'docente@moises.edu.mx'
                      : 'padre@moises.edu.mx o ALU-2026-001'
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D91A2A] focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center justify-between">
                <span>Ejemplo asignado: <strong className="font-mono text-slate-700">{DEMO_CREDENTIALS.find(d => d.role === selectedRole)?.emailOrUser}</strong></span>
              </p>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black uppercase text-slate-700">
                  Contraseña de Acceso *
                </label>
                <span className="text-[11px] font-semibold text-slate-500">
                  Clave muestra: <strong className="font-mono text-slate-700">{DEMO_CREDENTIALS.find(d => d.role === selectedRole)?.password}</strong>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D91A2A] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#D91A2A] rounded-md border-slate-300 focus:ring-[#D91A2A]"
                />
                <span>Recordar sesión en este equipo</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  const demo = DEMO_CREDENTIALS.find(d => d.role === selectedRole);
                  if (demo) handleFillCredentials(demo);
                }}
                className="text-xs font-black text-[#5B92C8] hover:text-[#3B72A8] hover:underline cursor-pointer"
              >
                Cargar muestra
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base text-white bg-[#D91A2A] hover:bg-[#b91222] shadow-lg shadow-[#D91A2A]/25 transition-all duration-200 active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando Credenciales...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 stroke-[2.4]" />
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Entorno de Pruebas: Selecciona cualquier rol abajo para entrar al instante.
            </span>
          </div>
        </div>

        {/* Right Column: Sample Credentials Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-slate-700">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  Credenciales de Muestra para Pruebas
                </h3>
                <p className="text-xs text-slate-300 font-semibold">
                  Haz clic en cualquiera de las credenciales para probar los módulos escolares:
                </p>
              </div>
            </div>
          </div>

          {/* 3 Interactive Sample Credential Cards */}
          <div className="space-y-3">
            {DEMO_CREDENTIALS.map(demo => {
              const isSelected = selectedRole === demo.role;
              const isCopied = copiedRole === demo.role;
              const Icon = demo.role === 'admin' ? Shield : demo.role === 'staff' ? UserCheck : Users;

              return (
                <div
                  key={demo.role}
                  className={`bg-white rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 p-4 sm:p-5 shadow-xs hover:shadow-md ${
                    isSelected ? `${demo.borderClass} ring-2 ring-offset-1 ring-slate-400/20` : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${demo.badgeClass}`}>
                        <Icon className="w-5 h-5 stroke-[2.3]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900 leading-tight">
                            {demo.title}
                          </h4>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${demo.badgeClass}`}>
                            {demo.badge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {demo.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credentials Box */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 grid grid-cols-2 gap-2 my-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block font-sans">
                        Usuario / Correo:
                      </span>
                      <strong className="text-slate-900 text-xs block truncate select-all">
                        {demo.emailOrUser}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-slate-400 block font-sans">
                        Contraseña:
                      </span>
                      <strong className="text-slate-900 text-xs block select-all">
                        {demo.password}
                      </strong>
                    </div>
                  </div>

                  {/* Capabilities description */}
                  <p className="text-xs text-slate-600 font-semibold mb-3">
                    {demo.description}
                  </p>

                  {/* Action Buttons: Fill Form vs Enter Directly */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleFillCredentials(demo)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      title="Cargar estos datos en el formulario de arriba"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">¡Cargado!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                          <span>Cargar en Formulario</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDirectDemoLogin(demo)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-black shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${demo.btnClass}`}
                      title={`Ingresar inmediatamente como ${demo.title}`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Entrar Directo ⚡</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* School Structure Badge */}
          <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-950 font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Configuración Activa: <strong>Secundaria • 12 Grupos (A al L)</strong></span>
            </div>
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Actualizado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
