import {
    BookOpen,
    Check,
    ChevronRight,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

export default function AdminTopicList({
    topics = [],
    onAdd,
    onSelect,
    onEdit,
    onDelete,
}) {
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
                    Topics
                </h3>

                <Button variant="primary" size="sm" onClick={onAdd}>
                    <Plus size={16} />
                    Add Topic
                </Button>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-xs)',
                }}
            >
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                            padding: 'var(--space-md) var(--space-lg)',
                            border: 'var(--border-width) solid var(--border-color)',
                            backgroundColor: 'var(--color-surface)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => onSelect?.(topic)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-md)',
                                flex: 1,
                                padding: 0,
                                border: 0,
                                background: 'transparent',
                                color: 'inherit',
                                textAlign: 'left',
                                cursor: 'pointer',
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--color-accent)',
                                    minWidth: '24px',
                                }}
                            >
                                {topic.order}.
                            </span>

                            <BookOpen size={18} />

                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: 'var(--font-bold)',
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    {topic.title}
                                </div>

                                <div
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-secondary)',
                                    }}
                                >
                                    {topic.lectureCount} lectures · {topic.notesCount} notes
                                </div>
                            </div>

                            {topic.completed ? (
                                <Badge variant="success">
                                    <Check size={12} />
                                    Done
                                </Badge>
                            ) : (
                                <Badge variant="neutral">In Progress</Badge>
                            )}

                            <ChevronRight size={18} />
                        </button>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--space-xs)',
                            }}
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => onEdit?.(topic)}
                                aria-label={`Edit ${topic.title}`}
                            >
                                <Pencil size={15} />
                            </Button>

                            <Button
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete?.(topic)}
                                aria-label={`Delete ${topic.title}`}
                            >
                                <Trash2 size={15} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}