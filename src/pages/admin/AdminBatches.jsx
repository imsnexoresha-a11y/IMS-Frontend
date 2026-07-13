import { useState } from 'react';

import {
  useBatchConfig,
  useBatches,
  useCloseBatch,
  useCreateBatch,
  useGenerateRecruiterLink,
  useRevokeRecruiterLink,
  useUpdateBatch,
  useUpdateBatchConfig,
} from '../../hooks/useBatches';

import { useTeachers } from '../../hooks/useTeachers';
import { useStudents } from '../../hooks/useStudents';

import BatchTable from '../../components/admin/BatchTable';
import CreateBatchForm from '../../components/admin/CreateBatchForm';
import BatchConfigForm from '../../components/admin/BatchConfigForm';

import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RecruiterLinkManager from '../../components/admin/RecruiterLinkManager';

function getBatchId(batch) {
  return batch?._id || batch?.id;
}

export default function AdminBatches() {
  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [selectedBatch, setSelectedBatch] =
    useState(null);

  const [
    configBatch,
    setConfigBatch,
  ] = useState(null);

  const [
    batchToClose,
    setBatchToClose,
  ] = useState(null);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [pageError, setPageError] =
    useState('');

  const {
    data: batches = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useBatches();

  const {
    data: teachers = [],
    isLoading: teachersLoading,
  } = useTeachers();

  const {
    data: students = [],
    isLoading: studentsLoading,
  } = useStudents();

  const configBatchId =
    getBatchId(configBatch);

  const {
    data: batchConfig,
    isLoading: configLoading,
  } = useBatchConfig(configBatchId);

  const createMutation =
    useCreateBatch();

  const updateMutation =
    useUpdateBatch();

  const closeMutation =
    useCloseBatch();

  const configMutation =
    useUpdateBatchConfig();

  const generateLinkMutation =
    useGenerateRecruiterLink();

  const revokeLinkMutation =
    useRevokeRecruiterLink();

  const openCreateModal = () => {
    setSelectedBatch(null);
    setPageError('');
    setSuccessMessage('');
    setFormModalOpen(true);
  };

  const openEditModal = (batch) => {
    setSelectedBatch(batch);
    setPageError('');
    setSuccessMessage('');
    setFormModalOpen(true);
  };

  const handleSaveBatch = async (data) => {
    setPageError('');
    setSuccessMessage('');

    try {
      if (selectedBatch) {
        await updateMutation.mutateAsync({
          id: getBatchId(selectedBatch),
          data,
        });

        setSuccessMessage(
          'Batch updated successfully.'
        );
      } else {
        await createMutation.mutateAsync({
          ...data,
          studentIds: [],
        });

        setSuccessMessage(
          'Batch created successfully.'
        );
      }

      setFormModalOpen(false);
      setSelectedBatch(null);
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to save batch.'
      );

      throw mutationError;
    }
  };

  const handleCloseBatch = async () => {
    if (!batchToClose) {
      return;
    }

    setPageError('');
    setSuccessMessage('');

    try {
      await closeMutation.mutateAsync(
        getBatchId(batchToClose)
      );

      setSuccessMessage(
        `"${batchToClose.name}" was closed successfully.`
      );

      setBatchToClose(null);
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to close batch.'
      );

      setBatchToClose(null);
    }
  };

  const handleSaveConfig = async (config) => {
    setPageError('');
    setSuccessMessage('');

    try {
      await configMutation.mutateAsync({
        batchId: configBatchId,
        config,
      });

      setSuccessMessage(
        'Batch configuration updated successfully.'
      );

      setConfigBatch(null);
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to update configuration.'
      );

      throw mutationError;
    }
  };

  const handleGenerateLink = async (batch) => {
    setPageError('');
    setSuccessMessage('');

    try {
      const result =
        await generateLinkMutation.mutateAsync(
          getBatchId(batch)
        );

      const uuid =
        result?.recruiterUuid;

      setSuccessMessage(
        uuid
          ? `Recruiter link generated: ${window.location.origin}/recruiter/${uuid}`
          : 'Recruiter link generated successfully.'
      );
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to generate recruiter link.'
      );
    }
  };

  const handleRevokeLink = async (batch) => {
    setPageError('');
    setSuccessMessage('');

    try {
      await revokeLinkMutation.mutateAsync(
        getBatchId(batch)
      );

      setSuccessMessage(
        'Recruiter link revoked successfully.'
      );
    } catch (mutationError) {
      setPageError(
        mutationError?.message ||
        'Unable to revoke recruiter link.'
      );
    }
  };

  if (isLoading || teachersLoading || studentsLoading) {
    return <p>Loading batches...</p>;
  }

  if (isError) {
    return (
      <Card title="Unable to Load Batches">
        <p
          style={{
            color: 'var(--color-danger)',
            marginBottom: 'var(--space-md)',
          }}
        >
          {error?.message ||
            'Unable to fetch batches.'}
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

  const processingBatchId =
    closeMutation.isPending
      ? getBatchId(batchToClose)
      : generateLinkMutation.isPending ||
        revokeLinkMutation.isPending
        ? null
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

        <BatchTable
          batches={batches}
          teachersList={teachers}
          studentsList={students}
          onAdd={openCreateModal}
          onEdit={openEditModal}
          onConfig={setConfigBatch}
          onCloseBatch={setBatchToClose}
          onGenerateLink={
            handleGenerateLink
          }
          onRevokeLink={handleRevokeLink}
          processingBatchId={
            processingBatchId
          }
        />
        
        <RecruiterLinkManager />
      </div>

      <Modal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedBatch(null);
        }}
        title={
          selectedBatch
            ? 'Edit Batch'
            : 'Create Batch'
        }
        size="md"
      >
        <CreateBatchForm
          teachers={teachers}
          defaultValues={selectedBatch}
          onSubmit={handleSaveBatch}
          onCancel={() => {
            setFormModalOpen(false);
            setSelectedBatch(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={Boolean(configBatch)}
        onClose={() => setConfigBatch(null)}
        title={
          configBatch
            ? `Configure ${configBatch.name}`
            : 'Batch Configuration'
        }
        size="lg"
      >
        {configLoading ? (
          <p>Loading configuration...</p>
        ) : (
          <BatchConfigForm
            config={batchConfig}
            onSave={handleSaveConfig}
            onCancel={() =>
              setConfigBatch(null)
            }
            saving={
              configMutation.isPending
            }
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(batchToClose)}
        title="Close Batch"
        message={
          batchToClose
            ? `Close "${batchToClose.name}"? The batch status will become completed.`
            : ''
        }
        confirmLabel="Close Batch"
        variant="danger"
        loading={closeMutation.isPending}
        onConfirm={handleCloseBatch}
        onClose={() =>
          setBatchToClose(null)
        }
      />
    </>
  );
}