import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, FileText, Eye, Download } from 'lucide-react';
import Badge from '../common/Badge';
import Button, { IconButton } from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import TopicDetailsModal from '../common/TopicDetailsModal';
import { downloadNoteFile } from '../../utils/fileDownloader';

function getCleanFileName(url) {
  if (!url) return 'Document';
  let name = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1));
  name = name.replace(/^(\d+[-_]|notes-[-_\d]+)/i, '');
  return name || 'Document';
}

export default function StudentTopicList({ topics = [] }) {
  const [expanded, setExpanded] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (topics.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Course Material</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>No topics available yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>Course Material</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {topics.map((topic) => {
          const tid = topic.id || topic._id;
          const isExpanded = !!expanded[tid];
          const notes = topic.notesFiles || topic.notes || [];

          return (
            <div key={tid} className="student-block-hover" style={{ border: '2px solid var(--color-ink)', backgroundColor: 'var(--color-surface)' }}>
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)',
                  backgroundColor: isExpanded ? 'var(--color-bg)' : 'transparent',
                }}
              >
                <div onClick={() => toggle(tid)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <BookOpen size={20} style={{ color: 'var(--color-accent)', cursor: 'pointer' }} onClick={() => setSelectedTopic(topic)} />
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setSelectedTopic(topic)}>
                  <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-ink)' }}>{topic.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {topic.lectureCount || 0} lectures · {notes.length} notes
                  </div>
                </div>
                <div style={{ width: '100px' }}>
                  <ProgressBar value={topic.completed ? 100 : 40} showValue={false} size="sm" />
                </div>
                {topic.completed ? <Badge variant="success">Done</Badge> : <Badge variant="neutral">Active</Badge>}

                <IconButton
                  icon={Eye}
                  size="sm"
                  label="View Topic Details & Learning Objectives"
                  onClick={() => setSelectedTopic(topic)}
                />
              </div>

              {isExpanded && (
                <div style={{ padding: 'var(--space-md)', borderTop: '2px solid var(--color-ink)', backgroundColor: 'var(--color-surface)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-sm)' }}>Notes & Resources</h4>
                  {notes.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                      {notes.map((noteUrl, index) => {
                        const filename = getCleanFileName(noteUrl);
                        return (
                          <div key={index} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: 'var(--space-xs) var(--space-sm)', border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--color-bg)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <FileText size={16} style={{ color: 'var(--color-info)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', color: 'var(--color-ink)' }}>{filename}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                              <Button variant="outline" size="sm" onClick={() => window.open(noteUrl, '_blank', 'noopener,noreferrer')}>
                                <Eye size={12} style={{ marginRight: '2px' }} /> View
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => downloadNoteFile(noteUrl, filename)}>
                                <Download size={12} style={{ marginRight: '2px' }} /> Download
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>No resources uploaded yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      <TopicDetailsModal
        topic={selectedTopic}
        isOpen={Boolean(selectedTopic)}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
}
