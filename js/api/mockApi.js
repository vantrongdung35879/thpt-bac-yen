/**
 * MockApiService - Mo phong backend cho testing
 * 
 * Du lieu lay tu file Excel THPT Bac Yen lop 12A2.
 * Khi trien khai backend that, thay the bang GoogleApiService.
 * 
 * TODO: CONNECT TO GOOGLE APPS SCRIPT
 */

class MockApiService extends ApiService {
    constructor() {
        super();
        this._students = this._initStudents();
        this._adminSession = null;
        this._loadFromStorage();
    }

    _generateToken(id) {
        return 'TOKEN_' + id.replace('HS', '').padStart(3, '0') + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    _initStudents() {
        const rawStudents = [
            { name: "Nguy\u1EC5n Minh \u0110\u1EE9c", email: "duc@gmail.com", birthDate: "2008-12-05", gender: "Nam", grade: "12", address: "C\u1EA7u Gi\u1EA5y, H\u00e0 N\u1ed9i", phone: "904444444", className: "12A1", subjects: { math: true, english: true, physics: true, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Th\u1ECB B\u1EA3o Ch\u00e2m", email: "", birthDate: "2009-02-14", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Su\u1ED1i C\u1EA3i, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Ho\u00e0ng Th\u1ECB B\u1EA3o Ch\u00e2n", email: "", birthDate: "2009-12-20", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Su\u1ED1i Nh\u1EADn, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "V\u00ec Th\u1ECB Di\u1EC5m", email: "", birthDate: "2009-09-03", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n P\u1EAFc Ng\u00e0, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u00F2 Th\u1EE7y \u0110\u1ECBu", email: "", birthDate: "2009-12-25", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n \u0110ung Gi\u00e0ng, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB \u0110\u01A1n", email: "", birthDate: "2009-01-20", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n M\u00F4ng, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u1EE9 Ng\u1ECDc Thanh Giang", email: "", birthDate: "2009-01-22", gender: "Nam", grade: "12", address: "B\u1EA3n T\u00e2n Ti\u1EBFn, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Qu\u00e0ng V\u0103n Hi\u1EC1n", email: "", birthDate: "2009-12-09", gender: "Nam", grade: "12", address: "B\u1EA3n T\u00e2n Ti\u1EBFn, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "M\u0169a A H\u1ED3ng", email: "", birthDate: "2009-07-20", gender: "Nam", grade: "12", address: "B\u1EA3n T\u00e0 \u0110\u00F2, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "H\u00e0 Th\u1ECB Khanh Huy\u1EC1n", email: "", birthDate: "2009-10-29", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n L\u1EE9m Th\u01B0\u1EE3ng B, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "M\u0169a A K\u00EAnh", email: "", birthDate: "2009-11-10", gender: "Nam", grade: "12", address: "B\u1EA3n \u0110o\u00e0n K\u1EBFt, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Qu\u00e0ng Ng\u1ECDc Khu\u00EA", email: "", birthDate: "2009-11-28", gender: "Nam", grade: "12", address: "B\u1EA3n T\u00e2n Ti\u1EBFn, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "H\u1EA1ng A K\u00FD", email: "", birthDate: "2008-11-15", gender: "Nam", grade: "12", address: "B\u1EA3n L\u00e0ng Cao, x\u00e3 T\u00e0 X\u00faa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB Lan", email: "", birthDate: "2009-11-05", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n \u0110ung Gi\u00e0ng, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Ph\u00e0ng Th\u1ECB Mai Lan", email: "", birthDate: "2009-08-04", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Hang ch\u00fa, x\u00e3 X\u00edm V\u00e0ng", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u00F2 Th\u1ECB Kim Linh", email: "", birthDate: "2009-09-01", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Th\u01B0\u1EE3ng Ti\u1EBFn, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Th\u1ECB Kim M\u1EA1nh", email: "", birthDate: "2009-04-08", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Noong C\u00F3c, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB Linh Nh\u00e2m", email: "", birthDate: "2009-03-06", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Ng\u1EADm, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Th\u1ECB Y\u1EBFn Nhi", email: "", birthDate: "2009-09-19", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n P\u1EAFc Ng\u00e0, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Th\u00e0o A Ph\u1EE3", email: "", birthDate: "2009-08-07", gender: "Nam", grade: "12", address: "B\u1EA3n T\u00e0 X\u00faa, x\u00e3 T\u00e0 X\u00faa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "H\u1EDD Th\u1ECB Sen", email: "", birthDate: "2009-11-06", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Su\u1ED1i L\u00eanh, x\u00e3 X\u00edm V\u00e0ng", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Th\u1ECB Hoa Th\u1EAFng", email: "", birthDate: "2009-04-08", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Noong C\u00F3c, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "M\u0169a A Th\u1EAFng", email: "", birthDate: "2009-04-16", gender: "Nam", grade: "12", address: "B\u1EA3n Tr\u00F4ng D\u00EA, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "H\u1EA1ng Th\u1ECB Hoa Trang", email: "", birthDate: "2009-01-01", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n L\u00e0ng Cao, x\u00e3 T\u00e0 X\u00faa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "S\u01B0ng A V\u00e2m Trang", email: "", birthDate: "2009-07-26", gender: "Nam", grade: "12", address: "B\u1EA3n Su\u1ED1i C\u1EA3i, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "M\u0169i V\u0103n Trung", email: "", birthDate: "2009-11-20", gender: "Nam", grade: "12", address: "B\u1EA3n Su\u1ED1i Nh\u1EADn, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB \u00c1nh Tuy\u1EBFt", email: "", birthDate: "2009-01-03", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Ng\u1EADm, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh M\u1EA1nh T\u01B0\u1EDDng", email: "", birthDate: "2009-07-16", gender: "Nam", grade: "12", address: "B\u1EA3n S\u1EADp Vi\u1EC7t, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB Ti\u1EC3u Uy\u1EBFn", email: "", birthDate: "2009-12-12", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n V\u00e0n, x\u00e3 P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Gia V\u1EE7", email: "", birthDate: "2009-11-03", gender: "Nam", grade: "12", address: "B\u1EA3n S\u1EADp Vi\u1EC7t, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Th\u1ECB H\u1EA3i Y\u1EBFn", email: "", birthDate: "2009-12-13", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Pe, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Tr\u1EA7n M\u1EA1nh C\u01B0\u1EDDng", email: "", birthDate: "2009-09-01", gender: "Nam", grade: "12", address: "B\u1EA3n B\u1EAFc Ban, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "V\u0103n Tr\u1ECDng D\u1EE5ng", email: "", birthDate: "2009-08-01", gender: "Nam", grade: "12", address: "B\u1EA3n B\u1EAFc Ban, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110inh Tr\u1ECDng \u0110\u1EE9c", email: "", birthDate: "2009-08-30", gender: "Nam", grade: "12", address: "B\u1EA3n Cao \u0111a, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "\u0110o\u00e0n Th\u1ECB Ng\u1ECDc H\u00e2n", email: "", birthDate: "2009-09-15", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n B\u1EAFc \u0110a, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Sa Mai Hoa", email: "", birthDate: "2009-08-26", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Phi\u00eang ban 2, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "V\u0169 \u0110\u1EE9c H\u00f2a", email: "", birthDate: "2009-09-01", gender: "Nam", grade: "12", address: "B\u1EA3n Phi\u00eang Ban 1, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "H\u00e0 Ph\u00f9ng L\u00e2m Khang", email: "", birthDate: "2009-10-11", gender: "Nam", grade: "12", address: "B\u1EA3n B\u1EAFc Ban, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u01B0\u1EDDng Nguy\u1EC5n Mai Linh", email: "", birthDate: "2009-08-14", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n B\u1EAFc S\u01A1n, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Tr\u1ECBnh V\u0103n Th\u00e0nh Long", email: "", birthDate: "2009-09-11", gender: "Nam", grade: "12", address: "B\u1EA3n B\u1EAFc S\u01A1n, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u00F2 Ng\u1ECDc \u00c1nh", email: "", birthDate: "2009-10-06", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n M\u01B0\u1EDDng Khoa, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Nguy\u1EC5n Th\u1ECB H\u00e0 Nhi", email: "", birthDate: "2009-05-13", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n M\u01B0\u1EDDng Khoa, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "L\u1EE9 Th\u1ECB Ho\u00e0i", email: "", birthDate: "2009-01-03", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n Ch\u1EB9n, x\u00e3 T\u1EA1 Khoa", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "C\u1EA3m B\u1EA3o Y\u00ean", email: "", birthDate: "2009-11-13", gender: "N\u1EEF", grade: "12", address: "B\u1EA3n B\u1EAFc S\u01A1n, x\u00e3 B\u1EAFc Y\u00ean", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } },
            { name: "Ho\u00e0ng M\u1EA1nh L\u00EA", email: "", birthDate: "2008-09-06", gender: "Nam", grade: "12", address: "Chim H\u1EA1, P\u1EAFc Ng\u00e0", phone: "", className: "12A2", subjects: { math: false, english: false, physics: false, chemistry: false, biology: false, history: false, geography: false } }
        ];

        return rawStudents.map((s, i) => ({
            id: `HS${String(i + 1).padStart(3, '0')}`,
            token: this._generateToken(`HS${String(i + 1).padStart(3, '0')}`),
            name: s.name,
            email: s.email,
            birthDate: s.birthDate,
            gender: s.gender,
            grade: s.grade,
            address: s.address,
            phone: s.phone,
            className: s.className,
            subjects: s.subjects,
            status: this._calculateStatus(s),
            updatedAt: null
        }));
    }

    _calculateStatus(student) {
        const missing = this._countMissingFields(student);
        if (missing === 0) return 'completed';
        return 'incomplete';
    }

    _countMissingFields(student) {
        let count = 0;
        const checkFields = ['email', 'address', 'phone'];
        for (const f of checkFields) {
            if (!student[f] || String(student[f]).trim() === '') count++;
        }
        const subjectKeys = ['english', 'physics', 'chemistry', 'biology', 'history', 'geography'];
        for (const s of subjectKeys) {
            if (!student.subjects[s]) count++;
        }
        return count;
    }

    _loadFromStorage() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.MOCK_STUDENTS);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === this._students.length) {
                    this._students = parsed;
                }
            }
        } catch (e) {
            // Ignore parse errors, use default data
        }
    }

    _saveToStorage() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.MOCK_STUDENTS, JSON.stringify(this._students));
        } catch (e) {
            // Storage full or unavailable
        }
    }

    async getStudentByToken(token) {
        // Simulate network delay
        await this._delay(300 + Math.random() * 400);

        const student = this._students.find(s => s.token === token);
        if (!student) {
            throw new ApiError('NOT_FOUND', 'Kh\u00f4ng t\u00ecm th\u1ea5y h\u1ecdc sinh v\u1edbi token n\u00e0y');
        }
        return { ...student, subjects: { ...student.subjects } };
    }

    async updateStudent(id, data) {
        await this._delay(400 + Math.random() * 300);

        const index = this._students.findIndex(s => s.id === id);
        if (index === -1) {
            throw new ApiError('NOT_FOUND', 'Kh\u00f4ng t\u00ecm th\u1ea5y h\u1ecdc sinh');
        }

        // Merge data
        const student = this._students[index];
        for (const [key, value] of Object.entries(data)) {
            if (key === 'subjects' && typeof value === 'object') {
                student.subjects = { ...student.subjects, ...value };
            } else {
                student[key] = value;
            }
        }

        // Recalculate status
        student.status = this._calculateStatus(student);
        student.updatedAt = new Date().toISOString();

        this._students[index] = student;
        this._saveToStorage();

        return { ...student, subjects: { ...student.subjects } };
    }

    async getStudents() {
        await this._delay(300 + Math.random() * 300);
        return this._students.map(s => ({ ...s, subjects: { ...s.subjects } }));
    }

    async getStats() {
        await this._delay(200 + Math.random() * 200);

        const total = this._students.length;
        const completed = this._students.filter(s => s.status === 'completed').length;
        const incomplete = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 1000) / 10 : 0;

        // Count per class
        const classStats = {};
        for (const s of this._students) {
            if (!classStats[s.className]) {
                classStats[s.className] = { total: 0, completed: 0 };
            }
            classStats[s.className].total++;
            if (s.status === 'completed') classStats[s.className].completed++;
        }

        return { total, completed, incomplete, percentage, classStats };
    }

    async exportStudents() {
        await this._delay(500 + Math.random() * 500);
        // Return the students data - actual Excel generation happens in ExportService
        return this._students.map(s => ({ ...s, subjects: { ...s.subjects } }));
    }

    async adminLogin(username, password) {
        await this._delay(300);

        if (username === CONFIG.ADMIN_CREDENTIALS.username && password === CONFIG.ADMIN_CREDENTIALS.password) {
            this._adminSession = { username, loginAt: new Date().toISOString() };
            return { success: true, session: this._adminSession };
        }
        throw new ApiError('AUTH_FAILED', 'T\u00e0i kho\u1ea3n ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng \u0111\u00fang');
    }

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'ApiError';
    }
}
