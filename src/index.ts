import express from 'express';
const { createServer } = require('node:http');
const cors = require('cors');
import { logger } from './logger';
import connectDB from './db';
import globalRouter from './global-router';
import { setupSocket } from './chat/chat-controller';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  exposedHeaders: '*', 
  credentials: true 
}));
app.use('/api/v1/', globalRouter);

const server = createServer(app);

const io = setupSocket(server);


app.get('/',(request, response) => {
  response.send("Hello World!");
})

server.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
