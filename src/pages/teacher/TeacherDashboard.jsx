import BatchList from '../../components/teacher/BatchList';
import PendingUploadsList from '../../components/teacher/PendingUploadsList';
import TeacherUpcomingLectures from '../../components/teacher/TeacherUpcomingLectures';

export default function TeacherDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-md)' }}>My Batches</h2>
            <BatchList />
          </div>
          <div>
            <TeacherUpcomingLectures />
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-md)' }}>Action Items</h2>
          <PendingUploadsList />
        </div>
      </div>
    </div>
  );
}
