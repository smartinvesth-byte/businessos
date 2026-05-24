// database/supabase.js

const SUPABASE_URL = 'https://leeildsotoqjakirlqsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZWlsZHNvdG9xamFraXJscXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjEyNzEsImV4cCI6MjA5NTEzNzI3MX0.0dxnUHBD-4RyBEQlCGhFjZKd0kA4aRUyOmo3cGhxYjc'; // <--- APNI KEY YAHAN REHNE DEIN

let client = null;

export const getSupabase = () => {
    if (!client) {
        if (!window.supabase) {
            throw new Error("Supabase library not found");
        }
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return client;
};

// Compatibility export
export const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
