// database/supabase.js

const SUPABASE_URL = 'https://leeildsotoqjakirlqsx.supabase.co';
// NICHE WALI LINE MEIN APNI REAL ANON KEY PASTE KAREIN (Jo eyJ... se shuru hoti hai)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZWlsZHNvdG9xamFraXJscXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjEyNzEsImV4cCI6MjA5NTEzNzI3MX0.0dxnUHBD-4RyBEQlCGhFjZKd0kA4aRUyOmo3cGhxYjc'; 

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
    async getAll(table) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw error;
        return data;
    },
    async insert(table, payload) {
        const { data, error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
        return data;
    }
};
