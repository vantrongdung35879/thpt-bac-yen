/**
 * Progress Component
 */

const Progress = {
    render(student, container) {
        const pct = StudentService.getCompletionPercentage(student);
        const missing = StudentService.getMissingFields(student);
        const total = 9;
        const done = total - missing.length;

        let message = '';
        if (pct === 100) {
            message = '\uD83C\uDF89 Ho\u00e0n t\u1ea5t! B\u1EA1n \u0111\u00e3 nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\u00f4ng tin.';
        } else if (missing.length === 1) {
            message = '\u2728 B\u1EA1n ch\u01b0a c\u00f2n 1 th\u00f4ng tin n\u1eefa!';
        } else {
            message = `C\u00f2n thi\u1EBFu ${missing.length} th\u00f4ng tin.`;
        }

        container.innerHTML = `
            <div class="progress-section">
                <div class="progress-header">
                    <span class="progress-label">Th\u00f4ng tin \u0111\u00e3 ho\u00e0n th\u00e0nh</span>
                    <span class="progress-count">${done}/${total}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${pct === 100 ? 'progress-complete' : ''}" 
                         style="width: ${pct}%"
                         role="progressbar" 
                         aria-valuenow="${pct}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                    </div>
                </div>
                <div class="progress-info">
                    <span class="progress-pct">${pct}%</span>
                    <span class="progress-msg">${message}</span>
                </div>
            </div>
        `;
    }
};
