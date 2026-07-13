import StudentAssignments from '../../components/student/StudentAssignments';

export default function StudentAssignmentsPage() {
  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xl)', color: 'var(--color-primary)' }}>My Assignments</h1>
      <StudentAssignments />
    </div>
  );
}
