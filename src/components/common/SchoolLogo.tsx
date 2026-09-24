import React from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showSubtitle?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  // Height scale preserving full natural proportions and aspect ratio without encapsulation
  const sizeMap = {
    sm: 'h-10 sm:h-12 w-auto',
    md: 'h-14 sm:h-16 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-36 w-auto',
    full: 'h-auto max-h-52 w-auto',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official full-size unencapsulated school logo */}
      <img
        src="https://kabris.com.mx/moiseslogo.png"
        alt="Logo Moisés Sáenz"
        className={`${sizeMap[size]} object-contain shrink-0 drop-shadow-xs`}
        loading="eager"
      />

      {showSubtitle && (
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            Moises saenz
          </span>
        </div>
      )}
    </div>
  );
};
