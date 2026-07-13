import { MessageSquare, Check, X } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function AssignmentFeedbackView({ submission }) {
  if (!submission) return null;

  return (
    <Card title="Code Review Feedback">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Status</div>
            <Badge variant={submission.status === 'passed' ? 'success' : 'error'}>
              {submission.status === 'passed' ? <><Check size={14} style={{ marginRight: '4px' }}/> Passed</> : <><X size={14} style={{ marginRight: '4px' }}/> Needs Work</>}
            </Badge>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Score</div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', color: 'var(--color-accent)' }}>
              {submission.score ?? '—'} / 100
            </div>
          </div>
        </div>

        {submission.feedback && (
          <div style={{
            padding: 'var(--space-md)',
            backgroundColor: 'var(--color-bg)',
            borderLeft: '4px solid var(--color-accent)',
            fontSize: 'var(--text-sm)',
            lineHeight: '1.5',
            marginTop: 'var(--space-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)', fontWeight: 'var(--font-bold)' }}>
              <MessageSquare size={16} /> Reviewer Comments
            </div>
            {submission.feedback}
          </div>
        )}
      </div>
    </Card>
  );
}
