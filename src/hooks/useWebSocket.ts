```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import { useToastStore } from '../components/common/ToastContainer';

interface WebSocketOptions {
  url: string;
  onMessage: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onError,
  reconnectAttempts = 3,
  reconnectInterval = 3000,
}: WebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const addToast = useToastStore(state => state.addToast);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectCountRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        onError?.(error);
        addToast('error', 'Connection error occurred');
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectCountRef.current < reconnectAttempts) {
          setIsReconnecting(true);
          reconnectCountRef.current += 1;
          setTimeout(connect, reconnectInterval);
        } else {
          addToast('error', 'Connection lost. Please refresh the page.');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      addToast('error', 'Failed to establish connection');
    }
  }, [url, onMessage, onError, reconnectAttempts, reconnectInterval, addToast]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      addToast('error', 'Connection not available');
    }
  }, [addToast]);

  return {
    isConnected,
    isReconnecting,
    send
  };
}
```