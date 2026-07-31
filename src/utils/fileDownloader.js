/**
 * Download a note document preserving its exact extension and clean filename.
 * @param {string} url - File URL (Cloudinary or local static path)
 * @param {string} suggestedName - Suggested display filename
 */
export async function downloadNoteFile(url, suggestedName) {
  if (!url) return;

  try {
    // Determine file extension
    let ext = '';
    const match = url.match(/\.(pdf|docx|md|txt|png|jpg|jpeg)($|\?)/i);
    if (match) {
      ext = '.' + match[1].toLowerCase();
    } else if (suggestedName && suggestedName.includes('.')) {
      ext = '.' + suggestedName.split('.').pop().toLowerCase();
    } else {
      ext = '.pdf';
    }

    // Extract clean base filename without timestamp prefixes or hashes
    let cleanName = suggestedName 
      ? decodeURIComponent(suggestedName).replace(/^(\d+[-_]|notes-[-_\d]+)/i, '') 
      : 'Document';

    // Remove trailing extension if already present, then re-append standardized extension
    const baseName = cleanName.replace(/\.(pdf|docx|md|txt|png|jpg|jpeg)$/i, '');
    cleanName = `${baseName}${ext}`;

    // Cloudinary attachment flag helper
    let fetchUrl = url;
    if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/fl_attachment/')) {
      fetchUrl = url.replace('/upload/', '/upload/fl_attachment/');
    }

    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Fetch failed');
    const blob = await response.blob();

    // Determine correct MIME type for Blob creation
    let mimeType = blob.type;
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.md' || ext === '.txt') mimeType = 'text/plain;charset=utf-8';
    }

    const typedBlob = new Blob([blob], { type: mimeType });
    const blobUrl = window.URL.createObjectURL(typedBlob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  } catch (err) {
    // Fallback: Use Cloudinary fl_attachment or direct open
    let fallbackUrl = url;
    if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/fl_attachment/')) {
      fallbackUrl = url.replace('/upload/', '/upload/fl_attachment/');
    }
    const link = document.createElement('a');
    link.href = fallbackUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = suggestedName || 'Document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
