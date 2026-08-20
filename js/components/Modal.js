/**
 * Modal Component
 */

const Modal = {
    _overlay: null,

    show({ title = '', content = '', actions = [], size = 'medium', closable = true }) {
        this.hide(); // Close any existing modal

        this._overlay = document.createElement('div');
        this._overlay.className = 'modal-overlay';
        this._overlay.setAttribute('role', 'dialog');
        this._overlay.setAttribute('aria-modal', 'true');

        const actionsHtml = actions.map(a =>
            `<button class="btn btn-${a.type || 'secondary'} modal-action" data-action="${a.id || ''}">${a.label}</button>`
        ).join('');

        this._overlay.innerHTML = `
            <div class="modal-container modal-${size}">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    ${closable ? '<button class="modal-close-btn" aria-label="\u0110\u00f3ng">&times;</button>' : ''}
                </div>
                <div class="modal-body">${content}</div>
                ${actionsHtml ? `<div class="modal-footer">${actionsHtml}</div>` : ''}
            </div>
        `;

        document.body.appendChild(this._overlay);
        requestAnimationFrame(() => this._overlay.classList.add('modal-overlay-show'));

        // Close handlers
        if (closable) {
            this._overlay.querySelector('.modal-close-btn')?.addEventListener('click', () => this.hide());
            this._overlay.addEventListener('click', (e) => {
                if (e.target === this._overlay) this.hide();
            });
        }

        // Action handlers
        this._overlay.querySelectorAll('.modal-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionId = btn.dataset.action;
                const action = actions.find(a => a.id === actionId);
                if (action?.onClick) action.onClick();
                if (action?.closeOnClick !== false) this.hide();
            });
        });

        // Escape key
        this._escHandler = (e) => {
            if (e.key === 'Escape' && closable) this.hide();
        };
        document.addEventListener('keydown', this._escHandler);

        return this._overlay;
    },

    hide() {
        if (this._overlay) {
            this._overlay.classList.remove('modal-overlay-show');
            this._overlay.classList.add('modal-overlay-hide');
            const overlay = this._overlay;
            setTimeout(() => overlay.remove(), 300);
            this._overlay = null;
        }
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
    },

    confirm(title, message, onConfirm) {
        this.show({
            title,
            content: `<p>${message}</p>`,
            actions: [
                { id: 'cancel', label: 'H\u1EE7y', type: 'secondary' },
                { id: 'confirm', label: 'X\u00e1c nh\u1EADn', type: 'primary', onClick: onConfirm }
            ],
            size: 'small'
        });
    },

    studentDetail(student) {
        const missing = StudentService.getMissingFields(student);
        const pct = StudentService.getCompletionPercentage(student);

        const infoHtml = [
            { label: 'H\u1ECD v\u00e0 t\u00ean', value: student.name },
            { label: 'L\u1EBBp', value: student.className },
            { label: 'Ng\u00e0y sinh', value: Helpers.formatDate(student.birthDate) },
            { label: 'Gi\u1EDBi t\u00ednh', value: student.gender },
            { label: 'Email', value: student.email || 'Ch\u01b0a c\u00f3' },
            { label: 'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i', value: student.phone || 'Ch\u01b0a c\u00f3' },
            { label: 'Ghi ch\u00fa', value: student.updatedAt ? Helpers.timeAgo(student.updatedAt) : '--' }
        ];

        const allSubjectKeys = ['math', 'english', 'physics', 'chemistry', 'biology', 'history', 'geography'];
        const subjectLabels = { math: 'To\u00e1n', english: 'Ti\u1EBFng Anh', physics: 'V\u1EADt l\u00ed', chemistry: 'H\u00f3a h\u1ECDc', biology: 'Sinh h\u1ECDc', history: 'L\u1ECBch s\u1EED', geography: '\u0110\u1ECBa l\u00fd' };

        const subjectsHtml = allSubjectKeys.map(k =>
            `<span class="detail-badge ${student.subjects[k] ? 'badge-done' : 'badge-miss'}">${student.subjects[k] ? '\u2705' : '\u274C'} ${subjectLabels[k]}</span>`
        ).join('');

        const content = `
            <div class="student-detail">
                <div class="detail-info">
                    ${infoHtml.map(i => `<div class="detail-row"><strong>${i.label}:</strong> ${i.value}</div>`).join('')}
                </div>
                <div class="detail-progress">
                    <strong>Ti\u1EBFn \u0111\u1ED9:</strong> ${pct}% (${12 - missing.length}/12 tr\u01b0\u1eddng)
                    <div class="progress-bar-mini"><div class="progress-fill" style="width:${pct}%"></div></div>
                </div>
                <div class="detail-subjects">
                    <strong>M\u00f4n h\u1ECDc:</strong><br>
                    ${subjectsHtml}
                </div>
                ${missing.length > 0 ? `<div class="detail-missing"><strong>Th\u00edu:</strong> ${missing.map(k => FormService.FIELD_LABELS[k]).join(', ')}</div>` : ''}
            </div>
        `;

        this.show({
            title: student.name,
            content,
            size: 'medium',
            actions: [{ id: 'close', label: '\u0110\u00f3ng', type: 'primary' }]
        });
    }
};
