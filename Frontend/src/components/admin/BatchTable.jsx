import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

export default function BatchTable({ batches = [], onAdd, onRowClick }) {
  const columns = [
    { key: 'name', label: 'Batch Name' },
    { key: 'teacherName', label: 'Teacher' },
    { key: 'studentCount', label: 'Students' },
    { key: 'lectureCount', label: 'Lectures' },
    { key: 'startDate', label: 'Start', render: (v) => formatDate(v) },
    { key: 'endDate', label: 'End', render: (v) => formatDate(v) },
    {
      key: 'status', label: 'Status',
      render: (v) => <Badge variant={v === 'active' ? 'success' : 'neutral'} dot>{v}</Badge>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={batches}
      searchPlaceholder="Search batches..."
      onRowClick={onRowClick}
      toolbarActions={
        <Button variant="primary" size="sm" onClick={onAdd}><Plus size={16} /> New Batch</Button>
      }
    />
  );
}
