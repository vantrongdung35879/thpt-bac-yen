/**
 * Toast Notification Component
 */

const Toast = {
    _container: null,

    _init() {
        if (!this._container) {
            this._container = document.createElement('div');
            this._container.id = 'toast-container';
            this._container.setAttribute('aria-live', 'polite');
            document.body.appendChild(this._container);
        }
    },

    show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        this._init();

        const icons = {
            success: '\u2705',
            error: '\u274C',
            warning: '\u26A0\uFE0F',
            info: '\u2139\uFE0F'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="\u0110\u00f3ng">&times;</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => this._remove(toast));

        this._container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('toast-show'));

        // Auto dismiss
        setTimeout(() => this._remove(toast), duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error', 5000); },
    warning(msg) { this.show(msg, 'warning', 4000); },
    info(msg) { this.show(msg, 'info'); },

    _remove(toast) {
        if (!toast || !toast.parentNode) return;
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }
};
