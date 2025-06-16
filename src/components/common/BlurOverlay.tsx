import React from 'react';
import { ClipLoader } from 'react-spinners';

interface BlurOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: number;
  opacity?: number;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({ 
  isLoading, 
  children, 
  spinnerSize = 50,
  opacity = 0.7
}) => {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ 
            backgroundColor: `rgba(255, 255, 255, ${opacity})`, 
            backdropFilter: 'blur(4px)'
          }}
        >
          <ClipLoader 
            color="#1E40AF" 
            loading={true} 
            size={spinnerSize}
          />
        </div>
      )}
    </div>
  );
};

export default BlurOverlay;
