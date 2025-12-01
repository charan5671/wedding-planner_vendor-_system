import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [], enquiries: [], messages: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Get chat history between two users
router.get('/:userId/:otherId', async (req, res) => {
    await db.read();
    const { userId, otherId } = req.params;

    const messages = db.data.messages.filter(m =>
        (m.senderId === userId && m.receiverId === otherId) ||
        (m.senderId === otherId && m.receiverId === userId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json(messages);
});

// Send a message (REST fallback)
router.post('/', async (req, res) => {
    await db.read();
    const { senderId, receiverId, text } = req.body;

    const newMessage = {
        id: `m${Date.now()}`,
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
        read: false
    };

    db.data.messages.push(newMessage);
    await db.write();

    res.status(201).json(newMessage);
});

export default router;
