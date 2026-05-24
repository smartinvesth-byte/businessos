import { getSupabase } from '../database/supabase.js';

export const auth = {
    // 1. Session Check & Redirection Logic
    async checkSession() {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        const path = window.location.pathname;
        const isAuthPage = path.includes('login.html') || path.includes('signup.html');
        const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('.app/');

        console.log("Current Session:", session ? "Logged In" : "Logged Out");

        if (session) {
            // Logged in: Go to Dashboard if on Index or Login
            if (isAuthPage || isHomePage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Not Logged in: Go to Login if trying to access Dashboard or Index
            if (!isAuthPage) {
                window.location.href = 'login.html';
            }
        }
        return session;
    },

    // 2. Login
    async login(email, password) {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    // 3. Logout
    async logout() {
        const supabase = getSupabase();
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    }
};

// INITIALIZE AUTH ENGINE
export const initAuth = async () => {
    try {
        await auth.checkSession();
    } catch (error) {
        console.error("Critical Auth Error:", error);
    } finally {
        // Safe loader removal
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }
};
