import Card from '../common/Card';
import { formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function StudentUpcomingLectures({ lectures = [] }) {
  const upcoming = lectures
    .filter((l) => l.status === 'scheduled' || l.status === 'Scheduled')
    .slice(0, 3);

  return (
    <Card title="Upcoming Lectures">
      {upcoming.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>No upcoming lectures.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {upcoming.map((lecture) => (
            <div key={lecture.id || lecture._id} className="student-block-hover" style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 'var(--space-sm) var(--space-md)',
            }}>
              <div>
                <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>{lecture.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {formatDateTime(lecture.date || lecture.scheduledDate)} • Instructor: {lecture.teacherName || 'TBA'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <Badge variant="info" className="badge-glow">Scheduled</Badge>
                <Button variant="primary" size="sm" onClick={() => window.open(lecture.meetUrl || lecture.joinUrl || lecture.meetingLink || '#', '_blank')}>
                  Attend
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
