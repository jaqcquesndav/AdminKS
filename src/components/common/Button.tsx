import React from 'react';
import type { LucideIcon } from 'lucide-react'; // Changed import to type import

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'dangerOutline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

const baseStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'rounded-md',
  'focus:outline-none',
  'transition-colors',
  'duration-200'
].join(' ');

const variants = {
  primary: 'bg-primary hover:bg-primary-light text-white',
  secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  dangerOutline: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  isLoading,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    baseStyles,
    variants[variant],
    sizes[size],
    isLoading ? 'opacity-75 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

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