/**
 * API Abstraction Layer
 * 
 * Interface chung cho mọi backend.
 * Khi muốn kết nối Google Apps Script,
 * chỉ cần tạo GoogleApiService implements相同的interface.
 * 
 * TODO: CONNECT TO GOOGLE APPS SCRIPT
 */

class ApiService {
    /**
     * Lấy thông tin học sinh theo token
     * @param {string} token 
     * @returns {Promise<Object>} student data
     */
    async getStudentByToken(token) {
        throw new Error('Not implemented');
    }

    /**
     * Cập nhật thông tin học sinh
     * @param {string} id 
     * @param {Object} data 
     * @returns {Promise<Object>} updated student
     */
    async updateStudent(id, data) {
        throw new Error('Not implemented');
    }

    /**
     * Lấy danh sách tất cả học sinh (Admin)
     * @returns {Promise<Array>}
     */
    async getStudents() {
        throw new Error('Not implemented');
    }

    /**
     * Lấy thống kê (Admin)
     * @returns {Promise<Object>}
     */
    async getStats() {
        throw new Error('Not implemented');
    }

    /**
     * Xuất dữ liệu học sinh
     * @returns {Promise<Blob>}
     */
    async exportStudents() {
        throw new Error('Not implemented');
    }

    /**
     * Xác thực admin
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async adminLogin(username, password) {
        throw new Error('Not implemented');
    }
}

// Singleton - export the active API service
const api = CONFIG.API_MODE === 'mock' 
    ? new MockApiService() 
    : new GoogleApiService(); // TODO: implement GoogleApiService
