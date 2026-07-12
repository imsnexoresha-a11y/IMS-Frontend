import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import { CSV_ACCEPT } from '../../utils/constants';

export default function BulkUploadCSVModal({ isOpen, onClose, onUpload }) {
  const handleFile = (file) => { /* store file */ };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Upload Students" size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onUpload?.()}>Upload & Process</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          Upload a CSV file with columns: <strong>name, email, batchId</strong>. 
          Duplicate emails will be flagged as errors.
        </p>
        <FileUpload label="CSV File" accept={CSV_ACCEPT} onFileSelect={handleFile} />
      </div>
    </Modal>
  );
}
