import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

export function Link({ children, className = '', ...props }: LinkProps) {
  return (
    <RouterLink
      className={`text-interactive hover:text-interactive-light transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </RouterLink>
  );
}