/**
 * Auth Service - X\u00e1c th\u1ef1c ng\u01b0\u1eddi d\u00f9ng
 */

const AuthService = {
    async getStudentByToken(token) {
        if (!token || token.trim() === '') {
            throw new ApiError('NO_TOKEN', 'Vui l\u00f2ng cung c\u1ea5p token truy c\u1eadp');
        }
        return await api.getStudentByToken(token);
    },

    async adminLogin(username, password) {
        return await api.adminLogin(username, password);
    },

    isAdminLoggedIn() {
        const session = Storage.get(CONFIG.STORAGE_KEYS.SESSION);
        return !!(session && session.username);
    },

    logout() {
        Storage.remove(CONFIG.STORAGE_KEYS.SESSION);
    }
};
