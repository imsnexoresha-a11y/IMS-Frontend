import StudentPortfolio from '../../components/student/StudentPortfolio';

export default function StudentPortfolioPage() {
  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xl)', color: 'var(--color-primary)' }}>My Portfolio</h1>
      <StudentPortfolio />
    </div>
  );
}
