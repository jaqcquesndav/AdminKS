import { baseStyles, variants, sizes } from './styles';
import type { ButtonProps } from './types';

interface GetButtonClassesProps {
  variant: ButtonProps['variant'];
  size: ButtonProps['size'];
  isLoading?: boolean;
  className?: string;
}

export function getButtonClasses({
  variant,
  size,
  isLoading,
  className = ''
}: GetButtonClassesProps): string {
  return [
    baseStyles,
    variants[variant],
    sizes[size],
    isLoading ? 'opacity-75 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');
}