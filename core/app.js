import { Router } from './router.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';

/**
 * Main Application Controller
 */
const App = {
    async init() {
        console.log("Business Brain OS Initializing...");
        
        // Run Security Check
        await Router.checkAccess();

        // Handle Online/Offline UI
        window.addEventListener('online', () => UI.showToast("Back Online", "success"));
        window.addEventListener('offline', () => UI.showToast("You are offline. Data will sync later.", "error"));

        // Global Lucide Icons init (if available)
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => App.init());

export default App;
