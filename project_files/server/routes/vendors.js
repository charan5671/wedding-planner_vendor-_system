import express from 'express';
import { JSONFilePreset } from 'lowdb/node';

const router = express.Router();
const defaultData = { users: [], vendors: [], bookings: [], reviews: [], budgets: [], notifications: [], admins: [], payments: [], wishlist: [] };
const db = await JSONFilePreset('db.json', defaultData);

// Get all vendors with advanced filters
router.get('/', async (req, res) => {
    await db.read();
    const { category, search, minPrice, maxPrice, location, minRating } = req.query;

    let vendors = db.data.vendors;

    // Category filter
    if (category) {
        vendors = vendors.filter(v => v.category === category);
    }

    // Search filter
    if (search) {
        const query = search.toLowerCase();
        vendors = vendors.filter(v =>
            v.name.toLowerCase().includes(query) ||
            v.description.toLowerCase().includes(query)
        );
    }

    // Price range filter
    if (minPrice) {
        vendors = vendors.filter(v => v.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        vendors = vendors.filter(v => v.price <= parseFloat(maxPrice));
    }

    // Location filter
    if (location) {
        vendors = vendors.filter(v => v.location && v.location.toLowerCase().includes(location.toLowerCase()));
    }

    // Rating filter
    if (minRating) {
        vendors = vendors.filter(v => v.rating >= parseFloat(minRating));
    }

    res.json(vendors);
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
    await db.read();
    const vendor = db.data.vendors.find(v => v.id === req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
});

// Get vendor by User ID (for dashboard)
router.get('/user/:userId', async (req, res) => {
    await db.read();
    const vendor = db.data.vendors.find(v => v.userId === req.params.userId);
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    res.json(vendor);
});

// Get vendor analytics (for vendor dashboard)
router.get('/:id/analytics', async (req, res) => {
    await db.read();
    const vendorId = req.params.id;

    const bookings = db.data.bookings.filter(b => b.vendorId === vendorId);
    const reviews = db.data.reviews.filter(r => r.vendorId === vendorId);

    const analytics = {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        totalRevenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
        totalReviews: reviews.length
    };

    res.json(analytics);
});

// Create new vendor (Admin only)
router.post('/', async (req, res) => {
    await db.read();
    const { name, category, description, price, location, image, gallery, services, verified } = req.body;

    const newVendor = {
        id: `v${Date.now()}`,
        name,
        category,
        description,
        price: parseFloat(price),
        rating: 0,
        image: image || 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        location: location || '',
        gallery: gallery || [],
        availability: [],
        verified: verified || false,
        services: services || [],
        commission: 15,
        visible: true,
        createdAt: new Date().toISOString()
    };

    db.data.vendors.push(newVendor);
    await db.write();

    res.status(201).json(newVendor);
});

// Update vendor (Admin only)
router.put('/:id', async (req, res) => {
    await db.read();
    const vendorIndex = db.data.vendors.findIndex(v => v.id === req.params.id);

    if (vendorIndex === -1) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    const updatedVendor = {
        ...db.data.vendors[vendorIndex],
        ...req.body,
        id: req.params.id, // Preserve ID
        updatedAt: new Date().toISOString()
    };

    db.data.vendors[vendorIndex] = updatedVendor;
    await db.write();

    res.json(updatedVendor);
});

// Delete vendor (Admin only)
router.delete('/:id', async (req, res) => {
    await db.read();
    const vendorIndex = db.data.vendors.findIndex(v => v.id === req.params.id);

    if (vendorIndex === -1) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    const deletedVendor = db.data.vendors.splice(vendorIndex, 1)[0];
    await db.write();

    res.json({ message: 'Vendor deleted successfully', vendor: deletedVendor });
});

// Toggle vendor visibility (Admin only)
router.patch('/:id/visibility', async (req, res) => {
    await db.read();
    const vendor = db.data.vendors.find(v => v.id === req.params.id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.visible = !vendor.visible;
    await db.write();

    res.json({ message: 'Visibility toggled', vendor });
});

export default router;
