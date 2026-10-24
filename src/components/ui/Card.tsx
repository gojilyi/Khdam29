import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'light' | 'bordered';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  isInteractive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    white: 'bg-white border border-[#DDE3DF]',
    light: 'bg-[#EEF6F1] border border-[#DDE3DF]',
    bordered: 'bg-white border-2 border-[#DDE3DF]'
  };

  return (
    <div
      className={`
        rounded-[12px] p-4 sm:p-5 shadow-[0_1px_2px_0_rgba(28,36,33,0.05)]
        ${variantStyles[variant]}
        ${isInteractive ? 'hover:border-[#1E9B5C] transition-colors duration-150 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
