import { supabase } from '../database/supabase.js';
import { Storage } from './storage.js';
import { UI } from './ui.js';

/**
 * Sync Engine
 * Purpose: Background data synchronization and conflict resolution
 */

export const Sync = {
    isSyncing: false,

    // 1. Run Sync Process
    async run() {
        if (this.isSyncing || !Storage.isOnline()) return;
        
        const queue = Storage.get('sync_queue') || [];
        if (queue.length === 0) return;

        console.log(`Syncing ${queue.length} pending actions...`);
        this.isSyncing = true;
        
        const remainingQueue = [];

        for (const item of queue) {
            try {
                const { action, table, data } = item;
                
                if (action === 'INSERT') {
                    await supabase.from(table).insert([data]);
                } else if (action === 'UPDATE') {
                    await supabase.from(table).update(data).eq('id', data.id);
                } else if (action === 'DELETE') {
                    await supabase.from(table).delete().eq('id', data.id);
                }
            } catch (error) {
                console.error("Sync failed for item:", item, error);
                remainingQueue.push(item); // Retain if failed
            }
        }

        // Update queue with only items that failed
        Storage.set('sync_queue', remainingQueue);
        this.isSyncing = false;

        if (remainingQueue.length === 0) {
            UI.showToast("All data synced with cloud", "success");
        }
    },

    // 2. Auto-Sync Monitor
    init() {
        // Try syncing every time browser comes online
        window.addEventListener('online', () => this.run());
        
        // Check periodically (every 5 minutes)
        setInterval(() => this.run(), 5 * 60 * 1000);
    }
};
