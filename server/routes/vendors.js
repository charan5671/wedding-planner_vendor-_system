import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// --- RBAC MIDDLEWARE ---
const isVendor = (req, res, next) => {
    const role = req.headers['x-user-role'];
    if (role === 'vendor' || role === 'admin') return next();

    console.warn(`[403] Vendor access denied for role: ${role}`);
    res.status(403).json({ error: 'Access denied. Vendor or Admin privileges required.' });
};

// Apply isVendor to routes that modify data or access vendor-specific info
// For this simple implementation, we'll apply it to the whole router
// but maybe some public routes should stay open? 
// Actually, 'vendors' router handles general listing too.
// We should ONLY protect the sensitive routes.
// Let's protect routes that require auth.

router.use((req, res, next) => {
    // Only protect routes that are vendor-specific or actions
    // Public routes like GET / are handled at the top
    const publicPaths = ['/', '/:id'];
    if (req.method === 'GET' && (req.path === '/' || req.path.match(/^\/[^/]+$/))) {
        return next();
    }
    isVendor(req, res, next);
});

// Initialize Supabase client for this module directly if not passed via middleware, 
// ensuring we have access regardless.
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'placeholder'
);

const mockVendors = [
    { id: 'v1', business_name: 'Elegant Florals', category: 'Florist', location: 'New York', is_verified: true, description: 'Beautiful flowers for all occasions', price_range: '$$', images: [] },
    { id: 'v2', business_name: 'Classic Catering', category: 'Catering', location: 'Chicago', is_verified: false, description: 'Delicious food for your wedding', price_range: '$$$', images: [] },
    { id: 'v3', business_name: 'Dream Photography', category: 'Photography', location: 'Los Angeles', is_verified: true, description: 'Capturing your special moments', price_range: '$$$$', images: [] }
];

// Helper to check connection
const isDbConfigured = () => {
    return process.env.SUPABASE_URL &&
        process.env.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' &&
        process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
};

const checkDb = (res) => {
    if (!isDbConfigured()) {
        res.status(503).json({ message: 'Database not connected. Please configure .env' });
        return false;
    }
    return true;
};

// Get all vendors with advanced filters
router.get('/', async (req, res) => {
    const { category, search, minPrice, maxPrice, location, minRating } = req.query;

    if (!isDbConfigured()) {
        let filtered = [...mockVendors];
        if (category) filtered = filtered.filter(v => v.category === category);
        if (location) filtered = filtered.filter(v => v.location.toLowerCase().includes(location.toLowerCase()));
        return res.json(filtered);
    }

    let query = supabase.from('vendors').select('*').eq('is_verified', true);
    if (category) query = query.eq('category', category);
    if (location) query = query.ilike('location', `%${location}%`);

    const { data: vendors, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(vendors);
});

// Get single vendor by ID
router.get('/:id', async (req, res) => {
    if (!isDbConfigured()) {
        const v = mockVendors.find(vend => vend.id === req.params.id) || mockVendors[0];
        return res.json(v);
    }
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*, services(*), reviews(*)')
        .eq('id', req.params.id)
        .single();
    if (error) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
});

// Get vendor by User ID (for dashboard)
router.get('/user/:userId', async (req, res) => {
    if (!checkDb(res)) return;

    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', req.params.userId)
        .single();

    // If no vendor profile exists yet, return null or appropriate status
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

    res.json(vendor);
});

// Create new vendor (Admin or Vendor Signup)
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    const { user_id, business_name, category, description, price_range, location, images } = req.body;

    const { data, error } = await supabase
        .from('vendors')
        .insert({
            user_id,
            business_name,
            category,
            description,
            price_range,
            location,
            images: images || [],
            is_verified: false
        })
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// Update vendor
router.put('/:id', async (req, res) => {
    if (!checkDb(res)) return;

    const { data, error } = await supabase
        .from('vendors')
        .update(req.body)
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete vendor
router.delete('/:id', async (req, res) => {
    if (!checkDb(res)) return;

    const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Vendor deleted successfully' });
});

// Update vendor profile (for current logged in vendor)
router.put('/profile', async (req, res) => {
    // In a real app, we would get the user ID from the auth token
    // For now, we'll assume it's passed or find it based on the user_id in the body
    if (!isDbConfigured()) {
        return res.json({ message: 'Mock profile updated successfully' });
    }

    const { businessName, category, description, location, phone } = req.body;

    // This logic assumes we know which vendor it is. 
    // Usually handled by middleware that sets req.user or similar.
    const { data, error } = await supabase
        .from('vendors')
        .update({
            business_name: businessName,
            category,
            description,
            location,
            phone
        })
        .eq('user_id', req.body.user_id || 'demo-user-123') // Fallback for demo
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Get vendor bookings
router.get('/bookings', async (req, res) => {
    if (!isDbConfigured()) {
        return res.json([
            {
                id: 'b1',
                userName: 'Sarah Jones',
                serviceName: 'Full Day Photography',
                date: '2024-06-15',
                price: 1500,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            },
            {
                id: 'b2',
                userName: 'Michael Smith',
                serviceName: 'Engagement Session',
                date: '2024-05-20',
                price: 450,
                status: 'pending',
                createdAt: new Date().toISOString()
            }
        ]);
    }

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            status,
            price,
            created_at,
            date,
            services(name),
            users(full_name)
        `)
        // Filter by vendor_id - in real app would get from req.user
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Transform to match frontend expectations
    const transformed = data.map(b => ({
        id: b.id,
        status: b.status,
        price: b.price,
        createdAt: b.created_at,
        date: b.date,
        serviceName: b.services?.name || 'Unknown Service',
        userName: b.users?.full_name || 'Anonymous'
    }));

    res.json(transformed);
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
    if (!isDbConfigured()) {
        return res.json({ message: 'Status updated successfully' });
    }

    const { status } = req.body;
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

export default router;
