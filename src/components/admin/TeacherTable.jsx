import {
  Pencil,
  Plus,
  Power,
  Download,
} from 'lucide-react';

import { formatDate } from '../../utils/formatters';
import { exportToCsv } from '../../utils/exportCsv';

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function TeacherTable({
  teachers = [],
  onAdd,
  onEdit,
  onRowClick,
  onStatusChange,
  statusUpdatingId = null,
}) {
  const handleDownloadCsv = () => {
    const csvColumns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobileNo', label: 'Mobile' },
      { key: 'designation', label: 'Designation' },
      { key: 'batchCount', label: 'Batches Assigned', render: (v) => v ?? 0 },
      { key: 'profileStatus', label: 'Status' },
      { key: 'createdAt', label: 'Joined', render: (v) => v ? formatDate(v) : '' },
    ];
    const today = new Date().toISOString().split('T')[0];
    exportToCsv(`teachers_${today}.csv`, teachers, csvColumns);
  };
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => (
        <strong>{value || '—'}</strong>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value || '—',
    },
    {
      key: 'mobileNo',
      label: 'Mobile',
      render: (value) => value || '—',
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (value) => value || '—',
    },
    {
      key: 'batchCount',
      label: 'Batches',
      render: (value) => (
        <Badge variant="accent">
          {value ?? 0}
        </Badge>
      ),
    },
    {
      key: 'profileStatus',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'Active'
              ? 'success'
              : 'neutral'
          }
          dot
        >
          {value || 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) =>
        value ? formatDate(value) : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => {
        const teacherId =
          row.id || row._id;

        const isActive =
          row.profileStatus === 'Active';

        const isUpdating =
          statusUpdatingId === teacherId;

        return (
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-xs)',
              alignItems: 'center',
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(row)}
              aria-label={`Edit ${row.name}`}
            >
              <Pencil size={14} />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange?.(row)
              }
              aria-label={
                isActive
                  ? `Deactivate ${row.name}`
                  : `Activate ${row.name}`
              }
              title={
                isActive
                  ? 'Deactivate teacher'
                  : 'Activate teacher'
              }
            >
              <Power size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={teachers}
      searchPlaceholder="Search teachers..."
      onRowClick={onRowClick}
      toolbarActions={
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownloadCsv}
            title="Download all teachers as CSV"
          >
            <Download size={16} />
            Download CSV
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAdd}
          >
            <Plus size={16} />
            Add Teacher
          </Button>
        </div>
      }
    />
  );
}