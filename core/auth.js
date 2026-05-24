import { getSupabase } from '../database/supabase.js';

export const auth = {
    // 1. MASTER SIGNUP: Creating User, Profile, Business, Member, and Subscription
    async signUp(email, password, userData) {
        const supabase = getSupabase();
        
        // Auth account create karein
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;
        const user = authData.user;

        if (user) {
            try {
                // Profile entry
                const { error: profileError } = await supabase.from('profiles').insert([{
                    id: user.id,
                    full_name: userData.fullName,
                    gender: userData.gender,
                    dob: userData.dob,
                    phone: userData.phone
                }]);
                if (profileError) throw profileError;

                // Business entry
                const { data: bizData, error: bizError } = await supabase.from('businesses').insert([{
                    owner_id: user.id,
                    business_name: userData.businessName,
                    business_category: userData.category
                }]).select().single();
                if (bizError) throw bizError;

                // Make Admin
                const { error: memberError } = await supabase.from('business_members').insert([{
                    business_id: bizData.id,
                    user_id: user.id,
                    role: 'admin'
                }]);
                if (memberError) throw memberError;

                // Start 7-Day Trial
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);
                
                const { error: subError } = await supabase.from('subscriptions').insert([{
                    business_id: bizData.id,
                    plan_type: 'free',
                    status: 'active',
                    expiry_date: expiry.toISOString()
                }]);
                if (subError) throw subError;

                return { user, business: bizData };

            } catch (err) {
                console.error("Signup Process Error:", err);
                throw new Error("Setup failed: " + err.message);
            }
        }
    },

    // 2. LOGIN
    async login(email, password) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    // 3. LOGOUT
    async logout() {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    // 4. CHECK SESSION & REDIRECT
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

// 5. INITIALIZE AUTH UI
export const initAuth = async () => {
    try {
        console.log("Initializing Auth Engine...");
        await auth.checkSession();
    } catch (error) {
        console.error("Auth Init Error:", error);
    } finally {
        // Sab kuch hone ke baad loader hatao
        const loader = document.getElementById('app-loader');
        const app = document.getElementById('app');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (app) app.style.display = 'block';
            }, 500);
        }
    }
};
