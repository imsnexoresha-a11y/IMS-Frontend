import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Plus, Upload } from 'lucide-react';

export default function StudentTable({ students = [], onAdd, onBulkUpload, onRowClick }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'batchName', label: 'Batch' },
    { 
      key: 'attendance', 
      label: 'Attendance',
      render: (v) => <span style={{ color: v < 75 ? 'var(--color-error)' : 'inherit' }}>{v}%</span>
    },
    { key: 'score', label: 'Avg Score' },
    { key: 'points', label: 'Total Points', render: (v) => <strong>{v}</strong> },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={v === 'active' ? 'success' : 'neutral'} dot>{v}</Badge>,
    },
  ];

  const actions = (
    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
      <Button variant="secondary" size="sm" onClick={onBulkUpload}>
        <Upload size={16} /> Bulk Upload
      </Button>
      <Button variant="primary" size="sm" onClick={onAdd}>
        <Plus size={16} /> New Student
      </Button>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={students}
      searchPlaceholder="Search students..."
      toolbarActions={actions}
      onRowClick={onRowClick}
    />
  );
}

