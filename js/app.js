/**
 * Theme Manager
 */
const ThemeManager = {
    init() {
        const theme = Storage.getTheme();
        document.documentElement.setAttribute('data-theme', theme);
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        Storage.setTheme(next);
        this._updateToggleIcon(next);
    },

    _updateToggleIcon(theme) {
        const btn = document.getElementById('themeToggle');
        if (btn) btn.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
    },

    initToggle(btn) {
        if (!btn) return;
        const theme = Storage.getTheme();
        btn.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
        btn.addEventListener('click', () => this.toggle());
    }
};

/**
 * App Router
 */
const App = {
    async init() {
        ThemeManager.init();

        const path = location.pathname;
        const isAdmin = path.includes('admin');

        if (isAdmin) {
            await AdminPage.init();
        } else {
            await StudentPage.init();
        }
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
