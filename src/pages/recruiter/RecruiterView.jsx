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

  const [selectedStudentId, setSelectedStudentId] =
    useState(null);

  const { data, isLoading, error } =
    useRecruiterStudents(uuid);

  const {
    data: studentDetail,
  } = useRecruiterStudent(
    uuid,
    selectedStudentId
  );

  if (!uuid) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {error.message}
      </div>
    );
  }

  const students =
    data?.students || [];

  const batchName =
    data?.batchName ||
    'Portfolio';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor:
          'var(--color-bg)',
        padding:
          'var(--space-2xl)',
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
            marginBottom:
              'var(--space-2xl)',
            textAlign: 'center',
          }}
        >
          <h1>
            {batchName}
          </h1>

          <p>
            Meet our latest
            graduates.
          </p>
        </div>

        <RecruiterStudentList
          students={students}
          onStudentClick={(
            student
          ) =>
            setSelectedStudentId(
              student.id
            )
          }
        />

        <RecruiterStudentDetailModal
          isOpen={
            !!selectedStudentId
          }
          onClose={() =>
            setSelectedStudentId(
              null
            )
          }
          student={
            studentDetail?.student
          }
        />
      </div>
    </div>
  );
}