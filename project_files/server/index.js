import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for demo
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

import db from './db.js';

import authRoutes from './routes/auth.js';
import vendorRoutes from './routes/vendors.js';
import bookingRoutes from './routes/bookings.js';
import budgetRoutes from './routes/budget.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';
import enquiryRoutes from './routes/enquiries.js';
import messageRoutes from './routes/messages.js';

app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes(io));
app.use('/api/budget', budgetRoutes);
app.use('/api/notifications', notificationRoutes(io));
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join-room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on('send-message', async (message) => {
        // Save to DB
        await db.read();
        const newMessage = {
            id: `m${Date.now()}`,
            ...message,
            timestamp: new Date().toISOString(),
            read: false
        };
        db.data.messages.push(newMessage);
        await db.write();

        // Emit to receiver
        io.to(message.receiverId).emit('receive-message', newMessage);
        // Emit back to sender (for confirmation/multi-device)
        io.to(message.senderId).emit('receive-message', newMessage);

        // Notification
        io.to(message.receiverId).emit(`notification-${message.receiverId}`, {
            title: 'New Message',
            message: `You have a new message from ${message.senderName || 'a user'}`
        });
    });

    socket.on('typing', ({ senderId, receiverId }) => {
        io.to(receiverId).emit('user-typing', { senderId });
    });

    socket.on('stop-typing', ({ senderId, receiverId }) => {
        io.to(receiverId).emit('user-stop-typing', { senderId });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;

// Only start server if not running in serverless environment
if (!process.env.NETLIFY && !process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export { app };
