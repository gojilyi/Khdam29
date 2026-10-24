import React, { useState } from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'square' | 'circle';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'square',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-11 h-11 text-[14px]',
    lg: 'w-14 h-14 text-[16px]',
    xl: 'w-20 h-20 text-[20px]'
  };

  const radiusStyles = shape === 'circle' ? 'rounded-full' : 'rounded-[8px]';

  return (
    <div
      className={`
        relative shrink-0 overflow-hidden bg-[#EEF6F1] border border-[#DDE3DF]
        flex items-center justify-center font-bold text-[#0A4D2E] select-none
        ${sizeStyles[size]}
        ${radiusStyles}
        ${className}
      `}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="w-1/2 h-1/2 text-[#5B6660]" strokeWidth={1.75} aria-hidden="true" />
      )}
    </div>
  );
};
