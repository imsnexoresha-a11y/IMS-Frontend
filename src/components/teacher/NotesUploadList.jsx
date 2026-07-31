import { FileText, Trash2, Check, Eye, Download } from 'lucide-react';
import FileUpload from '../common/FileUpload';
import Button, { IconButton } from '../common/Button';
import { downloadNoteFile } from '../../utils/fileDownloader';

function getCleanFileName(urlOrName) {
  if (!urlOrName) return 'Document';
  const urlStr = typeof urlOrName === 'string' ? urlOrName : (urlOrName.url || urlOrName.path || urlOrName.filename || urlOrName.name || '');
  if (!urlStr || typeof urlStr !== 'string') return 'Document';
  let name = decodeURIComponent(urlStr.substring(urlStr.lastIndexOf('/') + 1));
  name = name.replace(/^(\d+[-_]|notes-[-_\d]+)/i, '');
  return name || 'Document';
}

export default function NotesUploadList({ notes = [], topicTitle = 'Topic', onUpload, onDeleteNote, onClose }) {
  const isLimitReached = notes.length >= 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h4 style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-md)' }}>Notes for {topicTitle}</h4>
      
      {notes.length === 0 ? (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', padding: 'var(--space-sm) 0' }}>
          No notes uploaded yet. (Max 5 files, up to 10MB each)
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {notes.map((note) => {
            const rawUrl = note.id && (note.id.startsWith('http') || note.id.startsWith('/') || note.id.includes('.'))
              ? (note.id.startsWith('http') ? note.id : `http://localhost:4000/${note.id}`)
              : null;
            const displayName = getCleanFileName(note.filename || note.name || note.id);

            return (
              <div key={note.id || note.fileId} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                padding: 'var(--space-xs) var(--space-sm)', border: '2px solid var(--color-neutral)',
                backgroundColor: 'var(--color-surface)',
              }}>
                <FileText size={16} style={{ color: 'var(--color-accent)' }} />
                <span style={{ flex: 1, fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>

                {rawUrl && (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Button variant="outline" size="sm" onClick={() => window.open(rawUrl, '_blank', 'noopener,noreferrer')}>
                      <Eye size={12} style={{ marginRight: '2px' }} /> View
                    </Button>
                    <IconButton icon={Download} size="sm" label="Download Note" onClick={() => downloadNoteFile(rawUrl, displayName)} />
                  </div>
                )}

                <IconButton
                  icon={Trash2}
                  size="sm"
                  variant="danger"
                  label="Delete notes"
                  onClick={() => onDeleteNote?.(note.id || note.fileId)}
                />
              </div>
            );
          })}
        </div>
      )}
      
      {isLimitReached ? (
        <div style={{
          padding: 'var(--space-sm)',
          border: '2px solid var(--color-neutral)',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-xs)',
          textAlign: 'center',
          fontWeight: 'var(--font-bold)'
        }}>
          Maximum limit of 5 files reached. Delete notes to upload more.
        </div>
      ) : (
        <FileUpload
          label="Upload New Notes (.pdf, .md, .docx)"
          accept=".pdf,.md,.docx,application/pdf,text/markdown,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onFileSelect={onUpload}
          maxSizeMB={10}
          multiple={true}
        />
      )}

      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
          <Button variant="primary" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={16} /> Save & Close
          </Button>
        </div>
      )}
    </div>
  );
}
