import { supabase } from '../database/supabase.js';

export const auth = {
    // Master Signup: Sabhi foundation tables ko ek saath fill karta hai
    async signUp(email, password, userData) {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;
        const user = authData.user;

        if (user) {
            try {
                // 2. Create Profile
                const { error: profileError } = await supabase.from('profiles').insert([{
                    id: user.id,
                    full_name: userData.fullName,
                    gender: userData.gender,
                    dob: userData.dob,
                    phone: userData.phone
                }]);
                if (profileError) throw profileError;

                // 3. Create First Business
                const { data: bizData, error: bizError } = await supabase.from('businesses').insert([{
                    owner_id: user.id,
                    business_name: userData.businessName,
                    business_category: userData.category
                }]).select().single();
                if (bizError) throw bizError;

                // 4. Make User an ADMIN of this business
                const { error: memberError } = await supabase.from('business_members').insert([{
                    business_id: bizData.id,
                    user_id: user.id,
                    role: 'admin'
                }]);
                if (memberError) throw memberError;

                // 5. Start 7-Day Free Trial
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 7); // Add 7 days
                
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
                throw new Error("Account created but setup failed. Please contact support.");
            }
        }
    },

    // Simple Login
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    // Logout
    async logout() {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    },

    // Session Check
    async checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    }
// core/auth.js ke last mein initAuth ko replace karein

export const initAuth = async () => {
    try {
        console.log("Checking session...");
        await auth.checkSession();
    } catch (error) {
        console.error("Auth Error:", error);
    } finally {
        // Yeh block hamesha chalega, chahe error aaye ya nahi
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                const app = document.getElementById('app');
                if(app) app.style.display = 'block';
            }, 500);
        }
    }
};
