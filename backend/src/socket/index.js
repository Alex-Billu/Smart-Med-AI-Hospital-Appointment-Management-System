const jwt = require('jsonwebtoken');

function setupSocket(io) {
  // Store socket instances per user
  const userSockets = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kmch_smartmed_super_secret_key_2026');
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: User ${socket.user.id} (${socket.user.role}) - Socket ID: ${socket.id}`);

    // Join user specific room
    socket.join(`user:${socket.user.id}`);

    // If doctor, join doctor room
    if (socket.user.role === 'doctor') {
      socket.join(`doctor:${socket.user.id}`);
    }

    // If admin, join admin room
    if (socket.user.role === 'admin') {
      socket.join('admin');
    }

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: User ${socket.user.id}`);
    });
  });

  // Export helper to emit to user
  return {
    emitToUser: (userId, event, data) => {
      io.to(`user:${userId}`).emit(event, data);
    },
    emitToDoctor: (doctorId, event, data) => {
      io.to(`doctor:${doctorId}`).emit(event, data);
    },
    emitToAdmin: (event, data) => {
      io.to('admin').emit(event, data);
    }
  };
}

module.exports = setupSocket;
