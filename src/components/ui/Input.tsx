import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const generatedId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label 
          htmlFor={generatedId} 
          className="block text-[14px] font-semibold text-[#1C2421]"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#5B6660]">
            {rightIcon}
          </div>
        )}

        <input
          id={generatedId}
          className={`
            w-full h-11 px-3.5 text-[14px] font-normal text-[#1C2421] bg-white
            border rounded-[8px] transition-colors duration-150
            placeholder:text-[#5B6660]/60
            focus:outline-none focus:ring-1 focus:ring-[#1E9B5C] focus:border-[#1E9B5C]
            disabled:bg-[#EEF6F1] disabled:text-[#5B6660] disabled:cursor-not-allowed
            ${error ? 'border-[#C62828] focus:ring-[#C62828] focus:border-[#C62828]' : 'border-[#DDE3DF]'}
            ${rightIcon ? 'pr-10' : ''}
            ${leftIcon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />

        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#5B6660]">
            {leftIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[12px] font-medium text-[#C62828] flex items-center gap-1">
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-[12px] text-[#5B6660]">{hint}</p>
      ) : null}
    </div>
  );
};
