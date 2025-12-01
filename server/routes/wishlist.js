import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Add to wishlist
router.post('/', async (req, res) => {
    const { userId, vendorId } = req.body;
    await db.read();

    // Check if already in wishlist
    const existing = db.data.wishlist.find(w => w.userId === userId && w.vendorId === vendorId);
    if (existing) {
        return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlistItem = {
        id: uuidv4(),
        userId,
        vendorId,
        createdAt: new Date().toISOString()
    };

    db.data.wishlist.push(wishlistItem);
    await db.write();

    res.status(201).json(wishlistItem);
});

// Get wishlist for user
router.get('/user/:userId', async (req, res) => {
    await db.read();
    const wishlistItems = db.data.wishlist.filter(w => w.userId === req.params.userId);

    // Populate with vendor details
    const populatedWishlist = wishlistItems.map(item => {
        const vendor = db.data.vendors.find(v => v.id === item.vendorId);
        return { ...item, vendor };
    });

    res.json(populatedWishlist);
});

// Remove from wishlist
router.delete('/:id', async (req, res) => {
    await db.read();
    const index = db.data.wishlist.findIndex(w => w.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: 'Wishlist item not found' });

    db.data.wishlist.splice(index, 1);
    await db.write();

    res.json({ message: 'Removed from wishlist' });
});

export default router;
