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
      render: (value, row) => {
        const dateVal = value || row.createdAt || row.timestamp;
        return dateVal ? formatDateTime(dateVal) : 'No Time';
      },
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
      label: 'Target Entity',
      render: (value, row) => (
        <div>
          <strong style={{ textTransform: 'capitalize' }}>{value || '—'}</strong>
          {row.entityName && row.entityName !== value && row.entityName !== '—' && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              {row.entityName}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'adminName',
      label: 'Performed By',
      render: (value, row) => (
        <div>
          <strong>{value || row.adminId || 'Admin'}</strong>
        </div>
      ),
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