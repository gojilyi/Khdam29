import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'neutral' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[12px] px-2 py-0.5',
    md: 'text-[14px] px-2.5 py-1'
  };

  const variantStyles = {
    green: 'bg-[#EEF6F1] text-[#0A4D2E] border border-[#1E9B5C]/30',
    neutral: 'bg-[#EEF6F1] text-[#5B6660] border border-[#DDE3DF]',
    danger: 'bg-red-50 text-[#C62828] border border-[#C62828]/20'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-[8px] whitespace-nowrap
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
