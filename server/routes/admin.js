import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    await db.read();

    const admin = db.data.admins.find(a => a.email === email && a.password === password);
    if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ admin: { id: admin.id, name: admin.name, email: admin.email } });
});

// Get all users
router.get('/users', async (req, res) => {
    await db.read();
    res.json(db.data.users);
});

// Get all vendors
router.get('/vendors', async (req, res) => {
    await db.read();
    res.json(db.data.vendors);
});

// Approve vendor
router.patch('/vendors/:id/approve', async (req, res) => {
    await db.read();
    const vendor = db.data.vendors.find(v => v.id === req.params.id);

    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    vendor.verified = true;
    await db.write();

    res.json(vendor);
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    await db.read();
    res.json(db.data.bookings);
});

// Get all reviews
router.get('/reviews', async (req, res) => {
    await db.read();
    res.json(db.data.reviews);
});

// Delete review (moderation)
router.delete('/reviews/:id', async (req, res) => {
    await db.read();
    const index = db.data.reviews.findIndex(r => r.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: 'Review not found' });

    db.data.reviews.splice(index, 1);
    await db.write();

    res.json({ message: 'Review deleted' });
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
    await db.read();

    const analytics = {
        totalUsers: db.data.users.length,
        totalVendors: db.data.vendors.length,
        totalBookings: db.data.bookings.length,
        totalRevenue: db.data.payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        pendingVendors: db.data.vendors.filter(v => !v.verified).length,
        confirmedBookings: db.data.bookings.filter(b => b.status === 'confirmed').length,
        averageRating: db.data.vendors.reduce((sum, v) => sum + (v.rating || 0), 0) / (db.data.vendors.length || 1)
    };

    res.json(analytics);
});

export default router;
