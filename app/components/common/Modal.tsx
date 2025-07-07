'use client'
import { ReactNode, useEffect } from 'react';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
};

export function Modal({ 
  isOpen, 
  title, 
  children,
  maxWidth = 'md'
}: ModalProps) {
  useEffect(() => {
    // Lock body scroll when modal is open
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    'full': 'max-w-full'
  }[maxWidth];

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className={`bg-card border shadow-lg rounded-lg w-full ${maxWidthClass} animate-in fade-in-0 zoom-in-95 duration-200`}
      >
        <div className="p-5 border-b">
          <h2 className="text-lg font-medium leading-6">{title}</h2>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
