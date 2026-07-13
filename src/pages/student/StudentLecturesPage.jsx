import { useState, useEffect } from 'react';
import StudentUpcomingLectures from '../../components/student/StudentUpcomingLectures';
import { getStudentDashboard } from '../../api/studentApi';

export default function StudentLecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLectures() {
      try {
        const data = await getStudentDashboard();
        setLectures(data.upcomingLectures || []);
      } catch (err) {
        console.error('Failed to load lectures', err);
      } finally {
        setLoading(false);
      }
    }
    loadLectures();
  }, []);

  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xl)', color: 'var(--color-primary)' }}>Lectures</h1>
      {loading ? (
        <p>Loading lectures...</p>
      ) : (
        <StudentUpcomingLectures lectures={lectures} />
      )}
    </div>
  );
}

