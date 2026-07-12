import Card from '../common/Card';
import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { useTeacherDashboardStats } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

export default function TeacherUpcomingLectures() {
  const { data, isLoading } = useTeacherDashboardStats();
  const upcoming = data?.upcomingSessions || [];
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card title="Upcoming Lectures">
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-md) 0' }}>
          Loading upcoming lectures...
        </p>
      </Card>
    );
  }

  return (
    <Card title="Upcoming Lectures">
      {upcoming.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>No upcoming lectures scheduled.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {upcoming.map((lecture) => (
            <div 
              key={lecture._id || lecture.id} 
              onClick={() => navigate(`/teacher/batches/${lecture.batchId}`, { state: { activeTab: 2 } })}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-sm) var(--space-md)',
                border: '2px solid var(--color-neutral)',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-neutral)'}
            >
              <div>
                <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>{lecture.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {formatDateTime(lecture.sessionDateAndTime || lecture.date)}
                </div>
              </div>
              <Badge variant="info">Scheduled</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
