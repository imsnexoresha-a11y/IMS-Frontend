import RecruiterStudentCard from './RecruiterStudentCard';
import EmptyState from '../common/EmptyState';

export default function RecruiterStudentList({
  students = [],
  onStudentClick,
}) {
  const activeStudents = students.filter(
    (student) => !student.status || String(student.status).toLowerCase() !== 'inactive'
  );

  const displayList = activeStudents.length > 0 ? activeStudents : students;

  if (displayList.length === 0) {
    return (
      <EmptyState
        title="No student portfolios available"
        description="There are currently no active students listed in this batch."
      />
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-xl)',
      }}
    >
      {displayList.map((student) => (
        <RecruiterStudentCard
          key={student.id || student._id}
          student={student}
          onClick={onStudentClick}
        />
      ))}
    </div>
  );
}