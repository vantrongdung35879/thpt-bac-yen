/**
 * Student Service - Qu\u1ea3n l\u00fd d\u1eef li\u1ec7u h\u1ecdc sinh
 */

const StudentService = {
    /**
     * T\u00ecm c\u00e1c tr\u01b0\u1eddng th\u1iếu c\u1ee7a h\u1ecdc sinh
     * Tr\u1ea3 v\u1ec1 m\u1ea3ng ch\u1ec9a key c\u1ee7a c\u00e1c tr\u01b0\u1eddng ch\u01b0a \u0111\u01b0\u1ee3c \u0111i\u1ec1n
     */
    getMissingFields(student) {
        const missing = [];

        // Check basic fields
        const basicFields = ['email', 'address', 'phone'];
        for (const field of basicFields) {
            const val = student[field];
            if (val === null || val === undefined || String(val).trim() === '') {
                missing.push(field);
            }
        }

        // Check subjects (except math which is pre-filled)
        const subjectFields = ['english', 'physics', 'chemistry', 'biology', 'history', 'geography'];
        for (const field of subjectFields) {
            if (!student.subjects[field]) {
                missing.push(field);
            }
        }

        return missing;
    },

    /**
     * T\u00ednh t\u1ef7 l\u1ec7 ho\u00e0n th\u00e0nh
     */
    getCompletionPercentage(student) {
        const totalFields = 9; // email, address, phone + 6 subjects
        const completedFields = totalFields - this.getMissingFields(student).length;
        return Math.round((completedFields / totalFields) * 100);
    },

    /**
     * L\u01b0u d\u1eef li\u1ec7u h\u1ecdc sinh
     */
    async saveStudent(studentId, data) {
        const { valid, errors } = Validators.validateAll(data);
        if (!valid) {
            throw { type: 'VALIDATION', errors };
        }
        return await api.updateStudent(studentId, data);
    },

    /**
     * L\u1ea5y t\u1ea5t c\u1ea3 h\u1ecdc sinh (admin)
     */
    async getAllStudents() {
        return await api.getStudents();
    },

    /**
     * L\u1ea5y th\u1ed1ng k\u00ea (admin)
     */
    async getStats() {
        return await api.getStats();
    },

    /**
     * Filter students
     */
    filterStudents(students, { search = '', statusFilter = 'all', classFilter = 'all' } = {}) {
        return students.filter(s => {
            // Search filter
            if (search) {
                const q = search.toLowerCase();
                const matchName = s.name.toLowerCase().includes(q);
                const matchId = s.id.toLowerCase().includes(q);
                const matchClass = s.className.toLowerCase().includes(q);
                if (!matchName && !matchId && !matchClass) return false;
            }
            // Status filter
            if (statusFilter === 'completed' && s.status !== 'completed') return false;
            if (statusFilter === 'incomplete' && s.status !== 'incomplete') return false;
            // Class filter
            if (classFilter !== 'all' && s.className !== classFilter) return false;
            return true;
        });
    }
};
