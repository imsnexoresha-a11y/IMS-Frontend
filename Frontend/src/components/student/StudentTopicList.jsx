import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react';

import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function StudentTopicList({ topics = [] }) {
  const [expanded, setExpanded] = useState({});

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
          const isExpanded = !!expanded[topic.id || topic._id];
          return (
            <div key={topic.id || topic._id} className="student-block-hover" style={{ border: '2px solid var(--color-ink)', backgroundColor: 'var(--color-surface)' }}>
              <div
                onClick={() => toggle(topic.id || topic._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)',
                  cursor: 'pointer', backgroundColor: isExpanded ? 'var(--color-bg)' : 'transparent',
                }}
              >
                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <BookOpen size={20} style={{ color: 'var(--color-accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'var(--font-bold)' }}>{topic.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {topic.lectureCount || 0} lectures
                  </div>
                </div>
                <div style={{ width: '100px' }}>
                  <ProgressBar value={topic.completed ? 100 : 40} showValue={false} size="sm" />
                </div>
                {topic.completed ? <Badge variant="success">Done</Badge> : <Badge variant="neutral">Active</Badge>}
              </div>

              {isExpanded && (
                <div style={{ padding: 'var(--space-md)', borderTop: '2px solid var(--color-ink)', backgroundColor: 'var(--color-surface)' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-sm)' }}>Notes & Resources</h4>
                  {topic.notesFiles && topic.notesFiles.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                      {topic.notesFiles.map((noteUrl, index) => {
                        // Extract filename from URL (Cloudinary or local path)
                        const filename = noteUrl.substring(noteUrl.lastIndexOf('/') + 1) || `Resource_${index + 1}`;
                        return (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-xs) 0' }}>
                            <FileText size={16} style={{ color: 'var(--color-info)' }} />
                            <a
                              href={noteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', textDecoration: 'underline' }}
                            >
                              {filename}
                            </a>
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
    </div>
  );
}
