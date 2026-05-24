import { supabase } from '../database/supabase.js';

export const auth = {
    // 1. Signup Function
    async signUp(email, password, fullName) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'admin' // Default role for creator
                }
            }
        });
        if (error) throw error;
        return data;
    },

    // 2. Login Function
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    // 3. Logout Function
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        window.location.href = 'login.html';
    },

    // 4. Get Current User / Session
    async getUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // 5. Session Management (Auto Redirect)
    async checkSession() {
        const user = await this.getUser();
        const currentPage = window.location.pathname;

        if (user) {
            // Agar user logged in hai aur login/signup page par hai, to dashboard bhejo
            if (currentPage.includes('login.html') || currentPage.includes('signup.html') || currentPage.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Agar user logged in nahi hai aur dashboard par jane ki koshish kare, to login bhejo
            if (currentPage.includes('dashboard.html')) {
                window.location.href = 'login.html';
            }
        }
    }
};

// Global Initialization
export const initAuth = async () => {
    await auth.checkSession();
    // Loader hatane ke liye (index.html logic)
    const loader = document.getElementById('app-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            const app = document.getElementById('app');
            if(app) app.style.display = 'block';
        }, 500);
    }
};
