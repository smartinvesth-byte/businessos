/**
 * UI Component Engine
 * Handles common UI interactions across all modules
 */

export const UI = {
    // 1. Show Toast Notification
    showToast(message, type = 'info') {
        let toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.display = 'block';
        toast.innerHTML = message;
        
        if(type === 'error') toast.style.borderLeftColor = 'var(--danger)';
        if(type === 'success') toast.style.borderLeftColor = 'var(--success)';

        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    // 2. Open Bottom Sheet
    openSheet(sheetId) {
        const sheet = document.getElementById(sheetId);
        if(sheet) sheet.classList.add('active');
    },

    closeSheet(sheetId) {
        const sheet = document.getElementById(sheetId);
        if(sheet) sheet.classList.remove('active');
    },

    // 3. Loading State for Buttons
    setLoading(btnId, isLoading) {
        const btn = document.getElementById(btnId);
        if(!btn) return;
        
        if(isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = `<div class="spinner" style="width:20px; height:20px;"></div>`;
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.originalText;
            btn.disabled = false;
        }
    }
};
