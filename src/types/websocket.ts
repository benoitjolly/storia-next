// Types pour les données WebSocket
export type WebSocketData = Record<string, unknown> | string | unknown[] | null | undefined;

// Type pour une notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date | string;
  sender?: string | null;
}

// Type pour un message simple
export interface SimpleMessage {
  id: string;
  message: string;
  timestamp: Date | string;
  sender?: string | null;
} 