'use client';

import { Socket } from 'socket.io-client';
import useWebSocket from '@/hooks/useWebSocket';

// URL de notre serveur WebSocket local
const SOCKET_URL = 'http://localhost:3001';

// Nouveau hook avec la logique déportée
export const useSocket = () => {
  const {
    socket,
    isConnected,
    error,
    connectionCount,
    sendMessage,
    connect,
    disconnect
  } = useWebSocket({
    url: SOCKET_URL,
    autoConnect: true
  });

  return {
    socket,
    isConnected,
    error,
    connectionCount,
    sendMessage,
    connect,
    disconnect
  };
};

// Variable globale pour stocker la référence au socket
let globalSocketRef: Socket | null = null;

// Pour la compatibilité avec le code existant
export const getSocket = (): Socket => {
  if (!globalSocketRef) {
    throw new Error('Socket not initialized. Ensure useSocket hook is used first in a React component.');
  }
  return globalSocketRef;
};

// Fonction pour définir la référence globale au socket (à appeler depuis useSocket dans un composant)
export const setGlobalSocketRef = (socket: Socket | null): void => {
  if (socket) {
    globalSocketRef = socket;
  }
};

export default useSocket; 