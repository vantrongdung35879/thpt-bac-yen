/**
 * Validation utilities
 */

const Validators = {
    email(value) {
        if (!value || String(value).trim() === '') return 'Email kh\u00f4ng \u0111\u01B0\u1EE3c \u0111\u1ec3 tr\u1ed1ng';
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(value)) return 'Email kh\u00f4ng h\u1EE3p l\u1EC7';
        return null;
    },

    phone(value) {
        if (!value || String(value).trim() === '') return 'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\u00f4ng \u0111\u01B0\u1EE3c \u0111\u1ec3 tr\u1ed1ng';
        const cleaned = String(value).replace(/[\s\-\.]/g, '');
        if (!/^0\d{9,10}$/.test(cleaned)) return 'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\u00f4ng h\u1EE3p l\u1EC7 (VD: 0912345678)';
        return null;
    },

    required(value, label) {
        if (value === null || value === undefined || String(value).trim() === '') {
            return `${label} kh\u00f4ng \u0111\u01B0\u1EE3c \u0111\u1ec3 tr\u1ed1ng`;
        }
        return null;
    },

    address(value) {
        if (!value || String(value).trim() === '') return '\u0110\u1ECBa ch\u1EC9 kh\u00f4ng \u0111\u01B0\u1EE3c \u0111\u1ec3 tr\u1ed1ng';
        if (String(value).trim().length < 5) return '\u0110\u1ECBa ch\u1EC9 qu\u00e1 ng\u1EAFn';
        return null;
    },

    validateField(fieldKey, value) {
        switch (fieldKey) {
            case 'email': return this.email(value);
            case 'phone': return this.phone(value);
            case 'address': return this.address(value);
            default: return null;
        }
    },

    validateAll(formData) {
        const errors = {};
        for (const [key, value] of Object.entries(formData)) {
            const error = this.validateField(key, value);
            if (error) errors[key] = error;
        }
        return { valid: Object.keys(errors).length === 0, errors };
    }
};
