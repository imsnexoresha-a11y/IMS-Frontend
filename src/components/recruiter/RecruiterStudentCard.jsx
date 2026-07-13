import { Copy, Mail } from 'lucide-react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

export default function RecruiterStudentCard({ student, onClick }) {
  return (
    <div
      onClick={() => onClick?.(student)}
      style={{
        border: '2px solid var(--color-ink)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        cursor: 'pointer',
        transition: 'transform 150ms, box-shadow 150ms',
        boxShadow: 'var(--shadow-offset)'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-offset)'; }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
        <Avatar name={student.name} size="lg" />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>{student.name}</h3>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <Mail size={14} /> {student.email}
          </div>
        </div>
      </div>

      <div>
        <ProgressBar value={student.totalMarks} min={30} max={100} gauge={true} label="Overall Score" />
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap' }}>
        <Badge variant="accent">Full-Stack</Badge>
        <Badge variant="neutral">React</Badge>
        <Badge variant="neutral">Node.js</Badge>
      </div>

      <Button variant="ghost" fullWidth onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(student.email); }}>
        <Copy size={16} /> Copy Email
      </Button>
    </div>
  );
}
