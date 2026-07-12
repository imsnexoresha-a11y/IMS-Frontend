import {
    CalendarClock,
    CheckCircle,
    ExternalLink,
    Pencil,
    Play,
    Plus,
    Trash2,
    XCircle,
} from 'lucide-react';

import DataTable from '../../common/DataTable';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';
import { formatDateTime } from '../../../utils/formatters';

const STATUS_VARIANTS = {
    scheduled: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'error',
};

export default function AdminLectureList({
    lectures = [],
    topics = [],
    onAdd,
    onEdit,
    onDelete,
    onStatusChange,
}) {
    const topicMap = Object.fromEntries(
        topics.map((topic) => [topic.id, topic.title])
    );

    if (lectures.length === 0) {
        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--space-md)',
                    }}
                >
                    <h3
                        style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Lectures
                    </h3>

                    <Button variant="primary" size="sm" onClick={onAdd}>
                        <Plus size={16} />
                        Schedule Lecture
                    </Button>
                </div>

                <EmptyState
                    title="No lectures scheduled"
                    description="Schedule the first online lecture for this batch."
                />
            </div>
        );
    }

    const columns = [
        {
            key: 'title',
            label: 'Lecture',
            render: (value, row) => (
                <div>
                    <div
                        style={{
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        {value}
                    </div>

                    <div
                        style={{
                            marginTop: '2px',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {topicMap[row.topicId] || 'Topic unavailable'}
                    </div>
                </div>
            ),
        },
        {
            key: 'date',
            label: 'Date and Time',
            render: (value) => formatDateTime(value),
        },
        {
            key: 'meetUrl',
            label: 'Meeting',
            render: (value) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--color-accent)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Open Meet
                        <ExternalLink size={14} />
                    </a>
                ) : (
                    '—'
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Badge
                    variant={STATUS_VARIANTS[value] || 'neutral'}
                    dot
                >
                    {value?.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--space-xs)',
                    }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit?.(row)}
                        aria-label={`Edit ${row.title}`}
                    >
                        <Pencil size={14} />
                    </Button>

                    {row.status === 'scheduled' && (
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={() =>
                                onStatusChange?.(row.id, 'in_progress')
                            }
                        >
                            <Play size={14} />
                            Start
                        </Button>
                    )}

                    {row.status === 'in_progress' && (
                        <>
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                    onStatusChange?.(row.id, 'completed')
                                }
                            >
                                <CheckCircle size={14} />
                                Complete
                            </Button>

                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                    onStatusChange?.(row.id, 'cancelled')
                                }
                            >
                                <XCircle size={14} />
                                Cancel
                            </Button>
                        </>
                    )}

                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete?.(row)}
                        aria-label={`Delete ${row.title}`}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-md)',
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Lectures
                    </h3>

                    <p
                        style={{
                            marginTop: '2px',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                        }}
                    >
                        Schedule online lectures and manage their status.
                    </p>
                </div>

                <Button variant="primary" size="sm" onClick={onAdd}>
                    <CalendarClock size={16} />
                    Schedule Lecture
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={lectures}
                searchPlaceholder="Search lectures..."
            />
        </div>
    );
}