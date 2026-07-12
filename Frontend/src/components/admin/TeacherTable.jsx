import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Plus, Pencil } from 'lucide-react';

export default function TeacherTable({ teachers = [], onAdd, onEdit, onRowClick }) {
  const columns = [
    { 
      key: 'name', 
      label: 'Teacher',
      render: (v, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <img 
            src={row.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.id}`} 
            alt="Avatar" 
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
          <span style={{ fontWeight: '500' }}>{v}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'batchCount', label: 'Batches Assigned', render: (v) => <strong>{v}</strong> },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={v === 'active' ? 'success' : 'neutral'} dot>{v}</Badge>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
          <Pencil size={14} /> Edit
        </Button>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={teachers}
      searchPlaceholder="Search teachers..."
      onRowClick={onRowClick}
      toolbarActions={
        <Button variant="primary" size="sm" onClick={onAdd}><Plus size={16} /> New Teacher</Button>
      }
    />
  );
}

