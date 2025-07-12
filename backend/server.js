require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const ratingRoutes = require('./routes/ratingRoutes');

// Use CORS for frontend communication
app.use(cors());
app.use(express.json()); // Body parser middleware
app.use('/api/ratings', ratingRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT'] // Allow necessary methods for API calls
  }
});

// Store connected users' socket IDs mapped to their user IDs
// This is crucial for sending targeted notifications
const userSocketMap = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user logs in or connects, they should send their userId
  socket.on('registerUser', (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
    // Join a room named after the userId for targeted notifications
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove the disconnected socket from the map
    for (let [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`User ${userId} unregistered.`);
        break;
      }
    }
  });
});

// Make `io` accessible to route handlers
app.set('socketio', io); 

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Pass the 'io' instance to the swapRoutes and adminRoutes for real-time capabilities
app.use('/api/swaps', swapRoutes(io)); 
app.use('/api/admin', adminRoutes(io)); 

app.get('/', (req, res) => res.send('API running...'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));