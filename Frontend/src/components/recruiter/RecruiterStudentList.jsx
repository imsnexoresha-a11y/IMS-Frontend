import RecruiterStudentCard from './RecruiterStudentCard';

export default function RecruiterStudentList({ students = [], onStudentClick }) {
  const activeStudents = students.filter(s => s.status === 'active');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 'var(--space-xl)'
    }}>
      {activeStudents.map((student) => (
        <RecruiterStudentCard key={student.id} student={student} onClick={onStudentClick} />
      ))}
    </div>
  );
}
