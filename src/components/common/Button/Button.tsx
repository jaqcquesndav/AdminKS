import React from 'react';
import { getButtonClasses } from './utils';
import type { ButtonProps } from './types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = getButtonClasses({ variant, size, isLoading, className });

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
}