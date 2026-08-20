/**
 * Loading Component
 */

const Loading = {
    show(container, message = '\u0110ang t\u1ea3i d\u1eef li\u1ec7u...') {
        if (!container) return;
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner">
                    <div class="spinner-ring"></div>
                </div>
                <p class="loading-text">${message}</p>
            </div>
        `;
    },

    hide(container) {
        if (!container) return;
        const loading = container.querySelector('.loading-container');
        if (loading) loading.remove();
    }
};
