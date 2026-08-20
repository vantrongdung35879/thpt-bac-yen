/**
 * Admin Page - Dashboard qu\u1EA3n tr\u1ECB vi\u00ean
 */

const AdminPage = {
    _students: [],
    _filtered: [],
    _stats: null,
    _filters: { search: '', status: 'all', class: 'all' },

    async init() {
        const app = document.getElementById('app');

        if (!AuthService.isAdminLoggedIn()) {
            this._renderLogin(app);
            return;
        }

        await this._loadData(app);
    },

    _renderLogin(app) {
        app.innerHTML = `
            <div class="login-page">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-icon">\uD83D\uDEE1\uFE0F</div>
                        <h1>Admin Dashboard</h1>
                        <p class="login-sub">${CONFIG.SCHOOL_NAME}</p>
                        ${CONFIG.API_MODE === 'mock' ? '<p class="demo-note">DEMO: admin / admin123</p>' : ''}
                    </div>
                    <form id="loginForm" class="login-form">
                        <div class="form-group">
                            <label class="form-label" for="username">T\u00e0i kho\u1ea3n</label>
                            <input type="text" id="username" class="form-input" autocomplete="username" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">M\u1eadt kh\u1ea9u</label>
                            <input type="password" id="password" class="form-input" autocomplete="current-password" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg btn-block">\u0110\u0103NG NH\u1EACP</button>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            try {
                await AuthService.adminLogin(u, p);
                Storage.set(CONFIG.STORAGE_KEYS.SESSION, { username: u });
                await this._loadData(app);
            } catch (err) {
                Toast.error(err.message || 'Sai t\u00e0i kho\u1ea3n ho\u1EB7c m\u1eadt kh\u1ea9u');
            }
        });
    },

    async _loadData(app) {
        Loading.show(app, '\u0110ang t\u1ea3i dashboard...');
        try {
            this._students = await StudentService.getAllStudents();
            this._stats = await StudentService.getStats();
            this._applyFilters();
            this._render(app);
        } catch (err) {
            Toast.error('Kh\u00f4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u');
            app.innerHTML = `<div class="error-page"><div class="error-card"><h2>L\u1ED7i t\u1ea3i d\u1eef li\u1ec7u</h2><p>${err.message}</p></div></div>`;
        }
    },

    _render(app) {
        const s = this._stats;
        app.innerHTML = `
            <div class="admin-page">
                <header class="admin-header">
                    <div class="header-left">
                        <h1 class="admin-title">Dashboard</h1>
                        <p class="admin-sub">${CONFIG.SCHOOL_NAME}</p>
                    </div>
                    <div class="header-right">
                        <button class="btn btn-accent" id="exportBtn">\uD83D\uDCCA Xu\u1ea5t Excel</button>
                        <button class="btn btn-secondary" id="logoutBtn">\uD83D\uDEAA \u0110\u0103ng xu\u1ea5t</button>
                        <button class="theme-toggle" id="themeToggle" aria-label="\u0110\u1ed5i giao di\u1ec7n">\u2600\uFE0F</button>
                    </div>
                </header>

                <main class="admin-main">
                    <div class="stats-grid">
                        <div class="stat-card stat-total">
                            <div class="stat-icon">\uD83C\uDF93</div>
                            <div class="stat-info">
                                <div class="stat-number">${s.total}</div>
                                <div class="stat-label">T\u1ED5NG S\u1ED0 H\u1ECCC SINH</div>
                            </div>
                        </div>
                        <div class="stat-card stat-completed">
                            <div class="stat-icon">\u2705</div>
                            <div class="stat-info">
                                <div class="stat-number">${s.completed}</div>
                                <div class="stat-label">\u0110\u00c3 HO\u00c0N TH\u00c0NH</div>
                            </div>
                        </div>
                        <div class="stat-card stat-incomplete">
                            <div class="stat-icon">\u26A0\uFE0F</div>
                            <div class="stat-info">
                                <div class="stat-number">${s.incomplete}</div>
                                <div class="stat-label">CH\u01afA HO\u00c0N TH\u00c0NH</div>
                            </div>
                        </div>
                        <div class="stat-card stat-progress">
                            <div class="stat-icon">\uD83D\uDCC8</div>
                            <div class="stat-info">
                                <div class="stat-number">${s.percentage}%</div>
                                <div class="stat-label">TI\u1EBEN \u0110\u1ED8</div>
                            </div>
                        </div>
                    </div>

                    <div class="controls-bar">
                        <div class="search-box">
                            <span class="search-icon">\uD83D\uDD0D</span>
                            <input type="text" id="searchInput" class="search-input" placeholder="T\u00ecm ki\u1ebfm h\u1ecdc sinh..." aria-label="T\u00ecm ki\u1ebfm">
                        </div>
                        <div class="filter-group">
                            <select id="statusFilter" class="filter-select" aria-label="L\u1ecdc tr\u1ea1ng th\u00e1i">
                                <option value="all">T\u1EA5t c\u1ea3</option>
                                <option value="completed">\u0110\u00e3 ho\u00e0n th\u00e0nh</option>
                                <option value="incomplete">Ch\u01b0a ho\u00e0n th\u00e0nh</option>
                            </select>
                            <select id="classFilter" class="filter-select" aria-label="L\u1ecdc l\u1EBBp">
                                <option value="all">T\u1EA5t c\u1ea3 l\u1EBBp</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-wrapper" id="tableWrapper"></div>
                </main>
            </div>
        `;

        // Populate class filter
        const classSelect = document.getElementById('classFilter');
        const classes = [...new Set(this._students.map(s => s.className))].sort();
        classes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            classSelect.appendChild(opt);
        });

        // Bind events
        document.getElementById('searchInput').addEventListener('input', Helpers.debounce((e) => {
            this._filters.search = e.target.value;
            this._applyFilters();
            this._renderTable();
        }));

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this._filters.status = e.target.value;
            this._applyFilters();
            this._renderTable();
        });

        document.getElementById('classFilter').addEventListener('change', (e) => {
            this._filters.class = e.target.value;
            this._applyFilters();
            this._renderTable();
        });

        document.getElementById('exportBtn').addEventListener('click', async () => {
            try {
                Toast.info('\u0110ang xu\u1ea5t d\u1eef li\u1ec7u...');
                await ExportService.exportToCSV();
                Toast.success('\u0110\u00e3 xu\u1ea5t file th\u00e0nh c\u00f4ng!');
            } catch (err) {
                Toast.error('L\u1ED7i xu\u1ea5t file');
            }
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            AuthService.logout();
            location.reload();
        });

        ThemeManager.initToggle(document.getElementById('themeToggle'));

        this._renderTable();
    },

    _applyFilters() {
        this._filtered = StudentService.filterStudents(this._students, {
            search: this._filters.search,
            statusFilter: this._filters.status,
            classFilter: this._filters.class
        });
    },

    _renderTable() {
        const wrapper = document.getElementById('tableWrapper');
        if (!wrapper) return;

        if (this._filtered.length === 0) {
            wrapper.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">\uD83D\uDD0D</div>
                    <p>Kh\u00f4ng t\u00ecm th\u1ea5y h\u1ecdc sinh n\u00e0o ph\u00f9 h\u1EE3p.</p>
                </div>
            `;
            return;
        }

        const rows = this._filtered.map(s => {
            const pct = StudentService.getCompletionPercentage(s);
            const missing = StudentService.getMissingFields(s);
            const isComplete = s.status === 'completed';

            return `
                <tr class="table-row ${isComplete ? 'row-complete' : 'row-incomplete'}" data-id="${s.id}">
                    <td class="cell-name">${Helpers.escapeHtml(s.name)}</td>
                    <td class="cell-class">${s.className}</td>
                    <td class="cell-progress">
                        <div class="table-progress">
                            <div class="progress-bar-sm"><div class="progress-fill-sm ${pct === 100 ? 'fill-complete' : ''}" style="width:${pct}%"></div></div>
                            <span class="pct-text">${pct}%</span>
                        </div>
                    </td>
                    <td class="cell-status">
                        <span class="status-badge ${isComplete ? 'status-complete' : 'status-incomplete'}">
                            ${isComplete ? '\u2705 Ho\u00e0n th\u00e0nh' : '\u26A0\uFE0F Ch\u01b0a \u0111\u1ee7'}
                        </span>
                    </td>
                    <td class="cell-missing">${isComplete ? '--' : missing.length}</td>
                    <td class="cell-time">${Helpers.timeAgo(s.updatedAt)}</td>
                </tr>
            `;
        }).join('');

        wrapper.innerHTML = `
            <div class="table-info">Hi\u1ec3n th\u1ecb ${this._filtered.length} / ${this._students.length} h\u1ecdc sinh</div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>H\u1ECD v\u00e0 t\u00ean</th>
                            <th>L\u1EBBp</th>
                            <th>Ti\u1EBFn \u0111\u1ED9</th>
                            <th>Tr\u1ea1ng th\u00e1i</th>
                            <th>Th\u00edu</th>
                            <th>C\u1EADp nh\u1eadt</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;

        // Click row to show detail
        wrapper.querySelectorAll('.table-row').forEach(row => {
            row.addEventListener('click', () => {
                const id = row.dataset.id;
                const student = this._students.find(s => s.id === id);
                if (student) Modal.studentDetail(student);
            });
            row.style.cursor = 'pointer';
        });
    }
};
