// Supabase Configuration
// Inko apne real credentials se replace karein
const SUPABASE_URL = 'https://leeildsotoqjakirlqsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZWlsZHNvdG9xamFraXJscXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjEyNzEsImV4cCI6MjA5NTEzNzI3MX0.0dxnUHBD-4RyBEQlCGhFjZKd0kA4aRUyOmo3cGhxYjc';

// Supabase Client initialize karein
// Note: Humne index.html mein CDN include kiya hai, isliye 'supabase' global available hai
export const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Shared Database Helper Functions
 * Inhe hum future modules mein use karenge
 */
export const db = {
    // Kisi bhi table se data fetch karne ke liye generic function
    async getAll(table) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw error;
        return data;
    },

    // Single record fetch karne ke liye
    async getById(table, id) {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // Data insert karne ke liye
    async insert(table, payload) {
        const { data, error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
        return data;
    }
};
