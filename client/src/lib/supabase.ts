import { createClient } from '@supabase/supabase-js';

// These environment variables will be provided by the user
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE' && supabaseUrl !== 'https://placeholder.supabase.co';

if (!isSupabaseConfigured) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Create client with fallback values if missing to prevent immediate crash, 
// but queries will fail if not configured
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
