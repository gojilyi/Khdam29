import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  // Height rules: minimum 44px for touch targets
  const sizeClasses = {
    sm: 'h-11 px-3.5 text-[12px] gap-1.5',
    md: 'h-11 px-4 text-[14px] gap-2',
    lg: 'h-12 px-6 text-[16px] gap-2.5'
  };

  const variantClasses = {
    primary: 'bg-[#0F6B3F] hover:bg-[#0A4D2E] active:bg-[#0A4D2E] text-white border border-[#0F6B3F]',
    secondary: 'bg-[#EEF6F1] hover:bg-[#DDE3DF] active:bg-[#DDE3DF] text-[#0A4D2E] border border-transparent',
    outline: 'bg-white hover:bg-[#EEF6F1] active:bg-[#EEF6F1] text-[#0A4D2E] border border-[#DDE3DF]',
    ghost: 'bg-transparent hover:bg-[#EEF6F1] text-[#1C2421] border border-transparent',
    danger: 'bg-[#C62828] hover:bg-[#B71C1C] active:bg-[#B71C1C] text-white border border-[#C62828]'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-[8px]
        transition-colors duration-150 select-none cursor-pointer whitespace-nowrap
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9B5C] focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
