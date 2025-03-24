export const baseStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'font-medium',
  'rounded-md',
  'focus:outline-none',
  'transition-colors',
  'duration-200'
].join(' ');

export const variants = {
  primary: 'bg-primary hover:bg-primary-light text-white',
  secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white'
} as const;

export const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
} as const;