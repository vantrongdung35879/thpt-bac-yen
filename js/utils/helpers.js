/**
 * Helper utilities
 */

const Helpers = {
    formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },

    formatDateInput(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    },

    getTokenFromURL() {
        return new URLSearchParams(location.search).get('token');
    },

    debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    },

    createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') el.className = value;
            else if (key === 'textContent') el.textContent = value;
            else if (key === 'innerHTML') el.innerHTML = value;
            else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
            else if (key === 'dataset') Object.assign(el.dataset, value);
            else el.setAttribute(key, value);
        }
        for (const child of children) {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else if (child) el.appendChild(child);
        }
        return el;
    },

    timeAgo(isoStr) {
        if (!isoStr) return '--';
        const diff = Date.now() - new Date(isoStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'V\u1EEBa xong';
        if (mins < 60) return `${mins} ph\u00fat tr\u01B0\u1EDBc`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} gi\u1EDD tr\u01B0\u1EDBc`;
        const days = Math.floor(hrs / 24);
        return `${days} ng\u00e0y tr\u01B0\u1EDBc`;
    },

    generateToken() {
        return 'TOKEN_' + Math.random().toString(36).substr(2, 8).toUpperCase();
    }
};
