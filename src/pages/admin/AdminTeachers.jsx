import { useState } from 'react';

import {
  useCreateTeacher,
  useTeachers,
  useUpdateTeacher,
  useUpdateTeacherStatus,
} from '../../hooks/useTeachers';
import { useBatches } from '../../hooks/useBatches';
import { useStudents } from '../../hooks/useStudents';

import TeacherTable from '../../components/admin/TeacherTable';
import EditTeacherModal from '../../components/admin/EditTeacherModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

export default function AdminTeachers() {
  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    selectedTeacher,
    setSelectedTeacher,
  ] = useState(null);

  const [
    teacherForStatusChange,
    setTeacherForStatusChange,
  ] = useState(null);

  const [detailsTeacher, setDetailsTeacher] = useState(null);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [pageError, setPageError] =
    useState('');

  const {
    data: teachers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTeachers();

  const { data: batches = [] } = useBatches();
  const { data: students = [] } = useStudents();

  const createTeacherMutation =
    useCreateTeacher();

  const updateTeacherMutation =
    useUpdateTeacher();

  const statusMutation =
    useUpdateTeacherStatus();

  const handleAdd = () => {
    setSelectedTeacher(null);
    setSuccessMessage('');
    setPageError('');
    setModalOpen(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setSuccessMessage('');
    setPageError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleSave = async ({
    id,
    data,
    mode,
  }) => {
    setSuccessMessage('');
    setPageError('');

    try {
      if (mode === 'edit' && id) {
        await updateTeacherMutation.mutateAsync({
          id,
          data,
        });

        setSuccessMessage(
          'Teacher updated successfully.'
        );

        return;
      }

      await createTeacherMutation.mutateAsync(
        data
      );

      setSuccessMessage(
        'Teacher created successfully.'
      );
    } catch (mutationError) {
      const message =
        mutationError?.message ||
        'Unable to save teacher.';

      setPageError(message);

      throw mutationError;
    }
  };

  const handleConfirmStatusChange =
    async () => {
      if (!teacherForStatusChange) {
        return;
      }

      const teacherId =
        teacherForStatusChange.id ||
        teacherForStatusChange._id;

      const currentlyActive =
        teacherForStatusChange.profileStatus ===
        'Active';

      setSuccessMessage('');
      setPageError('');

      try {
        await statusMutation.mutateAsync({
          id: teacherId,
          active: !currentlyActive,
        });

        setSuccessMessage(
          currentlyActive
            ? `${teacherForStatusChange.name} was deactivated.`
            : `${teacherForStatusChange.name} was activated.`
        );

        setTeacherForStatusChange(null);
      } catch (mutationError) {
        setPageError(
          mutationError?.message ||
          'Unable to update teacher status.'
        );

        setTeacherForStatusChange(null);
      }
    };

  if (isLoading) {
    return <p>Loading teachers...</p>;
  }

  if (isError) {
    return (
      <Card title="Unable to Load Teachers">
        <p
          style={{
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {error?.message ||
            'Unable to fetch teachers.'}
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

  const getTeacherDetails = () => {
    if (!detailsTeacher) return null;
    
    // Safely get assigned batches array
    const teacherBatchIds = Array.isArray(detailsTeacher.assignedBatches) 
      ? detailsTeacher.assignedBatches.map(id => String(id?.id || id?._id || id)) 
      : [];
    
    const safeBatches = Array.isArray(batches) ? batches : [];
    
    const assignedBatchesList = safeBatches.filter(b => {
      if (!b) return false;
      const batchIdStr = String(b.id || b._id);
      
      const inTeacherBatches = teacherBatchIds.includes(batchIdStr);
      
      let inBatchTeachers = false;
      if (Array.isArray(b.teacherIds)) {
        inBatchTeachers = b.teacherIds.some(tid => String(tid?.id || tid?._id || tid) === String(detailsTeacher.id || detailsTeacher._id));
      } else if (typeof b.teacherIds === 'string') {
        inBatchTeachers = b.teacherIds.includes(String(detailsTeacher.id || detailsTeacher._id));
      }
      // fallback for mock mockBatches which use teacherId
      const inBatchTeacherId = String(b.teacherId) === String(detailsTeacher.id || detailsTeacher._id);
      
      return inTeacherBatches || inBatchTeachers || inBatchTeacherId;
    });

    const assignedBatchIds = assignedBatchesList.map(b => String(b.id || b._id));
    
    const safeStudents = Array.isArray(students) ? students : [];
    const studentsInBatches = safeStudents.filter(s => {
      if (!s || !s.batchId) return false;
      return assignedBatchIds.includes(String(s.batchId?.id || s.batchId?._id || s.batchId));
    });

    return {
      batchCount: assignedBatchesList.length || 0,
      batches: assignedBatchesList,
      students: studentsInBatches
    };
  };

  const details = getTeacherDetails();

  const selectedStatusIsActive =
    teacherForStatusChange?.profileStatus ===
    'Active';

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
              fontWeight: 'var(--font-bold)',
            }}
          >
            {pageError}
          </div>
        )}

        <TeacherTable
          teachers={teachers}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onRowClick={setDetailsTeacher}
          onStatusChange={
            setTeacherForStatusChange
          }
          statusUpdatingId={
            statusMutation.isPending
              ? teacherForStatusChange?.id ||
              teacherForStatusChange?._id
              : null
          }
        />
      </div>

      <Modal isOpen={!!detailsTeacher} onClose={() => setDetailsTeacher(null)} title="Teacher Details" size="lg">
        {detailsTeacher && details && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
            <Card className="student-block-hover">
              <div style={{ padding: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                  <img 
                    src={detailsTeacher?.userId?.profilePic || detailsTeacher?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${detailsTeacher?.id || detailsTeacher?._id || 'default'}`} 
                    alt="Avatar" 
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{detailsTeacher?.userId?.name || detailsTeacher?.name || 'Unknown'}</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{detailsTeacher?.userId?.email || detailsTeacher?.email || 'No email'} | {detailsTeacher?.userId?.phone || detailsTeacher?.phone || 'No phone'}</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Assigned Batches ({details?.batchCount || 0})</p>
                    {details?.batches && details.batches.length > 0 ? (
                      <ul style={{ paddingLeft: 'var(--space-md)', margin: 'var(--space-xs) 0', fontSize: 'var(--text-sm)' }}>
                        {details.batches.map((b, i) => <li key={b?.id || b?._id || i}>{b?.name || 'Unnamed Batch'}</li>)}
                      </ul>
                    ) : (
                      <p style={{ fontWeight: '600' }}>None</p>
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Total Students ({details?.students?.length || 0})</p>
                    {details?.students && details.students.length > 0 ? (
                      <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: 'var(--space-xs)', padding: 'var(--space-xs)', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                        <ul style={{ paddingLeft: 'var(--space-md)', margin: 0, fontSize: 'var(--text-sm)' }}>
                          {details.students.map((s, i) => <li key={s?.id || s?._id || i}>{s?.userId?.name || s?.name || 'Unknown Student'} <span style={{color: 'var(--color-text-secondary)', fontSize: '0.8em'}}>({s?.batchName || 'Unknown Batch'})</span></li>)}
                        </ul>
                      </div>
                    ) : (
                      <p style={{ fontWeight: '600' }}>No students</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <EditTeacherModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        teacher={selectedTeacher}
        onSave={handleSave}
      />

      <ConfirmDialog
        isOpen={Boolean(
          teacherForStatusChange
        )}
        title={
          selectedStatusIsActive
            ? 'Deactivate Teacher'
            : 'Activate Teacher'
        }
        message={
          teacherForStatusChange
            ? `${selectedStatusIsActive
              ? 'Deactivate'
              : 'Activate'
            } "${teacherForStatusChange.name}"?`
            : ''
        }
        confirmLabel={
          selectedStatusIsActive
            ? 'Deactivate'
            : 'Activate'
        }
        variant={
          selectedStatusIsActive
            ? 'danger'
            : 'primary'
        }
        onConfirm={
          handleConfirmStatusChange
        }
        onCancel={() =>
          setTeacherForStatusChange(null)
        }
      />
    </>
  );
}