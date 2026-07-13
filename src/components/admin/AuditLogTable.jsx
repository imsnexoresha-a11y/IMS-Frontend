import { Download } from 'lucide-react';

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';

import { formatDateTime } from '../../utils/formatters';

export default function AuditLogTable({
  logs = [],
  onExport,
  exporting = false,
}) {
  const columns = [
    {
      key: 'createdAt',
      label: 'Time',
      render: (value) =>
        value ? formatDateTime(value) : '—',
    },
    {
      key: 'actionType',
      label: 'Action',
      render: (value) => (
        <Badge variant="warning">
          {String(value || 'unknown').replace(
            /_/g,
            ' '
          )}
        </Badge>
      ),
    },
    {
      key: 'entityType',
      label: 'Entity',
      render: (value) => value || '—',
    },
    {
      key: 'entityId',
      label: 'Entity ID',
      render: (value) => value || '—',
    },
    {
      key: 'adminId',
      label: 'Admin ID',
      render: (value) => value || 'System',
    },
    {
      key: 'reason',
      label: 'Reason',
      render: (value) => value || '—',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={logs}
      searchPlaceholder="Search audit logs..."
      toolbarActions={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onExport}
          disabled={exporting}
        >
          <Download size={16} />
          {exporting
            ? 'Exporting...'
            : 'Export CSV'}
        </Button>
      }
    />
  );
}