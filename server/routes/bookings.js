import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default function (io) {
    // Create Booking
    router.post('/', async (req, res) => {
        const { userId, vendorId, date, time } = req.body;
        await db.read();

        const newBooking = {
            id: uuidv4(),
            userId,
            vendorId,
            date,
            time,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        db.data.bookings.push(newBooking);
        await db.write();

        // Real-time update
        io.emit('new-booking', newBooking);

        res.status(201).json(newBooking);
    });

    // Get Bookings for User
    router.get('/user/:userId', async (req, res) => {
        await db.read();
        const bookings = db.data.bookings.filter(b => b.userId === req.params.userId);
        res.json(bookings);
    });

    // Get Bookings for Vendor
    router.get('/vendor/:vendorId', async (req, res) => {
        await db.read();
        const bookings = db.data.bookings.filter(b => b.vendorId === req.params.vendorId);
        res.json(bookings);
    });

    // Update Booking Status
    router.patch('/:id', async (req, res) => {
        const { status } = req.body;
        await db.read();

        const booking = db.data.bookings.find(b => b.id === req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status;
        await db.write();

        // Real-time update
        io.emit('booking-updated', booking);

        res.json(booking);
    });

    return router;
}
