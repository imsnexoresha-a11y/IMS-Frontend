
import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';
import Button from '../common/Button';
import { Download } from 'lucide-react';

const ACTION_VARIANTS = {
  mark_override: 'warning', student_created: 'success', batch_created: 'info',
  lecture_status_changed: 'accent', attendance_uploaded: 'success',
  assignment_submitted: 'info', recruiter_link_generated: 'accent', recalculation_triggered: 'warning',
};

export default function AuditLogTable({ onExport }) {
  const columns = [
    { key: 'timestamp', label: 'Time', render: (v) => formatDateTime(v) },
    {
      key: 'action', label: 'Action',
      render: (v) => <Badge variant={ACTION_VARIANTS[v] || 'neutral'}>{v.replace(/_/g, ' ')}</Badge>,
    },
    { key: 'actor', label: 'Actor' },
    { key: 'actorRole', label: 'Role', render: (v) => <Badge variant="neutral">{v}</Badge> },
    { key: 'target', label: 'Target' },
    { key: 'details', label: 'Details' },
  ];

  return (
    <DataTable
      columns={columns}
      data={[]}
      searchPlaceholder="Filter audit log..."
      toolbarActions={
        <Button variant="secondary" size="sm" onClick={onExport}>
          <Download size={16} /> Export CSV
        </Button>
      }
    />
  );
}
