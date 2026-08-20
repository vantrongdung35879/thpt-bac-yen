/**
 * LocalStorage wrapper
 */

const Storage = {
    get(key) {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : null;
        } catch { return null; }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch { /* Storage full */ }
    },

    remove(key) {
        try { localStorage.removeItem(key); } catch { /* */ }
    },

    getTheme() {
        return this.get(CONFIG.STORAGE_KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        this.set(CONFIG.STORAGE_KEYS.THEME, theme);
    },

    saveDraft(studentId, data) {
        const drafts = this.get(CONFIG.STORAGE_KEYS.FORM_DRAFT) || {};
        drafts[studentId] = { data, savedAt: new Date().toISOString() };
        this.set(CONFIG.STORAGE_KEYS.FORM_DRAFT, drafts);
    },

    getDraft(studentId) {
        const drafts = this.get(CONFIG.STORAGE_KEYS.FORM_DRAFT) || {};
        return drafts[studentId] || null;
    },

    clearDraft(studentId) {
        const drafts = this.get(CONFIG.STORAGE_KEYS.FORM_DRAFT) || {};
        delete drafts[studentId];
        this.set(CONFIG.STORAGE_KEYS.FORM_DRAFT, drafts);
    }
};
