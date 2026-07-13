import StudentQuiz from '../../components/student/StudentQuiz';

export default function StudentQuizPage() {
  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xl)', color: 'var(--color-primary)' }}>Quizzes & Assessments</h1>
      <StudentQuiz />
    </div>
  );
}
