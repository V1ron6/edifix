import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} rounded-2xl border border-[#2a2a4a] bg-[#16213e] shadow-[0_8px_40px_rgba(0,0,0,0.4)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-[#2a2a4a] px-6 py-4">
            {title && (
              <h2 className="text-lg font-semibold text-[#b8b8d1]">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto rounded-lg p-2 text-[#a0a0b8] transition-colors hover:bg-[#5b5f97]/10 hover:text-[#b8b8d1]"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 flex items-center justify-end gap-3 border-t border-[#2a2a4a] pt-4 ${className}`}>
      {children}
    </div>
  );
}
