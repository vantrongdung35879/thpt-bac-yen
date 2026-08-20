/**
 * Form Service - T\u1ea1o form \u0111\u1ed9ng t\u1eeb c\u1ea5u h\u00ecnh field
 */

const FormService = {
    FIELD_LABELS: {
        email: 'Email',
        address: '\u0110\u1ECBa ch\u1EC9',
        phone: 'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i',
        english: 'Ti\u1EBFng Anh',
        physics: 'V\u1EADt l\u00ed',
        chemistry: 'H\u00f3a h\u1ECDc',
        biology: 'Sinh h\u1ECDc',
        history: 'L\u1ECBch s\u1EED',
        geography: '\u0110\u1ECBa l\u00fd'
    },

    FIELD_TYPES: {
        email: 'email',
        address: 'textarea',
        phone: 'tel',
        english: 'checkbox',
        physics: 'checkbox',
        chemistry: 'checkbox',
        biology: 'checkbox',
        history: 'checkbox',
        geography: 'checkbox'
    },

    FIELD_ICONS: {
        email: '\u{1F4E7}',
        address: '\u{1F4CD}',
        phone: '\u{1F4F1}',
        english: '\u{1F524}',
        physics: '\u26A1',
        chemistry: '\u{1F9EA}',
        biology: '\u{1F9EC}',
        history: '\u{1F4DC}',
        geography: '\u{1F30D}'
    },

    /**
     * X\u00e1c \u0111\u1ecbnh tr\u1ea1ng th\u00e1i form
     */
    getFormState(missingFields) {
        if (missingFields.length === 0) return 'completed';
        return 'ready';
    },

    /**
     * T\u1ea1o c\u1ea5u tr\u00fac form t\u1eeb missing fields
     */
    buildFormConfig(missingFields) {
        return missingFields.map(key => ({
            key,
            label: this.FIELD_LABELS[key] || key,
            type: this.FIELD_TYPES[key] || 'text',
            icon: this.FIELD_ICONS[key] || '',
            required: true
        }));
    }
};
