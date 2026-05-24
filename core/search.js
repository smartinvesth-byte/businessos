/**
 * Search Engine
 * Purpose: Global search across different data modules
 */

export const Search = {
    // 1. Search in a local array (Fast/Offline search)
    // Usage: Search.local(customers, 'ali', ['name', 'phone'])
    local(data, query, keys) {
        if (!query) return data;
        const term = query.toLowerCase().trim();
        
        return data.filter(item => {
            return keys.some(key => {
                const value = item[key];
                return value && String(value).toLowerCase().includes(term);
            });
        });
    },

    // 2. Debounce Function (To prevent too many API calls)
    debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    },

    // 3. Highlight Search Term (UI Helper)
    highlight(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<mark class="search-highlight">$1</mark>`);
    }
};
