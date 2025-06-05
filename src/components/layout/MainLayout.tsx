import { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { AdvancedLoader } from '../common/AdvancedLoader';
import { useTheme } from '../../contexts/ThemeContext';
import { ChatProvider } from '../../contexts/ChatContext';
import { authService } from '../../services/auth/authService'; // Corrected import path

export function MainLayout() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation(); 
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

    // Vérification d'authentification
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          // Rediriger vers la page de connexion si non authentifié
          navigate('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);
  // Ajouter un effet pour surveiller les changements de route
  useEffect(() => {
    console.log('Route changée:', location.pathname);
    // Forcer un rechargement de la page si la navigation vers une autre route que dashboard ne fonctionne pas
    if (location.pathname !== '/dashboard' && document.title === 'Dashboard - Wanzo Admin') {
      console.log('Changement de titre pour refléter la nouvelle route');
      document.title = `${location.pathname.substring(1)} - Wanzo Admin`;
    }
  }, [location]);

  if (isLoading) {
    return <AdvancedLoader fullScreen message="Chargement du tableau de bord..." />;
  }

  return (
    <ChatProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header 
          onMobileMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobileMenuOpen={isSidebarOpen}
          onThemeToggle={toggleTheme}
          isDark={isDark}
        />
        <div className="flex flex-grow h-[calc(100vh-4rem)] pt-16">
          <Sidebar 
            isOpen={isSidebarOpen} 
            isMobile={isMobileView}
            onClose={() => setIsSidebarOpen(false)}
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
              <Suspense fallback={<AdvancedLoader message="Chargement du contenu..." />}>
                <Outlet />
              </Suspense>
            </main>
          </div>
        </div>
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}