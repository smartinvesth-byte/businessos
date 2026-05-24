import { getSupabase } from '../database/supabase.js';

export const auth = {
    // 1. MASTER SIGNUP (Fixed and Function Re-added)
    async signUp(email, password, userData) {
        const supabase = getSupabase();
        
        // Step A: Auth Account
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email, password
        });

        if (authError) throw authError;
        const user = authData.user;

        if (user) {
            // Step B: Create Profile
            const { error: profileError } = await supabase.from('profiles').insert([{
                id: user.id,
                full_name: userData.fullName,
                gender: userData.gender,
                dob: userData.dob,
                phone: userData.phone
            }]);
            if (profileError) throw profileError;

            // Step C: Create Business
            const { data: bizData, error: bizError } = await supabase.from('businesses').insert([{
                owner_id: user.id,
                business_name: userData.businessName,
                business_category: userData.category
            }]).select().single();
            if (bizError) throw bizError;

            // Step D: Link Admin
            await supabase.from('business_members').insert([{
                business_id: bizData.id,
                user_id: user.id,
                role: 'admin'
            }]);

            // Step E: 7-Day Trial
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            await supabase.from('subscriptions').insert([{
                business_id: bizData.id,
                plan_type: 'free',
                status: 'active',
                expiry_date: expiry.toISOString()
            }]);

            return { user, business: bizData };
        }
    },

    async login(email, password) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async logout() {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    async checkSession() {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        const path = window.location.pathname;
        const isAuthPage = path.includes('login.html') || path.includes('signup.html');

        if (session && isAuthPage) {
            window.location.href = 'dashboard.html';
        } else if (!session && !isAuthPage && !path.endsWith('index.html') && path !== '/') {
            window.location.href = 'login.html';
        }
        return session;
    }
};

export const initAuth = async () => {
    try {
        await auth.checkSession();
    } catch (e) { console.error(e); }
    finally {
        const loader = document.getElementById('app-loader');
        if (loader) loader.style.display = 'none';
        const app = document.getElementById('app');
        if (app) app.style.display = 'block';
    }
};
