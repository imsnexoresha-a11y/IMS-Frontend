/**
 * Utility: exportToCsv
 * Takes an array of row objects and a columns definition,
 * builds a CSV string, and triggers a browser download.
 *
 * @param {string} filename - e.g. "students_export.csv"
 * @param {Array<object>} rows - array of data objects
 * @param {Array<{key: string, label: string, render?: (val, row) => string}>} columns
 */
export function exportToCsv(filename, rows, columns) {
  if (!rows || rows.length === 0) {
    alert('No data to export.');
    return;
  }

  const escape = (val) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str}"`
      : str;
  };

  const header = columns.map((c) => escape(c.label)).join(',');

  const body = rows.map((row) =>
    columns
      .map((col) => {
        const rawVal = row[col.key];
        // Use render if provided, but strip HTML tags for CSV
        const val = col.render ? col.render(rawVal, row) : rawVal;
        const strVal = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');
        return escape(strVal.replace(/<[^>]+>/g, ''));
      })
      .join(',')
  );

  const csvContent = [header, ...body].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
