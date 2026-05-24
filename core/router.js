import { supabase } from '../database/supabase.js';

/**
 * Router Engine
 * Manages route protection and role-based access
 */
export const Router = {
    // List of pages that don't require login
    publicPages: ['/login.html', '/signup.html', '/index.html', '/'],

    async checkAccess() {
        const { data: { session } } = await supabase.auth.getSession();
        const path = window.location.pathname;
        
        // Find if current path is a public page
        const isPublicPage = this.publicPages.some(page => path.endsWith(page));

        if (!session && !isPublicPage) {
            // Case 1: Not logged in and trying to access private page
            console.warn("Unauthorized access. Redirecting to login...");
            window.location.href = 'login.html';
        } 
        else if (session && isPublicPage) {
            // Case 2: Already logged in and trying to access login/signup page
            console.log("Already logged in. Redirecting to dashboard...");
            window.location.href = 'dashboard.html';
        }
    },

    /**
     * Role-Based Access Control (RBAC)
     * Use this in modules to restrict features
     */
    async getUserRole() {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.user_metadata?.role || 'staff'; // Default to staff
    },

    async restrictTo(allowedRoles) {
        const role = await this.getUserRole();
        if (!allowedRoles.includes(role)) {
            alert("Access Denied: You don't have permission for this action.");
            window.location.href = 'dashboard.html';
        }
    }
};

// Auto-run access check when router is imported
Router.checkAccess();
