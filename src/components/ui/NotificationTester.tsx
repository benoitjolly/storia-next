'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/config/socket';
import { WebSocketData } from '@/types/websocket'; // Nous allons créer ce fichier de types

type NotificationType = 'info' | 'success' | 'warning' | 'error';

const NotificationTester = () => {
  const { socket, isConnected, sendMessage } = useSocket();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');
  const [isSending, setIsSending] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Capturer l'ID du socket quand on se connecte
    if (socket.id) {
      setSocketId(socket.id);
    }

    socket.on('connect', () => {
      if (socket.id) {
        setSocketId(socket.id);
      }
    });

    // Gestionnaire générique pour tous les messages reçus
    const handleIncomingMessage = (event: string, data: WebSocketData) => {
      const message = typeof data === 'object' ? JSON.stringify(data) : String(data || '');
      setReceivedMessages(prev => [`${event}: ${message}`, ...prev.slice(0, 9)]);
    };

    // Écouter différents types de messages
    socket.onAny(handleIncomingMessage);

    return () => {
      socket.offAny();
    };
  }, [socket]);

  const handleSendNotification = () => {
    if (!message.trim() || !isConnected || !socket) return;

    setIsSending(true);

    const notification = {
      id: Date.now().toString(),
      type,
      message: message.trim(),
      timestamp: new Date(),
      sender: socketId
    };

    // Envoyer la notification au serveur WebSocket
    try {
      sendMessage('notification', notification);
      
      setTimeout(() => {
        setIsSending(false);
        setMessage('');
      }, 500);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      setIsSending(false);
    }
  };

  const handleSendSimpleMessage = () => {
    if (!message.trim() || !isConnected || !socket) return;

    setIsSending(true);

    // Envoyer un message simple
    try {
      const simpleMessage = {
        id: Date.now().toString(),
        message: message.trim(),
        timestamp: new Date(),
        sender: socketId
      };
      
      sendMessage('message', simpleMessage);
      
      setTimeout(() => {
        setIsSending(false);
        setMessage('');
      }, 500);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setIsSending(false);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as NotificationType);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Testeur de Notifications WebSocket</h2>
      
      {socketId && (
        <div className="mb-4 p-2 bg-blue-50 rounded border border-blue-200 text-sm">
          <span className="font-medium">Votre ID socket: </span>
          <span className="font-mono">{socketId}</span>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type de notification
        </label>
        <select
          id="type"
          value={type}
          onChange={handleTypeChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="info">Information</option>
          <option value="success">Succès</option>
          <option value="warning">Avertissement</option>
          <option value="error">Erreur</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Entrez le message à envoyer..."
        />
      </div>
      
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSendNotification}
          disabled={!message.trim() || !isConnected || isSending}
          className={`flex-1 py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !message.trim() || !isConnected || isSending
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSending ? 'Envoi en cours...' : 'Envoyer une notification'}
        </button>
        
        <button
          onClick={handleSendSimpleMessage}
          disabled={!message.trim() || !isConnected || isSending}
          className={`flex-1 py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !message.trim() || !isConnected || isSending
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isSending ? 'Envoi en cours...' : 'Envoyer un message'}
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Messages et notifications reçus</h3>
          <button
            onClick={() => setReceivedMessages([])}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Effacer
          </button>
        </div>
        <div className="bg-gray-50 border rounded-md h-32 overflow-y-auto">
          {receivedMessages.length === 0 ? (
            <p className="text-gray-400 text-sm p-3">Aucun message reçu</p>
          ) : (
            <ul className="text-xs">
              {receivedMessages.map((msg, index) => (
                <li key={index} className="p-2 border-b last:border-0">
                  <span className="text-gray-500">{new Date().toLocaleTimeString()}: </span>
                  <span className="text-gray-700 break-all">{msg.length > 100 ? `${msg.substring(0, 100)}...` : msg}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center">
        <span className={`inline-flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          <span className={`h-2 w-2 rounded-full mr-1 ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}></span>
          {isConnected ? 'Connecté au serveur WebSocket' : 'Déconnecté du serveur WebSocket'}
        </span>
      </div>
    </div>
  );
};

export default NotificationTester; 