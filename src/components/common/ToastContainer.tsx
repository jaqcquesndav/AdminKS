import React, { ReactNode } from 'react';

interface ToastContainerProps {
  children: ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 space-y-2 transition-all">
      {children}
    </div>
  );
}