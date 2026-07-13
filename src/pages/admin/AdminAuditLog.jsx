import { useState } from 'react';

import {
  useAuditLog,
  useExportAuditLog,
} from '../../hooks/useAuditLog';

import AuditLogTable from '../../components/admin/AuditLogTable';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';

function escapeCSV(value) {
  const text =
    value === null || value === undefined
      ? ''
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function downloadLogsAsCSV(logs) {
  const headers = [
    'Created At',
    'Action Type',
    'Entity Type',
    'Entity ID',
    'Admin ID',
    'Reason',
    'Old Value',
    'New Value',
  ];

  const rows = logs.map((log) => [
    log.createdAt,
    log.actionType,
    log.entityType,
    log.entityId,
    log.adminId,
    log.reason,
    log.oldValue,
    log.newValue,
  ]);

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) =>
      row.map(escapeCSV).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download = `audit-log-${new Date().toISOString().split('T')[0]
    }.csv`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export default function AdminAuditLog() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    actionType: '',
    page: 1,
    limit: 20,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAuditLog(filters);

  const exportMutation =
    useExportAuditLog();

  const logs = data?.logs || [];
  const pagination = data?.pagination || {};

  const handleExport = async () => {
    try {
      const result =
        await exportMutation.mutateAsync({
          from: filters.from || undefined,
          to: filters.to || undefined,
          actionType:
            filters.actionType || undefined,
        });

      downloadLogsAsCSV(
        result?.logs || []
      );
    } catch (exportError) {
      window.alert(
        exportError?.message ||
        'Unable to export audit log.'
      );
    }
  };

  if (isLoading) {
    return <p>Loading audit logs...</p>;
  }

  if (isError) {
    return (
      <Card title="Unable to Load Audit Log">
        <p
          style={{
            color: 'var(--color-danger)',
          }}
        >
          {error?.message ||
            'Unable to fetch audit logs.'}
        </p>

        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
      }}
    >
      <Card title="Audit Filters">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-md)',
          }}
        >
          <Input
            label="From"
            type="date"
            value={filters.from}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                from: event.target.value,
                page: 1,
              }))
            }
          />

          <Input
            label="To"
            type="date"
            value={filters.to}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                to: event.target.value,
                page: 1,
              }))
            }
          />

          <Input
            label="Action Type"
            placeholder="e.g. MARK_OVERRIDE"
            value={filters.actionType}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                actionType:
                  event.target.value,
                page: 1,
              }))
            }
          />
        </div>
      </Card>

      <AuditLogTable
        logs={logs}
        onExport={handleExport}
        exporting={
          exportMutation.isPending
        }
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Page {pagination.page || 1} of{' '}
          {pagination.totalPages || 1}
        </span>

        <div
          style={{
            display: 'flex',
            gap: 'var(--space-sm)',
          }}
        >
          <Button
            variant="secondary"
            disabled={
              (pagination.page || 1) <= 1
            }
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page:
                  Math.max(
                    current.page - 1,
                    1
                  ),
              }))
            }
          >
            Previous
          </Button>

          <Button
            variant="secondary"
            disabled={
              (pagination.page || 1) >=
              (pagination.totalPages || 1)
            }
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page + 1,
              }))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}