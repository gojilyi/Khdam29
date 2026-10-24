import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = false
}) => {
  const iconSizes = {
    sm: { box: 28, text: 'text-[18px]', sub: 'text-[10px]' },
    md: { box: 36, text: 'text-[22px]', sub: 'text-[12px]' },
    lg: { box: 48, text: 'text-[28px]', sub: 'text-[14px]' }
  };

  const current = iconSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Symbol: Square with Clipped Top-Right Corner + Wrench/Checkmark */}
      <svg 
        width={current.box} 
        height={current.box} 
        viewBox="0 0 44 44" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Clipped corner square */}
        <path 
          d="M6 2H30L40 12V38C40 40.2 38.2 42 36 42H6C3.8 42 2 40.2 2 38V6C2 3.8 3.8 2 6 2Z" 
          fill="#0A4D2E" 
        />
        {/* Checkmark + Wrench Head combo in crisp white */}
        <path 
          d="M11 22L18 29L33 14L36 17L18 35L8 25L11 22Z" 
          fill="#FFFFFF" 
        />
        {/* Small wrench jaw notch */}
        <circle cx="31" cy="16" r="1.75" fill="#0A4D2E" />
      </svg>

      <div className="flex flex-col leading-none">
        <span className={`font-bold tracking-tight text-[#0A4D2E] ${current.text}`}>
          خـدّام
        </span>
        {showSubtitle && (
          <span className={`text-[#5B6660] font-normal mt-0.5 ${current.sub}`}>
            حرفيك قريب منك
          </span>
        )}
      </div>
    </div>
  );
};
