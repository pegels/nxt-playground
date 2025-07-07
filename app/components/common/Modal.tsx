'use client'
import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  onClose?: () => void;
};

export function Modal({ 
  isOpen, 
  title, 
  children,
  maxWidth = 'md',
  onClose
}: ModalProps) {
  // Map custom size values to class names
  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    'full': 'sm:max-w-full'
  }[maxWidth];
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && onClose) {
          onClose();
        }
      }}
    >
      <DialogContent 
        className={maxWidthClass} 
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
