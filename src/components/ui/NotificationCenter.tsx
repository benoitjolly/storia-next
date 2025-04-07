'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/config/socket';
import { WebSocketData, Notification } from '@/types/websocket';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isConnected, error } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Gestionnaire pour les notifications
    const handleNotification = (data: WebSocketData) => {
      try {
        // Tenter de parser la notification si elle est reçue comme une chaîne
        let parsedNotification: Notification;
        
        if (typeof data === 'string') {
          try {
            parsedNotification = JSON.parse(data);
          } catch {
            // Si ce n'est pas un JSON valide, créer une notification de type info
            parsedNotification = {
              id: Math.random().toString(36).substring(2, 11),
              type: 'info',
              message: data,
              timestamp: new Date(),
            };
          }
        } else if (data && typeof data === 'object') {
          // Vérifier si l'objet a la structure minimale d'une Notification
          const obj = data as Record<string, unknown>;
          if (
            'id' in obj && typeof obj.id === 'string' &&
            'type' in obj && typeof obj.type === 'string' &&
            'message' in obj && typeof obj.message === 'string' &&
            'timestamp' in obj
          ) {
            // Construire manuellement l'objet Notification
            parsedNotification = {
              id: obj.id,
              type: (obj.type as string) === 'info' || 
                    (obj.type as string) === 'success' || 
                    (obj.type as string) === 'warning' || 
                    (obj.type as string) === 'error' 
                    ? (obj.type as 'info' | 'success' | 'warning' | 'error') 
                    : 'info',
              message: obj.message as string,
              timestamp: typeof obj.timestamp === 'string' 
                ? obj.timestamp as string 
                : (obj.timestamp instanceof Date)
                  ? obj.timestamp as Date 
                  : new Date(),
              sender: 'sender' in obj && obj.sender ? obj.sender as string : undefined
            };
          } else {
            // Créer une nouvelle notification à partir des données disponibles
            parsedNotification = {
              id: Math.random().toString(36).substring(2, 11),
              type: 'info',
              message: JSON.stringify(obj),
              timestamp: new Date(),
            };
          }
        } else {
          // Si ce n'est pas un objet valide, créer une notification par défaut
          parsedNotification = {
            id: Math.random().toString(36).substring(2, 11),
            type: 'info',
            message: 'Notification reçue',
            timestamp: new Date(),
          };
        }

        setNotifications((prev) => [
          { ...parsedNotification, timestamp: new Date() }, 
          ...prev.slice(0, 19)
        ]);
        setUnreadCount((count) => count + 1);
      } catch (error) {
        console.error('Erreur lors du traitement de la notification:', error);
      }
    };

    // Écouter spécifiquement les événements de notification
    socket.on('notification', handleNotification);

    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'success':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="relative">
      {/* Icône de notification */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Badge de notification non lues */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleClearAll}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Tout effacer
              </button>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id || index}
                  className={`border-l-4 p-3 border-b ${getNotificationColor(notification.type || 'info')}`}
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">
                      {notification.type 
                        ? notification.type.charAt(0).toUpperCase() + notification.type.slice(1) 
                        : 'Info'
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{notification.message}</p>
                  {notification.sender && (
                    <p className="text-xs text-gray-500 mt-1">
                      De: {notification.sender}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Statut de connexion */}
          <div className="p-2 border-t bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
            {error && (
              <span className="text-xs text-red-500">
                Erreur de connexion
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 