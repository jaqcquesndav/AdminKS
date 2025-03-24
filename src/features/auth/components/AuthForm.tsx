import React from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { SocialAuth } from './SocialAuth';
import type { AuthMode } from '../types';

interface AuthFormProps {
  mode: AuthMode;
  error?: string;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (data: { name: string; email: string; password: string }) => Promise<void>;
  onSocialAuth: {
    google: () => Promise<void>;
    microsoft: () => Promise<void>;
    github: () => Promise<void>;
  };
  onSwitchMode: (mode: AuthMode) => void;
}

export function AuthForm({ 
  mode, 
  error, 
  onLogin, 
  onSignUp, 
  onSocialAuth, 
  onSwitchMode 
}: AuthFormProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onSubmit={onLogin}
            error={error}
            onSwitchToSignUp={() => onSwitchMode('signup')}
          />
        ) : (
          <SignUpForm
            onSubmit={onSignUp}
            error={error}
            onSwitchToLogin={() => onSwitchMode('login')}
          />
        )}
        <SocialAuth {...onSocialAuth} />
      </div>
    </div>
  );
}