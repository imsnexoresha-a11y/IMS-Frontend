import { FileText, Trash2, Upload } from 'lucide-react';
import FileUpload from '../../common/FileUpload';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';

export default function AdminTopicDetails({
    topic,
    notes = [],
    onUploadNote,
    onDeleteNote,
}) {
    if (!topic) {
        return null;
    }

    const handleFileSelect = (file) => {
        if (!file) {
            return;
        }

        onUploadNote?.(file);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-lg)',
            }}
        >
            <section>
                <h3
                    style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-bold)',
                        marginBottom: 'var(--space-xs)',
                    }}
                >
                    {topic.title}
                </h3>

                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                    }}
                >
                    {topic.description || 'No description has been added for this topic.'}
                </p>
            </section>

            <section
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: 'var(--space-md)',
                }}
            >
                <div
                    style={{
                        border: 'var(--border-width) solid var(--border-color)',
                        padding: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-secondary)',
                            textTransform: 'uppercase',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Order
                    </div>

                    <div
                        style={{
                            marginTop: 'var(--space-xs)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        {topic.order}
                    </div>
                </div>

                <div
                    style={{
                        border: 'var(--border-width) solid var(--border-color)',
                        padding: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-secondary)',
                            textTransform: 'uppercase',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Lectures
                    </div>

                    <div
                        style={{
                            marginTop: 'var(--space-xs)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        {topic.lectureCount || 0}
                    </div>
                </div>

                <div
                    style={{
                        border: 'var(--border-width) solid var(--border-color)',
                        padding: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--color-text-secondary)',
                            textTransform: 'uppercase',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Notes
                    </div>

                    <div
                        style={{
                            marginTop: 'var(--space-xs)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        {notes.length}
                    </div>
                </div>
            </section>

            <section>
                <h4
                    style={{
                        fontSize: 'var(--text-md)',
                        fontWeight: 'var(--font-bold)',
                        marginBottom: 'var(--space-md)',
                    }}
                >
                    Notes and Resources
                </h4>

                {notes.length === 0 ? (
                    <EmptyState
                        title="No notes uploaded"
                        description="Upload notes, slides, documents, or other learning resources for this topic."
                    />
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-xs)',
                            marginBottom: 'var(--space-md)',
                        }}
                    >
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-md)',
                                    padding: 'var(--space-md)',
                                    border: 'var(--border-width) solid var(--border-color)',
                                    backgroundColor: 'var(--color-surface)',
                                }}
                            >
                                <FileText
                                    size={20}
                                    style={{ color: 'var(--color-accent)' }}
                                />

                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: 'var(--font-bold)',
                                            fontSize: 'var(--text-sm)',
                                        }}
                                    >
                                        {note.filename}
                                    </div>

                                    <div
                                        style={{
                                            marginTop: '2px',
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        Uploaded {note.uploadedAt}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDeleteNote?.(note.id)}
                                    aria-label={`Delete ${note.filename}`}
                                >
                                    <Trash2 size={15} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <div
                    style={{
                        border: 'var(--border-width) solid var(--border-color)',
                        padding: 'var(--space-md)',
                        backgroundColor: 'var(--color-surface)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-xs)',
                            marginBottom: 'var(--space-sm)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        <Upload size={18} />
                        Upload New Notes
                    </div>

                    <FileUpload
                        label="Choose learning material"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                        onFileSelect={handleFileSelect}
                    />
                </div>
            </section>
        </div>
    );
}