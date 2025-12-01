import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    await db.read();

    const existingUser = db.data.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { id: uuidv4(), name, email, password, role };
    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({ user: { id: newUser.id, name, email, role } });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await db.read();

    const user = db.data.users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;
