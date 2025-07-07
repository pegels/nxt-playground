'use client'
import { ReactNode } from 'react';
import { Spinner } from './Spinner';
import { Button, buttonVariants } from '../ui/button';
import { VariantProps } from 'class-variance-authority';

type AppButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  isLoading?: boolean;
  asChild?: boolean;
} & VariantProps<typeof buttonVariants>;

export function AppButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  variant = 'default',
  size = 'default',
  className = '',
  isLoading = false,
  asChild = false,
}: AppButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={`cursor-pointer ${className}`}
      asChild={asChild}
    >
      {isLoading ? (
        <>
          <Spinner className="h-4 w-4 mr-2" />
          <span>Loading...</span>
        </>
      ) : children}
    </Button>
  );
}
