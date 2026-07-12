import { useMemo, useState } from 'react';
import {
    CheckCircle,
    Code2,
    ExternalLink,
    RotateCcw,
} from 'lucide-react';

import Badge from '../../common/Badge';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import Modal from '../../common/Modal';
import Textarea from '../../common/Textarea';
import Input from '../../common/Input';



const INITIAL_REVIEWS = [];

export default function AdminCodeReviewPanel({ batchId }) {
    const [reviews, setReviews] = useState(INITIAL_REVIEWS);
    const [selectedReview, setSelectedReview] = useState(null);
    const [manualScore, setManualScore] = useState('');
    const [manualFeedback, setManualFeedback] = useState('');

    const visibleReviews = useMemo(
        () => reviews,
        [reviews, batchId]
    );

    const retryReview = (reviewId) => {
        setReviews((current) =>
            current.map((review) =>
                review.id === reviewId
                    ? {
                        ...review,
                        status: 'processing',
                    }
                    : review
            )
        );
    };

    const approveReview = (reviewId) => {
        setReviews((current) =>
            current.map((review) =>
                review.id === reviewId
                    ? {
                        ...review,
                        status: 'approved',
                        finalScore:
                            review.finalScore ?? review.automatedScore,
                    }
                    : review
            )
        );
    };

    const saveManualScore = () => {
        if (!selectedReview || manualScore === '') {
            return;
        }

        setReviews((current) =>
            current.map((review) =>
                review.id === selectedReview.id
                    ? {
                        ...review,
                        status: 'approved',
                        finalScore: Number(manualScore),
                        feedback: manualFeedback,
                    }
                    : review
            )
        );

        setSelectedReview(null);
        setManualScore('');
        setManualFeedback('');
    };

    const columns = [
        {
            key: 'studentName',
            label: 'Student',
        },
        {
            key: 'assignmentTitle',
            label: 'Assignment',
        },
        {
            key: 'repositoryUrl',
            label: 'Repository',
            render: (value) => (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--color-accent)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    <Code2 size={14} />
                    Open
                    <ExternalLink size={13} />
                </a>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Badge
                    variant={
                        value === 'approved' || value === 'completed'
                            ? 'success'
                            : value === 'processing'
                                ? 'warning'
                                : 'info'
                    }
                    dot
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: 'automatedScore',
            label: 'Auto Score',
            render: (value) => value ?? '—',
        },
        {
            key: 'finalScore',
            label: 'Final Score',
            render: (value) => (
                <strong>{value ?? '—'}</strong>
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
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => retryReview(row.id)}
                    >
                        <RotateCcw size={14} />
                        Retry
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => approveReview(row.id)}
                    >
                        <CheckCircle size={14} />
                        Approve
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setSelectedReview(row);
                            setManualScore(row.finalScore ?? '');
                            setManualFeedback(row.feedback || '');
                        }}
                    >
                        Manual Score
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-lg)',
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Automated Code Reviews
                    </h3>

                    <p
                        style={{
                            marginTop: '4px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Monitor GitHub submissions, automated results, and manual score
                        corrections.
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    data={visibleReviews}
                    searchPlaceholder="Search code reviews..."
                />
            </div>

            <Modal
                isOpen={Boolean(selectedReview)}
                onClose={() => setSelectedReview(null)}
                title="Manual Code Review Score"
                size="md"
            >
                {selectedReview && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-md)',
                        }}
                    >
                        <div>
                            <strong>{selectedReview.assignmentTitle}</strong>

                            <p
                                style={{
                                    marginTop: '4px',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                {selectedReview.studentName}
                            </p>
                        </div>

                        <Input
                            label="Final Score"
                            name="manualScore"
                            type="number"
                            min="0"
                            value={manualScore}
                            onChange={(event) =>
                                setManualScore(event.target.value)
                            }
                        />

                        <Textarea
                            label="Feedback"
                            name="manualFeedback"
                            rows={5}
                            value={manualFeedback}
                            onChange={(event) =>
                                setManualFeedback(event.target.value)
                            }
                        />

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 'var(--space-sm)',
                            }}
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setSelectedReview(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={saveManualScore}
                            >
                                Save Score
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}