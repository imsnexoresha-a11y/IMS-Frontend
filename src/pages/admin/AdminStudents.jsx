import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  useBulkUploadStudents,
  useCreateStudent,
  useMoveStudentToBatch,
  useStudents,
  useUpdateStudentStatus,
} from '../../hooks/useStudents';
import { useTeachers } from '../../hooks/useTeachers';

import * as adminApi from '../../api/adminApi';

import StudentTable from '../../components/admin/StudentTable';
import BulkUploadCSVModal from '../../components/admin/BulkUploadCSVModal';
import CreateStudentForm from '../../components/admin/CreateStudentForm';

import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

function getStudentId(student) {
  return student?._id || student?.id;
}

function getStudentName(student) {
  return (
    student?.userId?.name ||
    student?.user?.name ||
    student?.name ||
    'Student'
  );
}

function getStudentStatus(student) {
  return (
    student?.userId?.profileStatus ||
    student?.user?.profileStatus ||
    student?.profileStatus ||
    'Inactive'
  );
}

export default function AdminStudents() {
  const [bulkModalOpen, setBulkModalOpen] =
    useState(false);

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const [
    studentForStatusChange,
    setStudentForStatusChange,
  ] = useState(null);

  const [
    studentForBatchMove,
    setStudentForBatchMove,
  ] = useState(null);

  const [newBatchId, setNewBatchId] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  const [pageError, setPageError] =
    useState('');

  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

  const {
    data: students = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useStudents();

  const {
    data: batches = [],
    isLoading: batchesLoading,
  } = useQuery({
    queryKey: ['batches'],
    queryFn: () => adminApi.getBatches(),
    staleTime: 30 * 1000,
    retry: 1,
  });

  const { data: teachers = [] } = useTeachers();

  const createStudentMutation =
    useCreateStudent();

  const bulkUploadMutation =
    useBulkUploadStudents();

  const statusMutation =
    useUpdateStudentStatus();

  const moveBatchMutation =
    useMoveStudentToBatch();

  const handleCreateStudent =
    async (studentData) => {
      setPageError('');
      setSuccessMessage('');

      try {
        await createStudentMutation.mutateAsync(
          studentData
        );

        setSuccessMessage(
          'Student created successfully.'
        );

        setAddModalOpen(false);
      } catch (mutationError) {
        const message =
          mutationError?.message ||
          'Unable to create student.';

        setPageError(message);
        throw mutationError;
      }
    };

  const handleBulkUpload =
    async (studentRecords) => {
      setPageError('');
      setSuccessMessage('');

      try {
        const result =
          await bulkUploadMutation.mutateAsync(
            studentRecords
          );

        const createdCount =
          result?.createdCount ?? 0;

        const errorCount =
          result?.errorCount ?? 0;

        setSuccessMessage(
          `Bulk creation completed: ${createdCount} created, ${errorCount} failed.`
        );

        if (
          Array.isArray(result?.errors) &&
          result.errors.length > 0
        ) {
          setPageError(
            result.errors
              .map(
                (item) =>
                  `Row ${Number(item.index) + 2
                  }: ${item.message}`
              )
              .join(' | ')
          );
        }

        setBulkModalOpen(false);
      } catch (mutationError) {
        setPageError(
          mutationError?.message ||
          'Unable to upload students.'
        );

        throw mutationError;
      }
    };

  const handleConfirmStatusChange =
    async () => {
      if (!studentForStatusChange) {
        return;
      }

      const id = getStudentId(
        studentForStatusChange
      );

      const currentStatus = getStudentStatus(
        studentForStatusChange
      );

      const nextStatus =
        currentStatus === 'Active'
          ? 'Inactive'
          : 'Active';

      setPageError('');
      setSuccessMessage('');

      try {
        await statusMutation.mutateAsync({
          id,
          profileStatus: nextStatus,
        });

        setSuccessMessage(
          `${getStudentName(
            studentForStatusChange
          )} is now ${nextStatus}.`
        );

        setStudentForStatusChange(null);
      } catch (mutationError) {
        setPageError(
          mutationError?.message ||
          'Unable to update student status.'
        );

        setStudentForStatusChange(null);
      }
    };

  const openBatchMoveModal = (student) => {
    const currentBatchId =
      typeof student.batchId === 'object'
        ? student.batchId?._id ||
        student.batchId?.id
        : student.batchId;

    setStudentForBatchMove(student);
    setNewBatchId(currentBatchId || '');
    setPageError('');
  };

  const handleMoveBatch = async () => {
    if (
      !studentForBatchMove ||
      !newBatchId
    ) {
      setPageError(
        'Select a destination batch.'
      );
      return;
    }

    const id = getStudentId(
      studentForBatchMove
    );

    setPageError('');
    setSuccessMessage('');

    try {
      await moveBatchMutation.mutateAsync({
        id,
        newBatchId,
      });

      setSuccessMessage(
        `${getStudentName(
          studentForBatchMove
        )} was moved successfully.`
      );

      setStudentForBatchMove(null);
      setNewBatchId('');
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to move student.'
      );
    }
  };

  if (isLoading || batchesLoading) {
    return <p>Loading students...</p>;
  }

  if (isError) {
    return (
      <Card title="Unable to Load Students">
        <p
          style={{
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {error?.message ||
            'Unable to fetch students.'}
        </p>

        <Button
          type="button"
          variant="primary"
          onClick={() => refetch()}
        >
          Retry
        </Button>
      </Card>
    );
  }

  const getStudentDetails = () => {
    if (!selectedStudentDetails) return null;
    const batch = batches.find(b => String(b.id || b._id) === String(selectedStudentDetails.batchId?.id || selectedStudentDetails.batchId?._id || selectedStudentDetails.batchId));
    
    let teacherNames = 'None';
    if (batch) {
      if (batch.teacherIds && batch.teacherIds.length > 0) {
        const assignedTeachers = teachers.filter(t => batch.teacherIds.includes(String(t.id || t._id)));
        if (assignedTeachers.length > 0) {
          teacherNames = assignedTeachers.map(t => t.userId?.name || t.name).join(', ');
        }
      } else if (batch.teacherId) {
        // Fallback for mockBatches
        const assignedTeacher = teachers.find(t => String(t.id || t._id) === String(batch.teacherId));
        if (assignedTeacher) {
           teacherNames = assignedTeacher.userId?.name || assignedTeacher.name;
        } else {
           teacherNames = batch.teacherName || 'None';
        }
      }
    }

    return {
      batchName: batch ? batch.name : 'Not Assigned',
      instructor: teacherNames
    };
  };

  const details = getStudentDetails();

  const selectedStudentIsActive =
    getStudentStatus(
      studentForStatusChange
    ) === 'Active';

  const updatingStudentId =
    statusMutation.isPending
      ? getStudentId(
        studentForStatusChange
      )
      : moveBatchMutation.isPending
        ? getStudentId(
          studentForBatchMove
        )
        : null;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        {successMessage && (
          <Badge variant="success">
            {successMessage}
          </Badge>
        )}

        {pageError && (
          <div
            role="alert"
            style={{
              padding: 'var(--space-sm)',
              border:
                '2px solid var(--color-danger)',
              color: 'var(--color-danger)',
              fontWeight:
                'var(--font-bold)',
            }}
          >
            {pageError}
          </div>
        )}

        <StudentTable
          students={students}
          batches={batches}
          onAdd={() =>
            setAddModalOpen(true)
          }
          onBulkUpload={() =>
            setBulkModalOpen(true)
          }
          onStatusChange={
            setStudentForStatusChange
          }
          onRowClick={setSelectedStudentDetails}
          onMoveBatch={openBatchMoveModal}
          updatingStudentId={
            updatingStudentId
          }
        />
      </div>

      <Modal isOpen={!!selectedStudentDetails} onClose={() => setSelectedStudentDetails(null)} title="Student Details" size="md">
        {selectedStudentDetails && details && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
            <Card className="student-block-hover">
              <div style={{ padding: 'var(--space-sm)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>{getStudentName(selectedStudentDetails)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-sm)' }}>{selectedStudentDetails.userId?.email || selectedStudentDetails.email || 'No email provided'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Assigned Batch</p>
                    <p style={{ fontWeight: '600' }}>{details.batchName}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Instructor(s)</p>
                    <p style={{ fontWeight: '600' }}>{details.instructor}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={addModalOpen}
        onClose={() =>
          setAddModalOpen(false)
        }
        title="Add Student"
        size="md"
      >
        <CreateStudentForm
          batches={batches}
          onCancel={() =>
            setAddModalOpen(false)
          }
          onSubmit={handleCreateStudent}
        />
      </Modal>

      <BulkUploadCSVModal
        isOpen={bulkModalOpen}
        onClose={() =>
          setBulkModalOpen(false)
        }
        onUpload={handleBulkUpload}
        isUploading={
          bulkUploadMutation.isPending
        }
      />
      <ConfirmDialog
        isOpen={Boolean(studentForStatusChange)}
        title={
          selectedStudentIsActive
            ? 'Deactivate Student'
            : 'Activate Student'
        }
        message={
          studentForStatusChange
            ? `${selectedStudentIsActive
              ? 'Deactivate'
              : 'Activate'
            } "${getStudentName(studentForStatusChange)}"?`
            : ''
        }
        confirmLabel={
          selectedStudentIsActive
            ? 'Deactivate'
            : 'Activate'
        }
        variant={
          selectedStudentIsActive
            ? 'danger'
            : 'primary'
        }
        loading={statusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onClose={() =>
          setStudentForStatusChange(null)
        }
      />


      <Modal
        isOpen={Boolean(
          studentForBatchMove
        )}
        onClose={() => {
          if (!moveBatchMutation.isPending) {
            setStudentForBatchMove(null);
            setNewBatchId('');
          }
        }}
        title="Move Student to Batch"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              disabled={
                moveBatchMutation.isPending
              }
              onClick={() => {
                setStudentForBatchMove(null);
                setNewBatchId('');
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              disabled={
                !newBatchId ||
                moveBatchMutation.isPending
              }
              onClick={handleMoveBatch}
            >
              {moveBatchMutation.isPending
                ? 'Moving...'
                : 'Move Student'}
            </Button>
          </>
        }
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
        >
          <p>
            Move{' '}
            <strong>
              {getStudentName(
                studentForBatchMove
              )}
            </strong>{' '}
            to:
          </p>

          <select
            value={newBatchId}
            onChange={(event) =>
              setNewBatchId(
                event.target.value
              )
            }
            style={{
              width: '100%',
              padding: 'var(--space-sm)',
              border: 'var(--border)',
              background:
                'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          >
            <option value="">
              Select batch
            </option>

            {batches.map((batch) => (
              <option
                key={batch._id || batch.id}
                value={batch._id || batch.id}
              >
                {batch.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </>
  );
}