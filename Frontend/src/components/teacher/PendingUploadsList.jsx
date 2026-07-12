import { Clock, Upload } from 'lucide-react';
import Card from '../common/Card';
import { useTeacherDashboardStats } from '../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

export default function PendingUploadsList() {
  const { data, isLoading } = useTeacherDashboardStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card title="Pending Uploads">
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-md) 0' }}>
          Loading action items...
        </p>
      </Card>
    );
  }

  const attendanceItems = (data?.pendingAttendance || []).map((session) => ({
    id: `att-${session._id || session.id}`,
    type: 'Attendance',
    lecture: session.title,
    lectureId: session._id || session.id,
    batchId: session.batchId,
    date: new Date(session.sessionDateAndTime || session.date || Date.now()).toLocaleDateString(),
  }));

  const quizItems = (data?.pendingQuiz || []).map((session) => ({
    id: `quiz-${session._id || session.id}`,
    type: 'Quiz',
    lecture: session.title,
    lectureId: session._id || session.id,
    batchId: session.batchId,
    date: new Date(session.sessionDateAndTime || session.date || Date.now()).toLocaleDateString(),
  }));

  const pendingItems = [...attendanceItems, ...quizItems];

  return (
    <Card title="Pending Uploads">
      {pendingItems.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>All uploads are up to date!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {pendingItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/teacher/batches/${item.batchId}`, {
                state: {
                  activeTab: item.type === 'Attendance' ? 3 : 4,
                  selectedLectureId: item.lectureId
                }
              })}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-sm) var(--space-md)', border: '2px solid var(--color-warning)',
                backgroundColor: 'var(--color-warning-bg)', cursor: 'pointer',
                transition: 'border-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-warning)'}
            >
              <Upload size={16} style={{ color: 'var(--color-warning)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-bold)' }}>
                  {item.type} — {item.lecture}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {item.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
