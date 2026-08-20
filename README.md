# THPT Bac Yen - Student Information Management System

## Overview

A modern web frontend for managing student information data from Excel spreadsheets. Built with vanilla HTML, CSS, and JavaScript - no frameworks required.

## Architecture

```
thpt-bac-yen/
  index.html          - Student page
  admin.html          - Admin dashboard
  css/
    style.css         - Main styles + dark mode
    admin.css         - Admin-specific styles
    responsive.css    - Mobile/tablet/desktop breakpoints
  js/
    config.js         - Configuration
    app.js            - Entry point + theme manager
    api/
      api.js          - API abstraction layer
      mockApi.js      - Mock backend (all 45 students)
    services/
      authService.js  - Token + admin auth
      studentService.js - CRUD + missing field detection
      formService.js  - Dynamic form config
      validationService.js - Validation wrapper
      exportService.js - CSV/Excel export
    components/
      Toast.js        - Notifications
      Modal.js        - Dialogs
      Loading.js      - Spinners
      Progress.js     - Progress bars
      StudentForm.js  - Dynamic smart form
    pages/
      studentPage.js  - Student view
      adminPage.js    - Admin dashboard
    utils/
      helpers.js      - Date, DOM, token utilities
      storage.js      - localStorage wrapper
      validators.js   - Field validation rules
```

## How to Run Locally

### Method 1: Direct open
Simply open `index.html` in a browser. The mock API works without any server.

### Method 2: Local server (recommended)
```bash
# Python
cd thpt-bac-yen
python -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

Then visit: `http://localhost:8080`

## Testing Student Mode

### Step 1: Open without token
Visit `index.html` - you'll see demo tokens listed.

### Step 2: Click a demo token
Or manually visit: `index.html?token=TOKEN_001_XXXXXX`

### Step 3: Fill in missing fields
The form only shows fields that are empty.

### Step 4: Submit
Click "LUU THONG TIN" to save. Progress updates in real-time.

## Testing Admin Mode

### Step 1: Visit admin.html
Open `admin.html` in your browser.

### Step 2: Login
- Username: `admin`
- Password: `admin123`
(DEMO ONLY - not for production)

### Step 3: Dashboard
- View statistics (total, completed, incomplete, percentage)
- Search by name, ID, or class
- Filter by status and class
- Click any row to see student details

### Step 4: Export
Click "Xuat Excel" to download CSV with all student data.

## API Abstraction

The system uses a clean API abstraction pattern:

```javascript
// Current: MockApiService
const api = new MockApiService();

// Future: GoogleApiService  
const api = new GoogleApiService();
```

### Available API Methods
```javascript
api.getStudentByToken(token)  // GET student by token
api.updateStudent(id, data)   // POST update student
api.getStudents()             // GET all students
api.getStats()                // GET statistics
api.exportStudents()          // POST export data
api.adminLogin(user, pass)    // POST admin auth
```

## Connecting to Google Apps Script

### Step 1: Create Google Apps Script
Deploy a Web App that implements the same API methods.

### Step 2: Update config.js
```javascript
const CONFIG = {
    API_ENDPOINT: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    API_MODE: 'google',  // Change from 'mock' to 'google'
    // ...
};
```

### Step 3: Create GoogleApiService
Add `js/api/googleApi.js` that extends `ApiService` and calls the Apps Script endpoint.

```javascript
class GoogleApiService extends ApiService {
    constructor() {
        super();
        this._endpoint = CONFIG.API_ENDPOINT;
    }

    async getStudentByToken(token) {
        const res = await fetch(`${this._endpoint}?action=getStudent&token=${token}`);
        return await res.json();
    }
    // ... implement other methods
}
```

### Step 4: Update api.js
```javascript
const api = CONFIG.API_MODE === 'mock' 
    ? new MockApiService() 
    : new GoogleApiService();
```

## Important Security Notes

- Frontend authentication is for UI purposes only
- Real authentication must be verified on the backend
- Never expose sensitive student data without proper authorization
- The admin credentials (admin/admin123) are DEMO ONLY

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Features

- Smart form: only shows missing fields
- Real-time validation (email, phone, address)
- Dark mode with localStorage persistence
- Responsive design (mobile-first)
- Toast notifications
- Modal dialogs
- Progress tracking
- Admin dashboard with search/filter
- CSV export
- Demo mode with mock data
- API abstraction for easy backend swap
