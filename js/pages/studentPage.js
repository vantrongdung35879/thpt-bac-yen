/**
 * Student Page - Hi\u1ec3n th\u1ecb form cho h\u1ecdc sinh
 */

const StudentPage = {
    _student: null,

    async init() {
        const token = Helpers.getTokenFromURL();
        const app = document.getElementById('app');

        if (!token) {
            this._renderNoToken(app);
            return;
        }

        Loading.show(app, '\u0110ang t\u00ecm ki\u1ebfm th\u00f4ng tin...');

        try {
            this._student = await AuthService.getStudentByToken(token);
            this._render(app);
        } catch (err) {
            this._renderError(app, err);
        }
    },

    _render(app) {
        const s = this._student;
        const missing = StudentService.getMissingFields(s);
        const isComplete = missing.length === 0;

        app.innerHTML = `
            <div class="student-page">
                <header class="page-header">
                    <div class="header-content">
                        <h1 class="school-name">${CONFIG.SCHOOL_NAME}</h1>
                        <p class="school-sub">C\u1EADP NH\u1EACT TH\u00d4NG TIN H\u1ECCC SINH</p>
                    </div>
                    <button class="theme-toggle" id="themeToggle" aria-label="\u0110\u1ed5i giao di\u1ec7n">\u2600\uFE0F</button>
                </header>

                <main class="student-main">
                    <div class="student-card">
                        <div class="student-greeting">
                            <p class="greeting-text">Xin ch\u00e0o,</p>
                            <h2 class="student-name">${Helpers.escapeHtml(s.name)}</h2>
                            <div class="student-meta">
                                <span class="meta-badge">\uD83D\uDCDA L\u1EBBp: ${s.className}</span>
                                <span class="meta-badge">${s.gender === 'Nam' ? '\uD83D\uDC66' : '\uD83D\uDC67'} ${s.gender}</span>
                                <span class="meta-badge">\uD83D\uDCC5 ${Helpers.formatDate(s.birthDate)}</span>
                            </div>
                        </div>

                        <div id="progressContainer"></div>

                        <div class="form-section">
                            ${isComplete 
                                ? `<div id="formContainer"></div>`
                                : `<div class="section-title">
                                    <span class="section-icon">\u270F\uFE0F</span>
                                    <span>Th\u00f4ng tin c\u1ea7n c\u1eadp nh\u1eadt (${missing.length} tr\u01b0\u1eddng)</span>
                                   </div>
                                   <div id="formContainer"></div>`
                            }
                        </div>
                    </div>

                    ${CONFIG.API_MODE === 'mock' ? '<div class="demo-badge">DEMO MODE - D\u1eef li\u1ec7u m\u1eABu</div>' : ''}
                </main>
            </div>
        `;

        // Init theme toggle
        ThemeManager.initToggle(document.getElementById('themeToggle'));

        // Render progress
        Progress.render(s, document.getElementById('progressContainer'));

        // Render form
        StudentForm.init(s, document.getElementById('formContainer'));
    },

    _renderNoToken(app) {
        app.innerHTML = `
            <div class="error-page">
                <div class="error-card">
                    <div class="error-icon">\uD83D\uDD11</div>
                    <h2>Thi\u1EBFu token truy c\u1eadp</h2>
                    <p>Vui l\u00f2ng s\u1eed d\u1ee5ng \u0111\u00fang \u0111\u01B0\u1EDDng d\u1EABn c\u00f3 ch\u1ee9a token.</p>
                    <p class="error-hint">V\u00ed d\u1EE5: <code>index.html?token=ABC123</code></p>
                    <div class="demo-tokens" id="demoTokens"></div>
                </div>
            </div>
        `;

        // Show demo tokens if in mock mode
        if (CONFIG.API_MODE === 'mock') {
            this._showDemoTokens(document.getElementById('demoTokens'));
        }
    },

    _renderError(app, err) {
        app.innerHTML = `
            <div class="error-page">
                <div class="error-card">
                    <div class="error-icon">\u274C</div>
                    <h2>Kh\u00f4ng t\u00ecm th\u1ea5y th\u00f4ng tin</h2>
                    <p>${err.message || 'Vui l\u00f2ng ki\u1ec3m tra l\u1ea1i \u0111\u01B0\u1EDDng d\u1EABn ho\u1EB7c li\u00ean h\u1EC7 qu\u1EA3n tr\u1ECB vi\u00ean.'}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Th\u1eed l\u1ea1i</button>
                </div>
            </div>
        `;
    },

    async _showDemoTokens(container) {
        try {
            const students = await api.getStudents();
            const html = `
                <p class="demo-label">Token m\u1eABu (Demo Mode):</p>
                <div class="token-list">
                    ${students.slice(0, 5).map(s => `
                        <a href="?token=${s.token}" class="token-item">
                            <span class="token-name">${s.name}</span>
                            <span class="token-code">${s.token}</span>
                        </a>
                    `).join('')}
                </div>
            `;
            container.innerHTML = html;
        } catch { /* */ }
    }
};
