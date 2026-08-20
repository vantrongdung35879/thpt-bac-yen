/**
 * StudentForm Component - Form \u0111\u1ed9ng t\u1eeb ch\u1ec9 hi\u1ec3n th\u1ecb tr\u01b0\u1eddng th\u00e thiếu
 */

const StudentForm = {
    _currentStudent: null,
    _formData: {},
    _formState: 'loading', // loading | ready | saving | success | error | completed
    _errors: {},

    init(student, container) {
        this._currentStudent = student;
        this._formState = 'loading';
        this._errors = {};

        // Load draft if exists
        const draft = Storage.getDraft(student.id);
        if (draft) {
            this._formData = { ...draft.data };
        } else {
            this._formData = {};
        }

        this._container = container;
        this.render();
    },

    render() {
        if (!this._container) return;

        const missing = StudentService.getMissingFields(this._currentStudent);
        const formConfig = FormService.buildFormConfig(missing);

        if (this._formState === 'completed' || missing.length === 0) {
            this._renderCompleted();
            return;
        }

        if (this._formState === 'saving') {
            Loading.show(this._container, '\u0110ang l\u01B0u th\u00f4ng tin...');
            return;
        }

        // Build form HTML
        const fieldsHtml = formConfig.map(field => {
            if (field.type === 'textarea') {
                return this._renderTextarea(field);
            } else if (field.type === 'checkbox') {
                return this._renderCheckbox(field);
            } else {
                return this._renderInput(field);
            }
        }).join('');

        this._container.innerHTML = `
            <form class="student-form" id="studentForm" novalidate>
                <div class="form-fields">
                    ${fieldsHtml}
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-lg btn-save">
                        <span class="btn-icon">\uD83D\uDCBE</span> L\u01AFU TH\u00d4NG TIN
                    </button>
                </div>
            </form>
        `;

        this._bindEvents();
    },

    _renderInput(field) {
        const val = this._formData[field.key] || '';
        const err = this._errors[field.key] || '';
        return `
            <div class="form-group ${err ? 'has-error' : ''}">
                <label class="form-label" for="field-${field.key}">
                    <span class="field-icon">${field.icon}</span>
                    ${field.label} <span class="required">*</span>
                </label>
                <input type="${field.type}" 
                       id="field-${field.key}" 
                       name="${field.key}"
                       class="form-input" 
                       value="${Helpers.escapeHtml(val)}"
                       placeholder="${field.key === 'phone' ? 'VD: 0912345678' : ''}"
                       autocomplete="off"
                       aria-describedby="error-${field.key}">
                ${err ? `<span class="form-error" id="error-${field.key}">${err}</span>` : ''}
            </div>
        `;
    },

    _renderTextarea(field) {
        const val = this._formData[field.key] || '';
        const err = this._errors[field.key] || '';
        return `
            <div class="form-group ${err ? 'has-error' : ''}">
                <label class="form-label" for="field-${field.key}">
                    <span class="field-icon">${field.icon}</span>
                    ${field.label} <span class="required">*</span>
                </label>
                <textarea id="field-${field.key}" 
                          name="${field.key}"
                          class="form-input form-textarea" 
                          rows="3"
                          placeholder="Nh\u1eadp \u0111\u1ECBa ch\u1EC9 \u0111\u1ea7y \u0111\u1ee7"
                          aria-describedby="error-${field.key}">${Helpers.escapeHtml(val)}</textarea>
                ${err ? `<span class="form-error" id="error-${field.key}">${err}</span>` : ''}
            </div>
        `;
    },

    _renderCheckbox(field) {
        const val = this._formData[field.key] || false;
        return `
            <div class="form-group form-group-checkbox">
                <label class="form-label checkbox-label">
                    <span class="field-icon">${field.icon}</span>
                    ${field.label}
                </label>
                <label class="toggle-switch" for="field-${field.key}">
                    <input type="checkbox" 
                           id="field-${field.key}" 
                           name="${field.key}"
                           class="form-checkbox" 
                           ${val ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                    <span class="toggle-text">${val ? 'C\u00f3' : 'Kh\u00f4ng'}</span>
                </label>
            </div>
        `;
    },

    _bindEvents() {
        const form = this._container.querySelector('#studentForm');
        if (!form) return;

        // Input change handlers - live save to formData
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.name;
                if (e.target.type === 'checkbox') {
                    this._formData[key] = e.target.checked;
                    // Update toggle text
                    const toggleText = e.target.closest('.toggle-switch')?.querySelector('.toggle-text');
                    if (toggleText) toggleText.textContent = e.target.checked ? 'C\u00f3' : 'Kh\u00f4ng';
                } else {
                    this._formData[key] = e.target.value;
                }
                // Clear error on change
                delete this._errors[key];
                const group = e.target.closest('.form-group');
                if (group) group.classList.remove('has-error');
                const errEl = group?.querySelector('.form-error');
                if (errEl) errEl.remove();

                // Save draft
                Storage.saveDraft(this._currentStudent.id, this._formData);
            });

            // For checkbox
            if (input.type === 'checkbox') {
                input.addEventListener('change', (e) => {
                    const key = e.target.name;
                    this._formData[key] = e.target.checked;
                    const toggleText = e.target.closest('.toggle-switch')?.querySelector('.toggle-text');
                    if (toggleText) toggleText.textContent = e.target.checked ? 'C\u00f3' : 'Kh\u00f4ng';
                    Storage.saveDraft(this._currentStudent.id, this._formData);
                });
            }
        });

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleSubmit();
        });
    },

    async _handleSubmit() {
        // Validate
        const { valid, errors } = ValidationService.validateForm(this._formData);
        if (!valid) {
            this._errors = errors;
            this._showErrors(errors);
            Toast.warning('Vui l\u00f2ng ki\u1ec3m tra l\u1ea1i c\u00e1c tr\u01b0\u1eddng \u0111\u00e3 nh\u1eadp');
            return;
        }

        // Save
        this._formState = 'saving';
        this.render();

        try {
            await StudentService.saveStudent(this._currentStudent.id, this._formData);
            this._formState = 'completed';
            Storage.clearDraft(this._currentStudent.id);
            Toast.success('\u0110\u00e3 l\u01B0u th\u00f4ng tin th\u00e0nh c\u00f4ng!');
            this.render();
        } catch (err) {
            this._formState = 'error';
            if (err.type === 'VALIDATION') {
                this._errors = err.errors;
                this.render();
                Toast.warning('Vui l\u00f2ng \u0111i\u1EC1n \u0111\u1ea7y \u0111\u1ee7 c\u00e1c tr\u01b0\u1eddng b\u1eaft bu\u1ed9c');
            } else {
                Toast.error('Kh\u00f4ng th\u1ec3 l\u01B0u d\u1eef li\u1ec7u. Vui l\u00f2ng th\u1eed l\u1ea1i.');
                this._formState = 'ready';
                this.render();
            }
        }
    },

    _showErrors(errors) {
        for (const [key, msg] of Object.entries(errors)) {
            const input = this._container.querySelector(`[name="${key}"]`);
            if (input) {
                const group = input.closest('.form-group');
                if (group) {
                    group.classList.add('has-error');
                    let errEl = group.querySelector('.form-error');
                    if (!errEl) {
                        errEl = document.createElement('span');
                        errEl.className = 'form-error';
                        group.appendChild(errEl);
                    }
                    errEl.textContent = msg;
                }
            }
        }
    },

    _renderCompleted() {
        this._container.innerHTML = `
            <div class="completed-state">
                <div class="completed-icon">\uD83C\uDF89</div>
                <h3>Ho\u00e0n t\u1ea5t!</h3>
                <p>B\u1EA1n \u0111\u00e3 nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin.</p>
                <p class="completed-sub">Th\u00f4ng tin \u0111\u00e3 \u0111\u01B0\u1EE3c l\u01B0u th\u00e0nh c\u00f4ng.</p>
            </div>
        `;
    }
};
