import {
  ArrowRightLeft,
  Plus,
  Power,
  Upload,
  Download,
} from 'lucide-react';

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { exportToCsv } from '../../utils/exportCsv';

function getStudentId(student) {
  return student?._id || student?.id;
}

export default function StudentTable({
  students = [],
  batches = [],
  onAdd,
  onBulkUpload,
  onRowClick,
  onStatusChange,
  onMoveBatch,
  updatingStudentId = null,
}) {
  const handleDownloadCsv = () => {
    const csvColumns = [
      { key: 'name', label: 'Name', render: (_, r) => r.userId?.name || r.user?.name || r.name || '' },
      { key: 'email', label: 'Email', render: (_, r) => r.userId?.email || r.user?.email || r.email || '' },
      { key: 'enrollementNo', label: 'Enrollment No.' },
      { key: 'batchId', label: 'Batch', render: (v) => {
        const batchId = typeof v === 'object' ? v?._id || v?.id : v;
        const batch = batches.find(b => (b._id || b.id) === batchId) || (typeof v === 'object' ? v : null);
        return batch?.name || 'Unassigned';
      }},
      { key: 'totalPoints', label: 'Score', render: (v) => v ?? 0 },
      { key: 'profileStatus', label: 'Status', render: (_, r) => r.userId?.profileStatus || r.user?.profileStatus || r.profileStatus || 'Inactive' },
    ];
    const today = new Date().toISOString().split('T')[0];
    exportToCsv(`students_${today}.csv`, students, csvColumns);
  };
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (_, row) => (
        <strong>
          {row.userId?.name ||
            row.user?.name ||
            row.name ||
            '—'}
        </strong>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (_, row) =>
        row.userId?.email ||
        row.user?.email ||
        row.email ||
        '—',
    },
    {
      key: 'enrollementNo',
      label: 'Enrollment No.',
      render: (value) => value || '—',
    },
    {
      key: 'batchId',
      label: 'Batch',
      render: (value) => {
        const batchId =
          typeof value === 'object'
            ? value?._id || value?.id
            : value;

        const batch =
          batches.find(
            (item) =>
              (item._id || item.id) === batchId
          ) ||
          (typeof value === 'object'
            ? value
            : null);

        return batch?.name || 'Unassigned';
      },
    },
    {
      key: 'totalPoints',
      label: 'Score',
      render: (value) => (
        <strong
          style={{
            color: 'var(--color-accent)',
          }}
        >
          {value ?? 0}
        </strong>
      ),
    },
    {
      key: 'profileStatus',
      label: 'Status',
      render: (_, row) => {
        const status =
          row.userId?.profileStatus ||
          row.user?.profileStatus ||
          row.profileStatus ||
          'Inactive';

        return (
          <Badge
            variant={
              status === 'Active'
                ? 'success'
                : status === 'blocked'
                  ? 'danger'
                  : 'neutral'
            }
            dot
          >
            {status}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => {
        const studentId = getStudentId(row);

        const status =
          row.userId?.profileStatus ||
          row.user?.profileStatus ||
          row.profileStatus ||
          'Inactive';

        const isActive =
          status === 'Active';

        const isUpdating =
          updatingStudentId === studentId;

        return (
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-xs)',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={() =>
                onStatusChange?.(row)
              }
              title={
                isActive
                  ? 'Deactivate student'
                  : 'Activate student'
              }
            >
              <Power size={14} />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUpdating}
              onClick={() =>
                onMoveBatch?.(row)
              }
              title="Move student to another batch"
            >
              <ArrowRightLeft size={14} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={students}
      searchPlaceholder="Search students..."
      onRowClick={onRowClick}
      toolbarActions={
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-xs)',
          }}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownloadCsv}
            title="Download all students as CSV"
          >
            <Download size={16} />
            Download CSV
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onBulkUpload}
          >
            <Upload size={16} />
            CSV Upload
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAdd}
          >
            <Plus size={16} />
            Add Student
          </Button>
        </div>
      }
    />
  );
}