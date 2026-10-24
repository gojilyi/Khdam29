import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C2421]/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          w-full max-w-[calc(100%-32px)] ${maxWidthStyles[maxWidth]} bg-white border border-[#DDE3DF]
          rounded-[12px] shadow-[0_4px_12px_rgba(28,36,33,0.12)] p-4 sm:p-6
          relative max-h-[90vh] max-h-[90dvh] overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 w-9 h-9 flex items-center justify-center text-[#5B6660] hover:text-[#1C2421] hover:bg-[#EEF6F1] rounded-[8px] transition-colors"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {(title || description) && (
          <div className="mb-4 pl-10">
            {title && (
              <h3 className="text-[20px] font-bold text-[#0A4D2E] leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-[14px] text-[#5B6660] mt-1">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};
