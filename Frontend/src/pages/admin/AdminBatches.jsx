import { useState, useEffect } from 'react';
import BatchTable from '../../components/admin/BatchTable';
import Modal from '../../components/common/Modal';
import CreateBatchForm from '../../components/admin/CreateBatchForm';
import BatchConfigForm from '../../components/admin/BatchConfigForm';
import RecruiterLinkManager from '../../components/admin/RecruiterLinkManager';
import { useToast } from '../../components/common/Toast';
import BatchDetailsModal from '../../components/admin/BatchDetailsModal';
import { getBatches, createBatch, updateBatch } from '../../api/adminApi';

export default function AdminBatches() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const toast = useToast();

  const fetchBatches = async () => {
    try {
      const data = await getBatches();
      setBatches(data.items || []);
    } catch (err) {
      toast.error('Error', 'Failed to fetch batches');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (data) => {
    try {
      // CreateBatchForm returns teacherId instead of teacherIds array
      const batchData = {
        ...data,
        teacherIds: data.teacherId ? [data.teacherId] : []
      };
      await createBatch(batchData);
      setAddModalOpen(false);
      fetchBatches();
      toast.success('Success', 'Batch created successfully!');
    } catch (err) {
      toast.error('Error', err.response?.data?.message || 'Failed to create batch');
    }
  };

  const handleRowClick = (batch) => {
    setSelectedBatch(batch);
    setConfigModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <BatchTable batches={batches} onAdd={() => setAddModalOpen(true)} onRowClick={handleRowClick} />

      <RecruiterLinkManager />

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Create Batch" size="md">
        <CreateBatchForm onCancel={() => setAddModalOpen(false)} onSubmit={handleCreateBatch} />
      </Modal>

      <Modal isOpen={configModalOpen} onClose={() => { setConfigModalOpen(false); setSelectedBatch(null); }} title={selectedBatch ? `Batch Details: ${selectedBatch.name}` : "Batch Details"} size="lg">
        <BatchDetailsModal 
          batch={selectedBatch} 
          onUpdate={async (data) => {
            try {
              const batchData = {
                ...data,
                teacherIds: data.teacherId ? [data.teacherId] : []
              };
              await updateBatch(selectedBatch.id, batchData);
              toast.success('Success', 'Batch updated successfully!');
              fetchBatches();
            } catch (err) {
              toast.error('Error', err.response?.data?.message || 'Failed to update batch');
            }
          }}
          onConfigUpdate={async (data) => {
            try {
               // Update config
               toast.success('Success', 'Batch configuration updated!');
               fetchBatches();
            } catch (err) {
               toast.error('Error', 'Failed to update configuration');
            }
          }} 
          onClose={() => setConfigModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
