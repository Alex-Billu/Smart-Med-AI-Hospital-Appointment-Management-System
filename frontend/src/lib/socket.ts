import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  const token = Cookies.get('kmch_token') || localStorage.getItem('kmch_token');
  if (!token) return null;

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      auth: { token },
      autoConnect: true,
      reconnection: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Socket.io connected to KMCH backend');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket.io disconnected');
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
