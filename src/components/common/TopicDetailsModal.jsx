import { BookOpen, CheckCircle2, FileText, Eye, Download, Clock } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import { downloadNoteFile } from '../../utils/fileDownloader';

function getCleanFileName(url) {
  if (!url) return 'Document';
  const urlStr = typeof url === 'string' ? url : (url.url || url.path || url.filename || url.name || '');
  if (!urlStr || typeof urlStr !== 'string') return 'Document';
  let name = decodeURIComponent(urlStr.substring(urlStr.lastIndexOf('/') + 1));
  name = name.replace(/^(\d+[-_]|notes-[-_\d]+)/i, '');
  return name || 'Document';
}

export default function TopicDetailsModal({ topic, isOpen, onClose }) {
  if (!topic) return null;

  const objectives = Array.isArray(topic.learningObjectives) ? topic.learningObjectives : [];
  const notesFiles = Array.isArray(topic.notesFiles) 
    ? topic.notesFiles 
    : (Array.isArray(topic.notes) ? topic.notes : []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Curriculum Topic Details" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        
        {/* Header Title & Badges */}
        <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
            <BookOpen size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', margin: 0, flex: 1 }}>
              {topic.title}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
            <Badge variant="neutral">Order #{ (topic.orderIndex ?? topic.order ?? 0) + 1 }</Badge>
            {topic.estimatedHours > 0 && (
              <Badge variant="primary">
                <Clock size={12} style={{ marginRight: '4px' }} /> {topic.estimatedHours} Hours
              </Badge>
            )}
          </div>
        </div>

        {/* Topic Description */}
        {topic.description && (
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-secondary)', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
              Description
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: '1.5', margin: 0 }}>
              {topic.description}
            </p>
          </div>
        )}

        {/* Learning Objectives Checklist */}
        <div>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
            Learning Objectives ({objectives.length})
          </h4>
          {objectives.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', background: 'var(--color-bg)', padding: 'var(--space-md)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              {objectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'var(--color-ink)', fontWeight: 'var(--font-semibold)' }}>{obj}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontStyle: 'italic', margin: 0 }}>
              No specific learning objectives listed for this topic yet.
            </p>
          )}
        </div>

        {/* Study Notes & Learning Materials */}
        <div>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
            Study Materials & Notes ({notesFiles.length})
          </h4>
          {notesFiles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              {notesFiles.map((noteUrl, i) => {
                const cleanName = getCleanFileName(noteUrl);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: 'var(--space-xs) var(--space-md)', border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <FileText size={18} style={{ color: 'var(--color-accent)' }} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-ink)' }}>{cleanName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <Button variant="outline" size="sm" onClick={() => window.open(noteUrl, '_blank', 'noopener,noreferrer')}>
                        <Eye size={14} style={{ marginRight: '4px' }} /> View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => downloadNoteFile(noteUrl, cleanName)}>
                        <Download size={14} style={{ marginRight: '4px' }} /> Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontStyle: 'italic', margin: 0 }}>
              No notes or study materials uploaded yet for this topic.
            </p>
          )}
        </div>

        {/* Footer Close */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xs)' }}>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}
