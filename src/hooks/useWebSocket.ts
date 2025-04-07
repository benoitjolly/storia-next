'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { setGlobalSocketRef } from '@/config/socket';

// Configuration par défaut
const DEFAULT_URL = 'http://localhost:3001';

// Variables singleton pour maintenir l'état global entre les hooks
let globalSocket: Socket | null = null;
let isInitializing = false;

// Type pour les données WebSocket
type WebSocketData = Record<string, unknown> | string | unknown[] | unknown;

type UseWebSocketOptions = {
  url?: string;
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  onMessage?: (event: string, data: WebSocketData) => void;
};

type WebSocketState = {
  socket: Socket | null;
  isConnected: boolean;
  error: Error | null;
  connectionCount: number;
};

/**
 * Hook personnalisé pour gérer une connexion WebSocket
 */
export const useWebSocket = ({
  url = DEFAULT_URL,
  autoConnect = true,
  reconnectionAttempts = 5,
  reconnectionDelay = 1000,
  onMessage
}: UseWebSocketOptions = {}) => {
  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    error: null,
    connectionCount: 0
  });

  // Utiliser useRef pour suivre si c'est le premier rendu
  const initializedRef = useRef(false);

  useEffect(() => {
    // Si nous avons déjà initialisé ce hook, ne pas recréer le socket
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Si une initialisation est déjà en cours, attendre
    if (isInitializing) {
      const checkInterval = setInterval(() => {
        if (!isInitializing && globalSocket) {
          clearInterval(checkInterval);
          setState(prev => ({ ...prev, socket: globalSocket }));
          setupEventListeners(globalSocket);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Si nous avons déjà un socket global, l'utiliser
    if (globalSocket) {
      setState(prev => ({ ...prev, socket: globalSocket }));
      setupEventListeners(globalSocket);
      setGlobalSocketRef(globalSocket);
      return;
    }

    // Initialiser un nouveau socket
    isInitializing = true;
    console.log('Initialisation d\'un nouveau socket');
    
    const newSocket = io(url, {
      reconnectionAttempts,
      reconnectionDelay,
      autoConnect: false,
    });
    
    globalSocket = newSocket;
    setState(prev => ({ ...prev, socket: newSocket }));
    
    // Enregistrer le socket dans la référence globale
    setGlobalSocketRef(newSocket);
    
    // Configuration des écouteurs d'événements
    setupEventListeners(newSocket);

    // Connecter si autoConnect est true
    if (autoConnect) {
      console.log('Connexion automatique au serveur WebSocket');
      newSocket.connect();
    }

    isInitializing = false;

    // Nettoyage lors du démontage
    return () => {
      // Ne pas réellement déconnecter le socket global, juste les écouteurs spécifiques
      if (globalSocket) {
        removeEventListeners(globalSocket);
      }
    };
  }, [url, autoConnect, reconnectionAttempts, reconnectionDelay, onMessage]);

  // Fonction pour configurer les écouteurs d'événements
  const setupEventListeners = (socket: Socket) => {
    const onConnect = () => {
      console.log('Connecté au serveur WebSocket');
      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null,
        connectionCount: prev.connectionCount + 1
      }));
    };

    const onDisconnect = () => {
      console.log('Déconnecté du serveur WebSocket');
      setState(prev => ({
        ...prev,
        isConnected: false
      }));
    };

    const onError = (err: Error) => {
      console.error('Erreur WebSocket:', err);
      setState(prev => ({
        ...prev,
        error: err
      }));
    };

    // Si un écouteur de message personnalisé est fourni
    if (onMessage) {
      socket.onAny((event, data) => {
        onMessage(event, data);
      });
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    // Si déjà connecté, mettre à jour l'état
    if (socket.connected) {
      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));
    }
  };

  // Fonction pour retirer les écouteurs d'événements
  const removeEventListeners = (socket: Socket) => {
    socket.offAny();
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
  };

  // Fonction pour envoyer un message
  const sendMessage = (event: string, data: WebSocketData) => {
    if (state.socket && state.isConnected) {
      state.socket.emit(event, data);
      return true;
    }
    return false;
  };

  // Fonction pour se connecter manuellement
  const connect = () => {
    if (state.socket && !state.isConnected) {
      state.socket.connect();
    }
  };

  // Fonction pour se déconnecter manuellement
  const disconnect = () => {
    if (state.socket && state.isConnected) {
      state.socket.disconnect();
    }
  };

  return {
    ...state,
    sendMessage,
    connect,
    disconnect
  };
};

export default useWebSocket; 