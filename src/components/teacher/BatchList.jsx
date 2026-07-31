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
        const studentCount = batch.studentCount ?? (Array.isArray(batch.studentIds) ? batch.studentIds.length : (Array.isArray(batch.students) ? batch.students.length : 0));
        const lectureCount = batch.lectureCount ?? (Array.isArray(batch.sessions) ? batch.sessions.length : (Array.isArray(batch.lectures) ? batch.lectures.length : 0));
        return (
          <Card key={batchId} onClick={() => navigate(`/teacher/batches/${batchId}`)} title={batch.name}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {studentCount} {studentCount === 1 ? 'student' : 'students'}
                </span>
                <Badge variant={batch.status === 'active' || batch.status === 'ongoing' ? 'success' : 'neutral'} dot>
                  {batch.status}
                </Badge>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                {lectureCount} {lectureCount === 1 ? 'lecture' : 'lectures'}
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
