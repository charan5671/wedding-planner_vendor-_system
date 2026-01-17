import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// --- RBAC MIDDLEWARE ---
const isAdmin = (req, res, next) => {
    // In production, this would verify a JWT. 
    // For this implementation, we check the X-User-Role header.
    const role = req.headers['x-user-role'];
    if (role === 'admin' || !isDbConfigured()) {
        // Allowing if role is admin OR if we are in mock mode without DB 
        // (but ideally we still want to enforce role even in mock mode)
        if (role === 'admin') return next();
        if (!isDbConfigured() && !role) {
            // If no role and no DB, we might want to still allow for initial setup,
            // but per user request "strict RBAC", we'll be strict.
        }
    }

    if (role === 'admin') return next();

    console.warn(`[403] Access denied for role: ${role}`);
    res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
};

// Apply isAdmin to all routes EXCEPT /login
router.use((req, res, next) => {
    if (req.path === '/login') return next();
    isAdmin(req, res, next);
});

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_KEY || 'placeholder'
);

// Helper to check connection
const isDbConfigured = () => {
    return process.env.SUPABASE_URL &&
        process.env.SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' &&
        process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
};

// Helper for mock data
const mockStats = {
    totalUsers: 124,
    totalVendors: 45,
    totalBookings: 89,
    totalRevenue: 15400,
    pendingVendors: 3,
    confirmedBookings: 62,
    averageRating: 4.8
};

const mockUsers = [
    { id: '1', full_name: 'John Doe', email: 'john@example.com', role: 'couple', is_suspended: false, created_at: new Date().toISOString() },
    { id: '2', full_name: 'Jane Smith', email: 'jane@vendor.com', role: 'vendor', is_suspended: false, created_at: new Date().toISOString() },
    { id: 'admin_mock_id', full_name: 'Platform Admin', email: 'admin@bliss.com', role: 'admin', is_suspended: false, created_at: new Date().toISOString() }
];

const mockVendors = [
    { id: 'v1', business_name: 'Elegant Florals', category: 'Florist', location: 'New York', is_verified: true },
    { id: 'v2', business_name: 'Classic Catering', category: 'Catering', location: 'Chicago', is_verified: false },
    { id: 'v3', business_name: 'Dream Photography', category: 'Photography', location: 'Los Angeles', is_verified: true }
];

const mockBookings = [
    {
        id: 'b1',
        user_id: '1',
        vendor_id: 'v1',
        userName: 'John Doe',
        vendorName: 'Elegant Florals',
        date: new Date().toISOString(),
        status: 'confirmed',
        total_amount: 1200,
        created_at: new Date().toISOString(),
        vendor: { business_name: 'Elegant Florals' },
        user: { full_name: 'John Doe' }
    },
    {
        id: 'b2',
        user_id: '1',
        vendor_id: 'v2',
        userName: 'John Doe',
        vendorName: 'Classic Catering',
        date: new Date().toISOString(),
        status: 'pending',
        total_amount: 2500,
        created_at: new Date().toISOString(),
        vendor: { business_name: 'Classic Catering' },
        user: { full_name: 'John Doe' }
    }
];

const mockReports = [
    { id: 'r1', reporter_id: '1', target_vendor_id: 'v1', reason: 'Service not as described', description: 'The flowers were wilted', status: 'pending', created_at: new Date().toISOString() }
];

// Helper to emit real-time updates
const emitUpdate = (req, event, data) => {
    const io = req.app.get('io');
    if (io) {
        io.emit(event, data);
        console.log(`Real-time event emitted: ${event}`, data);
    }
};

// Admin login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!isDbConfigured()) {
        if (email === 'admin@bliss.com' && password === 'admin123') {
            return res.json({ admin: { id: 'admin_mock_id', name: 'Platform Admin', email } });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return res.status(401).json({ message: 'Invalid credentials' });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
    if (profile?.role !== 'admin') return res.status(403).json({ message: 'Access denied: Not an admin' });

    res.json({ admin: { id: data.user.id, email: data.user.email } });
});

// Get all users
router.get('/users', async (req, res) => {
    if (!isDbConfigured()) return res.json(mockUsers);
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
    const { role } = req.body;
    if (!isDbConfigured()) {
        emitUpdate(req, 'user-status-changed', { userId: req.params.id, role });
        return res.json({ id: req.params.id, role });
    }
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    emitUpdate(req, 'user-status-changed', { userId: req.params.id, role });
    res.json(data);
});

// Update user suspension status
router.patch('/users/:id/status', async (req, res) => {
    const { is_suspended } = req.body;
    if (!isDbConfigured()) {
        emitUpdate(req, 'user-status-changed', { userId: req.params.id, is_suspended });
        return res.json({ id: req.params.id, is_suspended });
    }
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_suspended })
        .eq('id', req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });

    emitUpdate(req, 'user-status-changed', { userId: req.params.id, is_suspended });
    res.json(data);
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    if (!isDbConfigured()) return res.json({ message: 'User deleted' });
    const { error } = await supabase.auth.admin.deleteUser(req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'User deleted' });
});

// Get all vendors
router.get('/vendors', async (req, res) => {
    if (!isDbConfigured()) return res.json(mockVendors);
    const { data, error } = await supabase.from('vendors').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update vendor details
router.patch('/vendors/:id', async (req, res) => {
    if (!isDbConfigured()) return res.json({ id: req.params.id, ...req.body });
    const { data, error } = await supabase.from('vendors').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    emitUpdate(req, 'vendor-status-changed', { vendorId: req.params.id, ...req.body });
    res.json(data);
});

// Approve vendor
router.patch('/vendors/:id/approve', async (req, res) => {
    if (!isDbConfigured()) return res.json({ id: req.params.id, is_verified: true });
    const { data, error } = await supabase.from('vendors').update({ is_verified: true }).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Delete vendor
router.delete('/vendors/:id', async (req, res) => {
    if (!isDbConfigured()) return res.json({ message: 'Vendor deleted' });
    const { error } = await supabase.from('vendors').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Vendor deleted' });
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    if (!isDbConfigured()) return res.json(mockBookings);
    const { data, error } = await supabase.from('bookings').select('*, vendor:vendors(business_name), user:profiles(full_name)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res) => {
    if (!isDbConfigured()) {
        emitUpdate(req, 'booking-updated', { bookingId: req.params.id, status: req.body.status });
        return res.json({ id: req.params.id, status: req.body.status });
    }
    const { data, error } = await supabase.from('bookings').update({ status: req.body.status }).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });

    emitUpdate(req, 'booking-updated', { bookingId: req.params.id, status: req.body.status });
    res.json(data);
});

// Delete booking
router.delete('/bookings/:id', async (req, res) => {
    if (!isDbConfigured()) return res.json({ message: 'Booking deleted' });
    const { error } = await supabase.from('bookings').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Booking deleted' });
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
    if (!isDbConfigured()) return res.json(mockStats);

    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: vendorsCount } = await supabase.from('vendors').select('*', { count: 'exact', head: true });
    const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    const { data: confirmedBookings } = await supabase.from('bookings').select('total_amount').eq('status', 'confirmed');
    const totalRevenue = confirmedBookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

    res.json({
        totalUsers: usersCount || 0,
        totalVendors: vendorsCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue,
        pendingVendors: 0,
        confirmedBookings: confirmedBookings?.length || 0,
        averageRating: 4.5
    });
});

// --- REPORT MANAGEMENT ---

// Get all reports
router.get('/reports', async (req, res) => {
    if (!isDbConfigured()) return res.json(mockReports);
    const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:profiles!reports_reporter_id_fkey(full_name), target_vendor:vendors(business_name), target_user:profiles!reports_target_user_id_fkey(full_name)')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update report status
router.patch('/reports/:id', async (req, res) => {
    const { status, admin_notes } = req.body;
    if (!isDbConfigured()) {
        return res.json({ id: req.params.id, status, admin_notes });
    }
    const { data, error } = await supabase
        .from('reports')
        .update({ status, admin_notes })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });

    emitUpdate(req, 'report-updated', data);
    res.json(data);
});

export default router;
