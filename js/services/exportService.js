/**
 * Export Service - Xu\u1ea5t d\u1eef li\u1ec7u ra file Excel
 * 
 * Hi\u1ec7n t\u1ea1i generate CSV. Sau n\u00e0y c\u00f3 th\u1ec3 k\u1ebft n\u1ed1i v\u1edbi backend \u0111\u1ec3 generate Excel th\u1ef1c s\u1ef1.
 * TODO: CONNECT TO GOOGLE APPS SCRIPT
 */

const ExportService = {
    async exportToCSV() {
        const students = await api.exportStudents();
        const headers = [
            'H\u1ECD v\u00e0 T\u00ean', 'Email', 'Ng\u00e0y sinh', 'Gi\u1EDBi t\u00ednh',
            'Kh\u00f3i l\u1EBBp', '\u0110\u1ECBa ch\u1EC9', 'S\u1ED1 \u0111i\u1EC7n tho\u1EA1i', 'T\u00ean l\u1EBBp',
            'To\u00e1n', 'Ti\u1EBFng Anh', 'V\u1EADt l\u00ed', 'H\u00f3a h\u1ECDc',
            'Sinh h\u1ECDc', 'L\u1ECBch s\u1EED', '\u0110\u1ECBa l\u00fd'
        ];

        const rows = students.map(s => [
            s.name, s.email, Helpers.formatDate(s.birthDate), s.gender,
            s.grade, s.address, s.phone, s.className,
            s.subjects.math ? 'x' : '', s.subjects.english ? 'x' : '',
            s.subjects.physics ? 'x' : '', s.subjects.chemistry ? 'x' : '',
            s.subjects.biology ? 'x' : '', s.subjects.history ? 'x' : '',
            s.subjects.geography ? 'x' : ''
        ]);

        // BOM for UTF-8
        const bom = '\uFEFF';
        const csv = bom + [headers.join(','), ...rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DanhSachHocSinh_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        return students;
    }
};
