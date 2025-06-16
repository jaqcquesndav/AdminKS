import { useCallback, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type Layout = 'compact' | 'comfortable';

export function useTheme() {
  const [theme, internalSetTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });
  const [layout, internalSetLayout] = useState<Layout>(() => {
    return (localStorage.getItem('layout') as Layout) || 'comfortable';
  });

  const applyTheme = useCallback((themeToApply: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    if (themeToApply === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(themeToApply);
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    localStorage.setItem('layout', layout);
    // You might want to apply layout changes to the document body or a root element here
    // For example: document.body.dataset.layout = layout;
  }, [layout]);

  const setTheme = useCallback((newTheme: Theme) => {
    internalSetTheme(newTheme);
  }, []);

  const setLayout = useCallback((newLayout: Layout) => {
    internalSetLayout(newLayout);
  }, []);

  const toggleTheme = useCallback(() => {
    internalSetTheme(currentTheme => {
      if (currentTheme === 'light') return 'dark';
      if (currentTheme === 'dark') return 'light';
      // If system, and system is dark, toggle to light. If system and system is light, toggle to dark.
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'light' : 'dark'; 
    });
  }, []);

  // Listen for system theme changes if current theme is 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return {
    theme,
    setTheme,
    layout,
    setLayout,
    toggleTheme,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
}