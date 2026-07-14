import { useState } from 'react';

import {
  useAuditLog,
  useExportAuditLog,
} from '../../hooks/useAuditLog';

import AuditLogTable from '../../components/admin/AuditLogTable';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

function escapeCSV(value) {
  const text =
    value === null ||
      value === undefined
      ? ''
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replace(
    /"/g,
    '""'
  )}"`;
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
    headers
      .map(escapeCSV)
      .join(','),

    ...rows.map((row) =>
      row
        .map(escapeCSV)
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], {
    type:
      'text/csv;charset=utf-8;',
  });

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;

  anchor.download =
    `audit-log-${new Date()
      .toISOString()
      .split('T')[0]
    }.csv`;

  document.body.appendChild(
    anchor
  );

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

const ACTION_OPTIONS = [
  {
    value: '',
    label: 'All actions',
  },
  {
    value: 'MARK_OVERRIDE',
    label: 'Marks override',
  },
  {
    value: 'EVENT_CORRECTION',
    label: 'Event correction',
  },
  {
    value: 'MANUAL_SCORE',
    label: 'Manual score',
  },
  {
    value: 'RECALC_TRIGGER',
    label: 'Recalculation',
  },
  {
    value: 'PARAM_CHANGE',
    label: 'Parameter change',
  },
  {
    value: 'CSV_REPLACE',
    label: 'CSV replacement',
  },
];

export default function AdminAuditLog() {
  const [filters, setFilters] =
    useState({
      from: '',
      to: '',
      actionType: '',
      page: 1,
      limit: 20,
    });

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAuditLog(filters);

  const exportMutation =
    useExportAuditLog();

  const logs = data?.logs || [];

  const pagination =
    data?.pagination || {
      page: 1,
      totalPages: 1,
      total: 0,
    };

  const updateFilter = (
    name,
    value
  ) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      from: '',
      to: '',
      actionType: '',
      page: 1,
      limit: 20,
    });
  };

  const handleExport = async () => {
    try {
      const result =
        await exportMutation.mutateAsync(
          {
            from:
              filters.from ||
              undefined,

            to:
              filters.to ||
              undefined,

            actionType:
              filters.actionType ||
              undefined,
          }
        );

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
    return (
      <p>Loading audit logs...</p>
    );
  }

  if (isError) {
    return (
      <Card title="Unable to Load Audit Log">
        <p
          style={{
            color:
              'var(--color-danger)',
          }}
        >
          {error?.message ||
            'Unable to fetch audit logs.'}
        </p>

        <Button
          type="button"
          onClick={() => refetch()}
        >
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
      <div>
        <h1>Audit Log</h1>

        <p
          style={{
            marginTop:
              'var(--space-xs)',

            color:
              'var(--color-text-secondary)',
          }}
        >
          Review administrative
          changes and marks-related
          activity.
        </p>
      </div>

      <Card title="Audit Filters">
        <div
          style={{
            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fit, minmax(180px, 1fr))',

            gap:
              'var(--space-md)',

            alignItems: 'end',
          }}
        >
          <Input
            label="From"
            type="date"
            value={filters.from}
            onChange={(event) =>
              updateFilter(
                'from',
                event.target.value
              )
            }
          />

          <Input
            label="To"
            type="date"
            value={filters.to}
            min={
              filters.from ||
              undefined
            }
            onChange={(event) =>
              updateFilter(
                'to',
                event.target.value
              )
            }
          />

          <Select
            label="Action Type"
            value={
              filters.actionType
            }
            options={ACTION_OPTIONS}
            onChange={(event) =>
              updateFilter(
                'actionType',
                event.target.value
              )
            }
          />

          <Button
            type="button"
            variant="secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {isFetching && (
        <p
          style={{
            color:
              'var(--color-text-secondary)',
          }}
        >
          Refreshing audit logs...
        </p>
      )}

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
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: 'var(--space-md)',
        }}
      >
        <span>
          Page{' '}
          {pagination.page || 1} of{' '}
          {pagination.totalPages ||
            1}
          {' · '}
          {pagination.total || 0}{' '}
          total records
        </span>

        <div
          style={{
            display: 'flex',
            gap:
              'var(--space-sm)',
          }}
        >
          <Button
            type="button"
            variant="secondary"
            disabled={
              (pagination.page ||
                1) <= 1 ||
              isFetching
            }
            onClick={() =>
              setFilters(
                (current) => ({
                  ...current,

                  page: Math.max(
                    current.page - 1,
                    1
                  ),
                })
              )
            }
          >
            Previous
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={
              (pagination.page ||
                1) >=
              (pagination.totalPages ||
                1) ||
              isFetching
            }
            onClick={() =>
              setFilters(
                (current) => ({
                  ...current,

                  page:
                    current.page + 1,
                })
              )
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}