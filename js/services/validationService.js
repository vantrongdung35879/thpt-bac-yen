/**
 * Validation Service - Ki\u1ec3m tra d\u1eef li\u1ec7u form
 */

const ValidationService = {
    validateField(key, value) {
        return Validators.validateField(key, value);
    },

    validateForm(formData) {
        return Validators.validateAll(formData);
    },

    validateEmail(value) {
        return Validators.email(value);
    },

    validatePhone(value) {
        return Validators.phone(value);
    }
};
