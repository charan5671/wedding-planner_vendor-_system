import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Get reviews for vendor
router.get('/vendor/:vendorId', async (req, res) => {
    await db.read();
    const reviews = db.data.reviews.filter(r => r.vendorId === req.params.vendorId);
    res.json(reviews);
});

// Create review
router.post('/', async (req, res) => {
    const { userId, vendorId, bookingId, rating, comment } = req.body;
    await db.read();

    const review = {
        id: uuidv4(),
        userId,
        vendorId,
        bookingId,
        rating: parseInt(rating),
        comment,
        vendorReply: null,
        helpful: 0,
        createdAt: new Date().toISOString()
    };

    db.data.reviews.push(review);

    // Update vendor rating
    const vendorReviews = db.data.reviews.filter(r => r.vendorId === vendorId);
    const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
    const vendor = db.data.vendors.find(v => v.id === vendorId);
    if (vendor) {
        vendor.rating = Math.round(avgRating * 10) / 10;
    }

    await db.write();

    res.status(201).json(review);
});

// Vendor reply to review
router.patch('/:id/reply', async (req, res) => {
    const { vendorReply } = req.body;
    await db.read();

    const review = db.data.reviews.find(r => r.id === req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.vendorReply = vendorReply;
    review.repliedAt = new Date().toISOString();

    await db.write();
    res.json(review);
});

// Mark review as helpful
router.patch('/:id/helpful', async (req, res) => {
    await db.read();

    const review = db.data.reviews.find(r => r.id === req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.helpful = (review.helpful || 0) + 1;

    await db.write();
    res.json(review);
});

export default router;
