// database/supabase.js

const SUPABASE_URL = 'https://leeildsotoqjakirlqsx.supabase.co';
const SUPABASE_ANON_KEY = 'YAHAN_APNI_ANON_KEY_DALEIN'; // Screenshot 3 wali 'anon' key copy karein

// window.supabase use karein taaki CDN library se conflict na ho
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
