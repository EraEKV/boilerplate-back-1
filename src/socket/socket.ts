import { Server } from 'socket.io';
import { handleChatMessage } from '../chat/chat-controller';

export const setupSocket = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    handleChatMessage(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};