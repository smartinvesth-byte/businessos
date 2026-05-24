import { supabase } from '../database/supabase.js';
import { UI } from './ui.js';

/**
 * Notification Engine
 * Purpose: Smart Alerts, Reminders, and In-App Notifications
 */

export const Notifications = {
    // 1. Send / Create a Notification
    async send(userId, { title, message, type = 'info' }) {
        const { error } = await supabase
            .from('notifications')
            .insert([{ 
                user_id: userId, 
                title, 
                message, 
                type, 
                is_read: false,
                created_at: new Date()
            }]);

        if (error) console.error("Notification Error:", error);
        
        // Show instant UI toast if active
        UI.showToast(`${title}: ${message}`, type);
    },

    // 2. Fetch Unread Notifications
    async fetchUnread(userId) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('is_read', false)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data;
    },

    // 3. Mark as Read
    async markAsRead(notificationId) {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);
    },

    // 4. Smart Recommendation Generator
    // Modules isey call karenge jab wo data update karenge
    generateSmartAlert(moduleName, data) {
        if (moduleName === 'inventory' && data.stock < data.minThreshold) {
            this.send(data.userId, {
                title: 'Low Stock Warning',
                message: `${data.itemName} is running low.`,
                type: 'warning'
            });
        }
    }
};
