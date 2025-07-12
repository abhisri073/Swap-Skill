import { io } from 'socket.io-client';

// Connect to the backend Socket.IO server (Vite proxy handles the connection to :5000)
const socket = io();

// You can add logic here to handle events globally, e.g., notifications
socket.on('connect', () => {
  console.log('Socket.IO connected:', socket.id);
  // Optional: Emit an event upon login to register the user with their Socket ID
});

export default socket;