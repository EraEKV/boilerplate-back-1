import { Server } from 'socket.io';
import OpenAI from "openai";
import { chatInstructions } from './chat-instruction';

const openai = new OpenAI();
const streams = {}; 

export const setupSocket = (server: any) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    handleChatMessage(socket);

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
      delete streams[socket.id];
    });
  });

  return io;
};

interface MessageData {
  role: "user" | "assistant"; 
  content: string;
}

export const handleChatMessage = (socket: any) => {
  socket.on('message', async (messages: MessageData[]) => {
    if (!streams[socket.id]) {
      streams[socket.id] = { active: true, stream: null };
      // console.log('Received message from client: ', messages);

      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: 'system',
              content: chatInstructions
            },
            ...messages
          ],
          stream: true,
        });

        streams[socket.id].stream = stream;

        for await (const chunk of stream) {
          if (!streams[socket.id].active) {
            console.log('Stream stopped for:', socket.id);
            break;
          }

          const responseContent = chunk.choices[0]?.delta?.content || "";
          socket.emit('message', responseContent);
        }

        delete streams[socket.id];
        socket.emit("stream_finished")
      } catch (error) {
        console.error('Error while communicating with OpenAI: ', error);
        socket.emit('error', 'Something went wrong with OpenAI API');
        delete streams[socket.id];
      }
    } else {
      console.log("Stream already active for:", socket.id);
    }
  });

  socket.on('stop_stream', () => {
    if (streams[socket.id]) {
      console.log('Stopping stream for:', socket.id);
      streams[socket.id].active = false;
    } else {
      console.log("No active stream to stop for:", socket.id);
    }
  });
};
