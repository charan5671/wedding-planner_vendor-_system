import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

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

const checkDb = (res) => {
    if (!isDbConfigured()) {
        res.status(503).json({ message: 'Database not connected. Please configure .env' });
        return false;
    }
    return true;
};

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!isDbConfigured()) {
        return res.status(201).json({
            user: {
                id: 'mock_' + Date.now(),
                name,
                email,
                role: role || 'couple'
            }
        });
    }

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                role: role || 'couple'
            }
        }
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // 2. Profile is automatically created via trigger in our schema!
    // But for immediate response consistency:
    const userProfile = {
        id: authData?.user?.id || 'mock_user_id',
        name: name,
        email: email,
        role: role || 'couple'
    };

    res.status(201).json({ user: userProfile });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Fallback for demo/missing config
    if (!isDbConfigured()) {
        if (email === 'admin@bliss.com' && password === 'admin123') {
            return res.json({
                user: {
                    id: 'admin_mock_id',
                    name: 'Platform Admin',
                    email: 'admin@bliss.com',
                    role: 'admin'
                }
            });
        }
        if (email === 'vendor@bliss.com' && password === 'vendor123') {
            return res.json({
                user: {
                    id: 'vendor_mock_id',
                    name: 'Premium Vendor',
                    email: 'vendor@bliss.com',
                    role: 'vendor'
                }
            });
        }
        return res.status(401).json({ message: 'Invalid credentials. Use admin@bliss.com/admin123 or vendor@bliss.com/vendor123 for demo.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) return res.status(401).json({ message: 'Invalid credentials' });

    // Fetch Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError) return res.status(500).json({ message: 'Error fetching profile' });

    res.json({
        user: {
            id: profile.id,
            name: profile.full_name || 'User',
            email: profile.email,
            role: profile.role
        }
    });
});

export default router;
