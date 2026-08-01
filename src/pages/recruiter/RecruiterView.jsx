import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import RecruiterStudentList from '../../components/recruiter/RecruiterStudentList';
import RecruiterStudentDetailModal from '../../components/recruiter/RecruiterStudentDetailModal';

import {
  useRecruiterStudents,
  useRecruiterStudent,
} from '../../hooks/useRecruiter';

export default function RecruiterView() {
  const { uuid } = useParams();

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const { data, isLoading, error } = useRecruiterStudents(uuid);

  const { data: studentDetail } = useRecruiterStudent(
    uuid,
    selectedStudentId
  );

  if (!uuid) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontWeight: 'var(--font-bold)' }}>
        Loading batch portfolio...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--color-danger, #d73a49)' }}>
        <h3>Unable to Load Portfolio</h3>
        <p>{error.message || 'The recruiter link may be invalid or inactive.'}</p>
      </div>
    );
  }

  const students = Array.isArray(data) ? data : (data?.students || []);
  const batchName = data?.batchName || 'Batch Portfolio';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-2xl)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            marginBottom: 'var(--space-2xl)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xs)' }}>
            {batchName}
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Meet our latest graduates and top performing interns.
          </p>
        </div>

        <RecruiterStudentList
          students={students}
          onStudentClick={(student) =>
            setSelectedStudentId(student.id || student._id)
          }
        />

        <RecruiterStudentDetailModal
          isOpen={!!selectedStudentId}
          onClose={() => setSelectedStudentId(null)}
          student={studentDetail?.student || studentDetail}
        />
      </div>
    </div>
  );
}