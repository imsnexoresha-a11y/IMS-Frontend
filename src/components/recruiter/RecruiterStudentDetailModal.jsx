import { useState } from 'react';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import ProgressBar from '../common/ProgressBar';
import Badge from '../common/Badge';
import { Copy, Check } from 'lucide-react';
import Button from '../common/Button';

export default function RecruiterStudentDetailModal({ isOpen, onClose, student }) {
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  const handleCopyEmail = () => {
    if (!student.email) return;
    navigator.clipboard.writeText(student.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Profile" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center', borderBottom: '2px solid var(--color-ink)', paddingBottom: 'var(--space-lg)' }}>
          <Avatar name={student.name} size="xl" />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', margin: 0 }}>{student.name}</h2>
            <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>
              {student.batchName || 'Graduate'}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyEmail}
                disabled={!student.email}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy Email'}
              </Button>
            </div>
          </div>
          <div style={{ width: '140px' }}>
            <ProgressBar
              value={student.overallScore ?? student.totalPoints ?? 0}
              min={30}
              max={100}
              gauge={true}
              label="Score"
            />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-sm)' }}>Skills</h3>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'HTML/CSS', 'Git'].map((skill) => (
              <Badge key={skill} variant="neutral">{skill}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-sm)' }}>Performance Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-xs)' }}>Assignments</div>
              <ProgressBar value={student.assignmentAvg ?? 0} label="Average" size="sm" />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-xs)' }}>Quizzes</div>
              <ProgressBar value={student.quizAvg ?? 0} label="Average" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
