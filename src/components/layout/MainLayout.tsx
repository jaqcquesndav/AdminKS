import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { PageLoader } from '../common/PageLoader';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatProvider } from '../../contexts/ChatContext';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

export function MainLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileView(isMobile);
      if (!isMobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `${import.meta.env.VITE_AUTH_URL}?redirect=${currentPath}`;
    } else {
      setIsLoading(false);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <ChatProvider>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Header 
          onMobileMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobileMenuOpen={isSidebarOpen}
          onThemeToggle={toggleTheme}
          isDark={isDark}
        />
        <div className="flex h-screen pt-16">
          <Sidebar 
            isOpen={isSidebarOpen} 
            isMobile={isMobileView}
            onClose={() => setIsSidebarOpen(false)}
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-bg-secondary p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}