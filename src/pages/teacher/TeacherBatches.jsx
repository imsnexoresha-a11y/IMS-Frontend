import BatchList from '../../components/teacher/BatchList';

export default function TeacherBatches() {
  return (
    <div>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-md)' }}>My Batches</h2>
      <BatchList />
    </div>
  );
}
