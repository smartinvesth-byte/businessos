// 1. Sirf base URL rakhein (REST path hata dein)
const SUPABASE_URL = 'https://leeildsotoqjakirlqsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Pura key yahan rahega

// 2. Variable name badal dein ya window object use karein conflict se bachne ke liye
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
    async getAll(table) {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw error;
        return data;
    },
    async getById(table, id) {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },
    async insert(table, payload) {
        const { data, error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
        return data;
    }
};
