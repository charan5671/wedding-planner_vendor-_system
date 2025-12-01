import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default function (io) {
    // Get notifications for user
    router.get('/user/:userId', async (req, res) => {
        await db.read();
        const notifications = db.data.notifications
            .filter(n => n.userId === req.params.userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(notifications);
    });

    // Create notification
    router.post('/', async (req, res) => {
        const { userId, title, message, type, link } = req.body;
        await db.read();

        const notification = {
            id: uuidv4(),
            userId,
            title,
            message,
            type, // 'booking', 'payment', 'review', 'system'
            link,
            read: false,
            createdAt: new Date().toISOString()
        };

        db.data.notifications.push(notification);
        await db.write();

        // Emit real-time notification
        io.emit(`notification-${userId}`, notification);

        res.status(201).json(notification);
    });

    // Mark as read
    router.patch('/:id/read', async (req, res) => {
        await db.read();
        const notification = db.data.notifications.find(n => n.id === req.params.id);

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.read = true;
        await db.write();

        res.json(notification);
    });

    // Mark all as read
    router.patch('/user/:userId/read-all', async (req, res) => {
        await db.read();
        db.data.notifications
            .filter(n => n.userId === req.params.userId)
            .forEach(n => n.read = true);

        await db.write();
        res.json({ message: 'All notifications marked as read' });
    });

    // Delete notification
    router.delete('/:id', async (req, res) => {
        await db.read();
        const index = db.data.notifications.findIndex(n => n.id === req.params.id);

        if (index === -1) return res.status(404).json({ message: 'Notification not found' });

        db.data.notifications.splice(index, 1);
        await db.write();

        res.json({ message: 'Notification deleted' });
    });

    return router;
}
