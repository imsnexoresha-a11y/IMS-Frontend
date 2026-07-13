import {
  Link2,
  Pencil,
  Plus,
  Settings,
  Square,
  Trash2,
} from 'lucide-react';

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';

import { formatDate } from '../../utils/formatters';

export default function BatchTable({
  batches = [],
  teachersList = [],
  studentsList = [],
  onAdd,
  onEdit,
  onConfig,
  onCloseBatch,
  onGenerateLink,
  onRevokeLink,
  processingBatchId = null,
}) {
  const renderUserAvatars = (ids, list) => {
    if (!Array.isArray(ids) || ids.length === 0) return <span style={{ color: 'var(--color-text-secondary)' }}>None</span>;
    const users = ids.map(id => list.find(u => (u._id || u.id) === id)).filter(Boolean);
    if (users.length === 0) return <strong>{ids.length} Assigned</strong>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-secondary)' }}>
          {users.length} Assigned
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {users.slice(0, 3).map(u => (
            <div key={u._id || u.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <Avatar name={u.userId?.name || u.name} src={u.userId?.profilePic || u.profilePic} size="sm" />
              <span style={{ fontSize: 'var(--text-xs)' }} title={u.userId?.name || u.name}>
                {(u.userId?.name || u.name || '').split(' ')[0]}
              </span>
            </div>
          ))}
          {users.length > 3 && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginLeft: 'var(--space-md)' }}>
              +{users.length - 3} more
            </span>
          )}
        </div>
      </div>
    );
  };
  const columns = [
    {
      key: 'name',
      label: 'Batch Name',
      render: (value) => (
        <strong>{value || '—'}</strong>
      ),
    },
    {
      key: 'teacherIds',
      label: 'Teachers',
      render: (value, row) => {
        // Fallback for mock data shape if needed
        if (!value && row.teacherId) return renderUserAvatars([row.teacherId], teachersList);
        return renderUserAvatars(value, teachersList);
      },
    },
    {
      key: 'studentIds',
      label: 'Students',
      render: (value) => renderUserAvatars(value, studentsList),
    },
    {
      key: 'startDate',
      label: 'Start',
      render: (value) =>
        value ? formatDate(value) : '—',
    },
    {
      key: 'endDate',
      label: 'End',
      render: (value) =>
        value ? formatDate(value) : '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge
          variant={
            value === 'ongoing'
              ? 'success'
              : value === 'completed'
                ? 'neutral'
                : 'accent'
          }
          dot
        >
          {value || 'upcoming'}
        </Badge>
      ),
    },
    {
      key: 'recruiterLinkActive',
      label: 'Recruiter Link',
      render: (value) => (
        <Badge
          variant={
            value ? 'success' : 'neutral'
          }
          dot
        >
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => {
        const batchId =
          row._id || row.id;

        const isProcessing =
          processingBatchId === batchId;

        const isCompleted =
          row.status === 'completed';

        return (
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-xs)',
              flexWrap: 'wrap',
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(row)}
              disabled={isProcessing}
              title="Edit batch"
            >
              <Pencil size={14} />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                onConfig?.(row)
              }
              disabled={isProcessing}
              title="Batch scoring configuration"
            >
              <Settings size={14} />
            </Button>

            {!isCompleted && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onCloseBatch?.(row)
                }
                disabled={isProcessing}
                title="Close batch"
              >
                <Square size={14} />
              </Button>
            )}

            {row.recruiterLinkActive ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onRevokeLink?.(row)
                }
                disabled={isProcessing}
                title="Revoke recruiter link"
              >
                <Trash2 size={14} />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onGenerateLink?.(row)
                }
                disabled={isProcessing}
                title="Generate recruiter link"
              >
                <Link2 size={14} />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={batches}
      searchPlaceholder="Search batches..."
      toolbarActions={
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onAdd}
        >
          <Plus size={16} />
          New Batch
        </Button>
      }
    />
  );
}