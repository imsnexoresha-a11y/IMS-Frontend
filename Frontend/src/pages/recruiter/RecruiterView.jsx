import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import RecruiterStudentList from '../../components/recruiter/RecruiterStudentList';
import RecruiterStudentDetailModal from '../../components/recruiter/RecruiterStudentDetailModal';

export default function RecruiterView() {
  const { uuid } = useParams();
  const [selectedStudent, setSelectedStudent] = useState(null);

  // In a real app, we'd validate the UUID with the backend.
  // For mock purposes, just assume it's valid if it exists.
  if (!uuid) return <Navigate to="/login" replace />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: 'var(--space-2xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-2xl)', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-black)', color: 'var(--color-ink)', marginBottom: 'var(--space-sm)' }}>
            IMS Cohort Portfolio
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>
            Meet our latest full-stack graduates. Click any profile to view detailed performance and skills.
          </p>
        </div>

        <RecruiterStudentList onStudentClick={setSelectedStudent} />

        <RecruiterStudentDetailModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
        />
      </div>
    </div>
  );
}
