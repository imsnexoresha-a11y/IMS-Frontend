import { useState, useEffect } from 'react';
import StudentTopicList from '../../components/student/StudentTopicList';
import { getCurriculum } from '../../api/studentApi';

export default function StudentCurriculumPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const data = await getCurriculum();
        setTopics(data || []);
      } catch (err) {
        console.error('Failed to load curriculum', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  return (
    <div style={{ padding: 'var(--space-xl)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xl)', color: 'var(--color-primary)' }}>Curriculum</h1>
      {loading ? (
        <p>Loading curriculum...</p>
      ) : (
        <StudentTopicList topics={topics} />
      )}
    </div>
  );
}

