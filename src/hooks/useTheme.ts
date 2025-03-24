import { useCallback } from 'react';

export function useTheme() {
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(current);
  }, [setTheme]);

  return {
    toggleTheme,
    setTheme,
    isDark: document.documentElement.classList.contains('dark')
  };
}