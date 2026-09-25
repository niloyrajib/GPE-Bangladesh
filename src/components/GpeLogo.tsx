import React from 'react';

interface GpeLogoProps {
  variant?: 'full' | 'nav' | 'icon' | 'badge' | 'footer' | 'default';
  className?: string;
  isDarkBg?: boolean;
  onClick?: () => void;
}

export const GpeLogo: React.FC<GpeLogoProps> = ({
  variant = 'nav',
  className = '',
  isDarkBg = false,
  onClick
}) => {
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="GPE Bangladesh - Gadget Phone Electronics"
      >
        <svg
          viewBox="0 0 110 110"
          className="w-full h-full max-w-full drop-shadow-sm select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gpeIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gpeBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="gpePhoneGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <rect width="110" height="110" rx="30" fill="url(#gpeIconGrad)" />
          {/* Smartwatch Outer Ring */}
          <circle cx="55" cy="55" r="40" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="4 4" />
          <circle cx="55" cy="55" r="48" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.45" />
          {/* Phone chassis */}
          <rect x="36" y="24" width="38" height="62" rx="9" fill="url(#gpePhoneGlow)" stroke="#065F46" strokeWidth="1" />
          <rect x="39" y="31" width="32" height="47" rx="5" fill="#0B1329" />
          <rect x="49" y="27" width="12" height="2" rx="1" fill="#94A3B8" />
          <rect x="50" y="74" width="10" height="2" rx="1" fill="#64748B" />
          {/* Lightning Bolt */}
          <path d="M57 36L46 49H54L52 64L64 50H56L59 36Z" fill="url(#gpeBoltGrad)" />
          {/* Connector Nodes */}
          <circle cx="26" cy="55" r="3.5" fill="#FFFFFF" />
          <line x1="29.5" y1="55" x2="36" y2="55" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="84" cy="55" r="3.5" fill="#34D399" />
          <line x1="74" y1="55" x2="80.5" y2="55" stroke="#34D399" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="GPE Bangladesh - Gadget Phone Electronics"
      >
        <svg
          viewBox="0 0 520 130"
          className="w-full h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gpeFullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gpeFullBolt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="gpeFullPhone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.85" />
            </linearGradient>
            <filter id="gpeFullGlow" x="-15%" y="-15%" width="130%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#059669" floodOpacity="0.22" />
            </filter>
          </defs>
          <g filter="url(#gpeFullGlow)" transform="translate(10, 10)">
            <rect width="110" height="110" rx="30" fill="url(#gpeFullGrad)" />
            <circle cx="55" cy="55" r="40" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.25" strokeDasharray="4 4" />
            <circle cx="55" cy="55" r="48" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.4" />
            <rect x="36" y="24" width="38" height="62" rx="9" fill="url(#gpeFullPhone)" stroke="#065F46" strokeWidth="1" />
            <rect x="39" y="31" width="32" height="47" rx="5" fill="#0B1329" />
            <rect x="49" y="27" width="12" height="2" rx="1" fill="#94A3B8" />
            <rect x="50" y="74" width="10" height="2" rx="1" fill="#64748B" />
            <path d="M57 36L46 49H54L52 64L64 50H56L59 36Z" fill="url(#gpeFullBolt)" />
            <circle cx="26" cy="55" r="3.5" fill="#FFFFFF" />
            <line x1="29.5" y1="55" x2="36" y2="55" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="84" cy="55" r="3.5" fill="#34D399" />
            <line x1="74" y1="55" x2="80.5" y2="55" stroke="#34D399" strokeWidth="2" />
          </g>

          <text
            x="142"
            y="62"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="46"
            fill={isDarkBg ? '#FFFFFF' : '#0F172A'}
            letterSpacing="-1.5"
          >
            GPE
          </text>
          <rect x="254" y="30" width="156" height="34" rx="10" fill={isDarkBg ? 'rgba(5, 150, 105, 0.25)' : '#ECFDF5'} stroke="#10B981" strokeWidth="1.5" />
          <text
            x="268"
            y="53"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="15"
            fill={isDarkBg ? '#34D399' : '#059669'}
            letterSpacing="2"
          >
            BANGLADESH
          </text>
          <rect x="420" y="34" width="76" height="26" rx="8" fill={isDarkBg ? 'rgba(2, 132, 199, 0.2)' : '#F1F5F9'} stroke={isDarkBg ? '#0284C7' : '#E2E8F0'} strokeWidth="1" />
          <text
            x="430"
            y="51"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="10"
            fill="#06B6D4"
            letterSpacing="1"
          >
            ORIGINAL
          </text>

          <g transform="translate(144, 85)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#059669" />
            <text x="5" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="10" fill="#FFFFFF">G</text>
            <text x="21" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill={isDarkBg ? '#E2E8F0' : '#0F172A'} letterSpacing="0.5">Gadget</text>

            <circle cx="80" cy="8" r="2.5" fill="#94A3B8" />

            <rect x="94" y="0" width="16" height="16" rx="4" fill="#0284C7" />
            <text x="100" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="10" fill="#FFFFFF">P</text>
            <text x="115" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill={isDarkBg ? '#E2E8F0' : '#0F172A'} letterSpacing="0.5">Phone</text>

            <circle cx="166" cy="8" r="2.5" fill="#94A3B8" />

            <rect x="180" y="0" width="16" height="16" rx="4" fill="#F59E0B" />
            <text x="186" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="10" fill="#FFFFFF">E</text>
            <text x="201" y="12" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill={isDarkBg ? '#E2E8F0' : '#0F172A'} letterSpacing="0.5">Electronics</text>
          </g>

          <text
            x="144"
            y="116"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            fontSize="11"
            fill={isDarkBg ? '#94A3B8' : '#64748B'}
            letterSpacing="2"
          >
            FAST EXPRESS SHOPPING • GENUINE TECH RETAIL
          </text>
        </svg>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2.5 sm:gap-3 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="GPE Bangladesh - Gadget Phone Electronics"
      >
        {/* Emblem Icon */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 110 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55" cy="55" r="40" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="4 4" />
            <circle cx="55" cy="55" r="48" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x="36" y="24" width="38" height="62" rx="9" fill="#FFFFFF" fillOpacity="0.95" stroke="#065F46" strokeWidth="1" />
            <rect x="39" y="31" width="32" height="47" rx="5" fill="#0B1329" />
            <rect x="49" y="27" width="12" height="2" rx="1" fill="#94A3B8" />
            <rect x="50" y="74" width="10" height="2" rx="1" fill="#64748B" />
            <path d="M57 36L46 49H54L52 64L64 50H56L59 36Z" fill="#F59E0B" />
            <circle cx="26" cy="55" r="3.5" fill="#FFFFFF" />
            <circle cx="84" cy="55" r="3.5" fill="#34D399" />
          </svg>
        </div>

        {/* Typography & Badge - GPE in soft/muted white color as requested */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl font-black tracking-tight font-sans text-white/90 drop-shadow-xs">
              GPE
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
              Bangladesh
            </span>
            <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-tight">
              Original
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium tracking-wide flex items-center gap-1 text-slate-300 pt-0.5">
            <span className="text-emerald-400 font-bold">G</span>adget • <span className="text-cyan-400 font-bold">P</span>hone • <span className="text-amber-400 font-bold">E</span>lectronics
          </p>
        </div>
      </div>
    );
  }

  // Navbar variant: Responsive, sharp, and clean
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title="GPE Bangladesh - Gadget Phone Electronics"
    >
      {/* Emblem Icon */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 110 110" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="55" cy="55" r="40" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.35" strokeDasharray="4 4" />
          <circle cx="55" cy="55" r="48" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.5" />
          <rect x="36" y="24" width="38" height="62" rx="9" fill="#FFFFFF" fillOpacity="0.95" stroke="#065F46" strokeWidth="1" />
          <rect x="39" y="31" width="32" height="47" rx="5" fill="#0B1329" />
          <rect x="49" y="27" width="12" height="2" rx="1" fill="#94A3B8" />
          <rect x="50" y="74" width="10" height="2" rx="1" fill="#64748B" />
          <path d="M57 36L46 49H54L52 64L64 50H56L59 36Z" fill="#F59E0B" />
          <circle cx="26" cy="55" r="3.5" fill="#FFFFFF" />
          <circle cx="84" cy="55" r="3.5" fill="#34D399" />
        </svg>
      </div>

      {/* Typography & Badge */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-xl sm:text-2xl font-black tracking-tight font-sans ${isDarkBg ? 'text-white/90' : 'text-slate-900'}`}>
            GPE
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 uppercase tracking-wider">
            Bangladesh
          </span>
          <span className="hidden sm:inline-block px-1 py-0.5 rounded text-[9px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-tight">
            Original
          </span>
        </div>
        <p className={`text-[10px] sm:text-[11px] font-medium tracking-wide flex items-center gap-1 ${isDarkBg ? 'text-slate-300' : 'text-slate-500'}`}>
          <span className="text-emerald-600 font-bold">G</span>adget • <span className="text-cyan-600 font-bold">P</span>hone • <span className="text-amber-600 font-bold">E</span>lectronics
        </p>
      </div>
    </div>
  );
};
