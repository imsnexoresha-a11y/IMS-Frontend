import { useNavigate } from 'react-router-dom';
import { useTeacherDashboard } from '../../hooks/useDashboard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function BatchList() {
  const navigate = useNavigate();
  const { data: batches = [], isLoading, isError } = useTeacherDashboard();

  if (isLoading) {
    return <div style={{ padding: 'var(--space-md)', textAlign: 'center', fontSize: 'var(--text-sm)' }}>Loading batches...</div>;
  }

  if (isError) {
    return <div style={{ padding: 'var(--space-md)', color: 'var(--color-danger)', fontSize: 'var(--text-sm)' }}>Error loading batches from database.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
      {batches.map((batch) => {
        const batchId = batch._id || batch.id;
        return (
          <Card key={batchId} onClick={() => navigate(`/teacher/batches/${batchId}`)} title={batch.name}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {batch.studentCount ?? 0} students
                </span>
                <Badge variant={batch.status === 'active' || batch.status === 'ongoing' ? 'success' : 'neutral'} dot>
                  {batch.status}
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                {batch.lectureCount ?? 0} lectures
              </div>
            </div>
          </Card>
        );
      })}
      {batches.length === 0 && (
        <div style={{ padding: 'var(--space-md)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          No batches assigned to you.
        </div>
      )}
    </div>
  );
}
