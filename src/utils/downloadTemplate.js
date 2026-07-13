function escapeCSVValue(value) {
    const stringValue =
        value === null || value === undefined
            ? ''
            : String(value);

    return `"${stringValue.replace(/"/g, '""')}"`;
}

export function downloadCSVTemplate({
    filename,
    headers,
    exampleRows = [],
}) {
    if (!filename || !Array.isArray(headers) || headers.length === 0) {
        throw new Error(
            'A filename and at least one CSV header are required.'
        );
    }

    const csvLines = [
        headers.map(escapeCSVValue).join(','),
        ...exampleRows.map((row) =>
            headers
                .map((header) => escapeCSVValue(row?.[header] ?? ''))
                .join(',')
        ),
    ];

    const csvContent = csvLines.join('\n');

    const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(objectUrl);
}