// core/auth.js

import { getSupabase } from '../database/supabase.js';

export const auth = {
    // ... baki functions (signUp, login, logout) wahi rakhein jo pehle diye the ...

    async checkSession() {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        
        const path = window.location.pathname;
        // Check if current page is Auth or Home
        const isAuthPage = path.includes('login.html') || path.includes('signup.html');
        const isHomePage = path.endsWith('index.html') || path === '/' || path.endsWith('vercel.app/');

        if (session) {
            // Logged in: Agar login/signup ya index par hai toh Dashboard bhejo
            if (isAuthPage || isHomePage) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Not Logged in: Agar dashboard ya index par hai toh Login bhejo
            if (!isAuthPage) {
                window.location.href = 'login.html';
            }
        }
        
        return session;
    }
};

// INITIALIZE AUTH UI
export const initAuth = async () => {
    try {
        console.log("Checking session status...");
        await auth.checkSession();
    } catch (error) {
        console.error("Auth Init Error:", error);
        // Force redirect to login if everything fails
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    } finally {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
};
