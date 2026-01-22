import express from 'express';
import http from 'http';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Import Routes
import adminRoutes from './routes/admin.js';
import vendorRoutes from './routes/vendors.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase;
const isPlaceholder = (url) => url === 'YOUR_SUPABASE_URL_HERE' || url === 'https://placeholder.supabase.co';

if (supabaseUrl && supabaseServiceKey && !isPlaceholder(supabaseUrl)) {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase Client Initialized');
} else {
    console.warn('⚠️ Supabase credentials missing or placeholder. Server will default to mock mode.');
    supabase = null;
}

app.use(cors({
    origin: ['http://localhost:5173', 'https://wedding-planner-system-trial.netlify.app', process.env.FRONTEND_URL],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/vendors', (req, res, next) => {
    req.supabase = supabase;
    next();
}, vendorRoutes);


// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: supabase ? 'connected' : 'mock'
    });
});

// --- CORE API ENDPOINTS (Bookings, Negotiation) ---

app.get('/api/bookings', async (req, res) => {
    if (!supabase) {
        // Fallback mock bookings
        const mockBookings = [
            { id: 'b1', user_id: '1', vendor_id: 'v1', status: 'confirmed', total_amount: 1200, created_at: new Date().toISOString(), vendor: { business_name: 'Elegant Florals' }, user: { full_name: 'John Doe' } },
            { id: 'b2', user_id: '1', vendor_id: 'v2', status: 'pending', total_amount: 2500, created_at: new Date().toISOString(), vendor: { business_name: 'Classic Catering' }, user: { full_name: 'John Doe' } }
        ];
        return res.json(mockBookings);
    }

    const { userId, vendorId } = req.query;
    let query = supabase.from('bookings').select('*, vendor:vendors(business_name), user:profiles(full_name)');

    if (userId) query = query.eq('user_id', userId);
    if (vendorId) query = query.eq('vendor_id', vendorId);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.patch('/api/bookings/:id', async (req, res) => {
    if (!supabase) {
        return res.json({ id: req.params.id, status: req.body.status });
    }
    const { status } = req.body;
    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', req.params.id)
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

app.get('/api/enquiries/vendor/:vendorId', async (req, res) => {
    if (!supabase) {
        return res.json([{
            id: 'e1',
            vendor_id: req.params.vendorId,
            userName: 'John Demo',
            userEmail: 'john@demo.com',
            message: 'Interested in your services!',
            status: 'pending',
            created_at: new Date().toISOString()
        }]);
    }
    const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('vendor_id', req.params.vendorId)
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/enquiries/:id', async (req, res) => {
    if (!supabase) {
        return res.json({
            id: req.params.id,
            userName: 'John Demo',
            userEmail: 'john@demo.com',
            message: 'Interested in your services!',
            status: 'pending',
            created_at: new Date().toISOString()
        });
    }
    const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .eq('id', req.params.id)
        .single();
    if (error) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(data);
});

app.post('/api/enquiries', async (req, res) => {
    if (!supabase) {
        return res.status(201).json({
            id: 'mock_e_' + Date.now(),
            ...req.body,
            status: 'pending',
            created_at: new Date().toISOString()
        });
    }
    const { vendorId, userId, message, userName, userEmail } = req.body;
    const { data, error } = await supabase.from('enquiries').insert({
        vendor_id: vendorId,
        user_id: userId,
        message,
        userName,
        userEmail
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

app.get('/api/messages/:contextId', async (req, res) => {
    if (!supabase) {
        return res.json([
            { id: 'm1', content: 'Hello, I have a question about your package.', sender_id: 'u1', created_at: new Date().toISOString() },
            { id: 'm2', content: 'Sure, how can I help?', sender_id: 'v1', created_at: new Date().toISOString() }
        ]);
    }
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`booking_id.eq.${req.params.contextId},enquiry_id.eq.${req.params.contextId}`)
        .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/negotiation/:id', async (req, res) => {
    if (!supabase) {
        return res.json({
            contextItem: {
                id: req.params.id,
                status: 'pending',
                userName: 'John Demo',
                userEmail: 'john@demo.com',
                message: 'Hello, looking for a package.',
                isEnquiry: true
            },
            messages: [
                { id: 'm1', content: 'Hello, I have a question about your package.', sender_id: 'u1', created_at: new Date().toISOString() },
                { id: 'm2', content: 'Sure, how can I help?', sender_id: 'v1', created_at: new Date().toISOString() }
            ]
        });
    }

    const bookingId = req.params.id;
    // ... rest of the logic

    // Check if it's a booking or an enquiry
    let { data: booking } = await supabase
        .from('bookings')
        .select(`*, vendor:vendors(*), user:profiles(*), service:services(*)`)
        .eq('id', bookingId)
        .single();

    if (!booking) {
        // Try enquiry
        const { data: enquiry } = await supabase
            .from('enquiries')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (enquiry) {
            // Transform enquiry to match contextItem expected by frontend
            booking = {
                id: enquiry.id,
                status: enquiry.status || 'pending',
                userId: enquiry.user_id,
                vendorId: enquiry.vendor_id,
                userName: enquiry.userName,
                userEmail: enquiry.userEmail,
                message: enquiry.message,
                isEnquiry: true
            };
        }
    }

    if (!booking) return res.status(404).json({ message: 'Context not found' });

    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`booking_id.eq.${bookingId},enquiry_id.eq.${bookingId}`)
        .order('created_at', { ascending: true });

    res.json({ contextItem: booking, messages });
});

app.post('/api/messages', async (req, res) => {
    const { bookingId, enquiryId, senderId, content, type, metadata } = req.body;

    if (!supabase) {
        // Mock Response
        const msg = {
            id: 'mock_msg_' + Date.now(),
            sender_id: senderId,
            content,
            type: type || 'text',
            metadata,
            created_at: new Date().toISOString()
        };
        return res.status(201).json(msg);
    }

    const { data, error } = await supabase.from('messages').insert({
        booking_id: bookingId || null,
        enquiry_id: enquiryId || null,
        sender_id: senderId,
        content,
        type: type || 'text',
        metadata: metadata || null
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });

    // Handle Status Changes via Database Actions (which trigger Realtime)
    if (type === 'acceptance') {
        if (bookingId) {
            await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', bookingId);
        } else if (enquiryId) {
            await supabase.from('enquiries').update({ status: 'confirmed' }).eq('id', enquiryId);
        }
    }

    res.status(201).json(data);
});


// --- REAL-TIME SERVER ---
const server = http.createServer(app);

// --- CATCH-ALL FOR DIAGNOSTICS ---
app.use((req, res) => {
    console.warn(`[404] Unmatched request: ${req.method} ${req.url}`);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.url,
        hint: 'Check if the API prefix /api is present and the server is running on port 3002'
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
