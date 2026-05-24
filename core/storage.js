/**
 * Storage Engine
 * Handles LocalStorage, Caching, and Offline Data
 */
export const Storage = {
    // 1. Save data locally
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(`bbos_${key}`, serializedValue);
        } catch (e) {
            console.error("Error saving to local storage", e);
        }
    },

    // 2. Get data locally
    get(key) {
        try {
            const value = localStorage.getItem(`bbos_${key}`);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error("Error reading from local storage", e);
            return null;
        }
    },

    // 3. Remove data
    remove(key) {
        localStorage.removeItem(`bbos_${key}`);
    },

    // 4. Offline Queue (For syncing later)
    addToQueue(action, table, data) {
        const queue = this.get('sync_queue') || [];
        queue.push({ action, table, data, timestamp: Date.now() });
        this.set('sync_queue', queue);
        console.log("Action added to offline queue");
    },

    // 5. Check Online Status
    isOnline() {
        return window.navigator.onLine;
    }
};
