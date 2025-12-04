import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [], enquiries: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Create new enquiry
router.post('/', async (req, res) => {
    await db.read();
    const { vendorId, userId, message, date, guests } = req.body;

    const newEnquiry = {
        id: `e${Date.now()}`,
        vendorId,
        userId,
        message,
        date,
        guests,
        status: 'pending', // pending, replied, booked
        createdAt: new Date().toISOString()
    };

    db.data.enquiries.push(newEnquiry);

    // Add notification for vendor
    const vendor = db.data.vendors.find(v => v.id === vendorId);
    if (vendor && vendor.userId) {
        db.data.notifications.push({
            id: `n${Date.now()}`,
            userId: vendor.userId,
            title: 'New Enquiry',
            message: `You have a new enquiry for ${date}`,
            read: false,
            createdAt: new Date().toISOString()
        });
    }

    await db.write();
    res.status(201).json(newEnquiry);
});

// Get enquiries for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
    await db.read();
    const { vendorId } = req.params;

    // Join with user data to show who sent the enquiry
    const enquiries = db.data.enquiries
        .filter(e => e.vendorId === vendorId)
        .map(e => {
            const user = db.data.users.find(u => u.id === e.userId);
            return {
                ...e,
                userName: user ? user.name : 'Unknown User',
                userEmail: user ? user.email : ''
            };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(enquiries);
});

// Update enquiry status
router.patch('/:id/status', async (req, res) => {
    await db.read();
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = db.data.enquiries.find(e => e.id === id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    enquiry.status = status;
    await db.write();
    res.json(enquiry);
});

export default router;
