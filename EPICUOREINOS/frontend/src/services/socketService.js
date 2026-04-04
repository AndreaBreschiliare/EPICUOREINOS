import { io } from 'socket.io-client';
import { authService } from './authService';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:5000' : 'https://api.odisseiadamente.com.br';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = authService.getToken();
    this.socket = io(SOCKET_URL, {
      auth: { token },
      // Keep default transport order (polling -> websocket) for broader browser compatibility.
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
    });

    return this.socket;
  }

  subscribeToFeud(feudId) {
    if (!this.socket) return;
    this.socket.emit('feud:subscribe', { feudId });
  }

  unsubscribeFromFeud(feudId) {
    if (!this.socket) return;
    this.socket.emit('feud:unsubscribe', { feudId });
  }

  on(eventName, callback) {
    if (!this.socket) return;
    this.socket.on(eventName, callback);
  }

  off(eventName, callback) {
    if (!this.socket) return;
    this.socket.off(eventName, callback);
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
