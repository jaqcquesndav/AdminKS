import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onClose: () => void;
}

interface Point {
  x: number;
  y: number;
}

export function SignaturePad({ onSave, onClose }: SignaturePadProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  // Get the primary color from CSS variables
  const getPrimaryColor = () => {
    const primaryRgb = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary-rgb')
      .trim();
    return `rgb(${primaryRgb})`;
  };

  const getPoint = (event: MouseEvent | Touch, canvas: HTMLCanvasElement): Point | null => {
    try {
      if (!event.clientX && !event.clientY) return null;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      return {
        x: ((event.clientX || 0) - rect.left) * scaleX,
        y: ((event.clientY || 0) - rect.top) * scaleY
      };
    } catch (error) {
      console.error('Error getting point:', error);
      return null;
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    setHasSignature(true);

    try {
      const point = e instanceof MouseEvent 
        ? getPoint(e, canvas)
        : e.touches?.[0] && getPoint(e.touches[0], canvas);

      if (point) {
        setLastPoint(point);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
        }
      }
    } catch (error) {
      console.error('Error starting drawing:', error);
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const currentPoint = e instanceof MouseEvent 
        ? getPoint(e, canvas)
        : e.touches?.[0] && getPoint(e.touches[0], canvas);

      if (currentPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        setLastPoint(currentPoint);
      }
    } catch (error) {
      console.error('Error drawing:', error);
      stopDrawing(e);
    }
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } catch (error) {
      console.error('Error saving signature:', error);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Set canvas size with error handling
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Ensure valid dimensions
      const width = Math.max(rect.width * dpr, 1);
      const height = Math.max(rect.height * dpr, 1);
      
      canvas.width = width;
      canvas.height = height;

      // Scale context for retina displays
      ctx.scale(dpr, dpr);

      // Configure drawing style with theme's primary color
      ctx.strokeStyle = getPrimaryColor();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Prevent scrolling on touch devices
      canvas.style.touchAction = 'none';
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }

    // Cleanup function
    return () => {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, []);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Signature"
    >
      <div className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-48 bg-white cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            onTouchCancel={stopDrawing}
          />
        </div>

        <p className="text-sm text-gray-500 text-center">
          Utilisez votre souris ou votre doigt pour signer dans la zone ci-dessus
        </p>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={clearSignature}
            disabled={!hasSignature}
          >
            Effacer
          </Button>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasSignature}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
