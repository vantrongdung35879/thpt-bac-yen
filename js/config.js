/**
 * Configuration - THPT Bắc Yên Student Management System
 * 
 * Thay đổi API_ENDPOINT ở đây khi kết nối backend thật.
 * TODO: CONNECT TO GOOGLE APPS SCRIPT
 */

const CONFIG = {
    // API Configuration
    API_ENDPOINT: '', // Thay bằng URL Google Apps Script khi triển khai
    API_MODE: 'mock', // 'mock' | 'google' - Chuyển thành 'google' khi kết nối backend

    // School Info
    SCHOOL_NAME: 'THPT Bắc Yên',
    SCHOOL_ADDRESS: 'Sơn La',

    // Admin Credentials (DEMO ONLY - không dùng production)
    ADMIN_CREDENTIALS: {
        username: 'admin',
        password: 'admin123'
    },

    // Pagination
    ADMIN_PAGE_SIZE: 20,

    // Toast duration (ms)
    TOAST_DURATION: 3500,

    // LocalStorage Keys
    STORAGE_KEYS: {
        THEME: 'thptbacuyen_theme',
        SESSION: 'thptbacuyen_session',
        MOCK_STUDENTS: 'thptbacuyen_mock_students',
        FORM_DRAFT: 'thptbacuyen_form_draft'
    },

    // Field Configuration - defines all possible student fields
    FIELD_CONFIG: {
        email: {
            label: 'Email',
            type: 'email',
            required: true,
            icon: '📧',
            placeholder: 'example@email.com'
        },
        address: {
            label: 'Địa chỉ',
            type: 'textarea',
            required: true,
            icon: '📍',
            placeholder: 'Nhập địa chỉ đầy đủ'
        },
        phone: {
            label: 'Số điện thoại',
            type: 'tel',
            required: true,
            icon: '📱',
            placeholder: 'VD: 0912345678'
        },
        subjects: {
            math: {
                label: 'Toán',
                icon: '📐'
            },
            english: {
                label: 'Tiếng Anh',
                icon: '🔤'
            },
            physics: {
                label: 'Vật lí',
                icon: '⚡'
            },
            chemistry: {
                label: 'Hóa học',
                icon: '🧪'
            },
            biology: {
                label: 'Sinh học',
                icon: '🧬'
            },
            history: {
                label: 'Lịch sử',
                icon: '📜'
            },
            geography: {
                label: 'Địa lý',
                icon: '🌍'
            }
        }
    },

    // Available classes for filter
    CLASSES: ['12A1', '12A2', '12A3']
};

// Freeze to prevent mutation
Object.freeze(CONFIG);
