import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './auth/AuthProvider';
import App from './App';
import './i18n';
import './index.css';

// Enable React concurrent features
const root = createRoot(document.getElementById('root')!);

// Defer non-critical initialization
const init = () => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

// Use requestIdleCallback for non-critical init
if ('requestIdleCallback' in window) {
  requestIdleCallback(init);
} else {
  setTimeout(init, 1);
}