import { useState } from 'react';
import {
    Calculator,
    FilePenLine,
    Plus,
    RefreshCw,
    Wrench,
} from 'lucide-react';

import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

import MarkOverrideForm from '../../components/admin/MarkOverrideForm';
import ManualScoreEntryForm from '../../components/admin/ManualScoreEntryForm';
import EventCorrectionForm from '../../components/admin/EventCorrectionForm';
import RecalculationTriggerButton from '../../components/admin/RecalculationTriggerButton';



import { formatDateTime } from '../../utils/formatters';

export default function AdminMarkOverrides() {
    const [overrides, setOverrides] = useState([]);

    const [overrideModalOpen, setOverrideModalOpen] = useState(false);
    const [manualScoreModalOpen, setManualScoreModalOpen] =
        useState(false);
    const [correctionModalOpen, setCorrectionModalOpen] =
        useState(false);

    const [recalculatingBatchId, setRecalculatingBatchId] =
        useState(null);

    const [successMessage, setSuccessMessage] = useState('');

    const getStudentName = (studentId) =>
        [].find((student) => student.id === studentId)?.name ||
        studentId;

    const handleCreateOverride = (formData) => {
        const newOverride = {
            id: `override-${Date.now()}`,
            studentId: formData.studentId,
            studentName: getStudentName(formData.studentId),
            category: formData.category,
            previousValue: Number(formData.previousValue || 0),
            newValue: Number(formData.newValue),
            reason: formData.reason,
            adminId: 'admin-001',
            adminName: 'Sarah Chen',
            createdAt: new Date().toISOString(),
        };

        setOverrides((currentOverrides) => [
            newOverride,
            ...currentOverrides,
        ]);

        setOverrideModalOpen(false);
        setSuccessMessage('Mark override submitted successfully.');
    };

    const handleManualScore = (formData) => {
        const newOverride = {
            id: `manual-score-${Date.now()}`,
            studentId: formData.studentId,
            studentName: getStudentName(formData.studentId),
            category: 'code_review',
            previousValue: 0,
            newValue: Number(formData.score),
            reason: formData.description,
            adminId: 'admin-001',
            adminName: 'Sarah Chen',
            createdAt: new Date().toISOString(),
        };

        setOverrides((currentOverrides) => [
            newOverride,
            ...currentOverrides,
        ]);

        setManualScoreModalOpen(false);
        setSuccessMessage('Manual score entered successfully.');
    };

    const handleEventCorrection = (formData) => {
        const newOverride = {
            id: `correction-${Date.now()}`,
            studentId: formData.eventId,
            studentName: `Event ${formData.eventId}`,
            category: 'event_correction',
            previousValue: 0,
            newValue: 0,
            reason: `${formData.correctionType}: ${formData.details}`,
            adminId: 'admin-001',
            adminName: 'Sarah Chen',
            createdAt: new Date().toISOString(),
        };

        setOverrides((currentOverrides) => [
            newOverride,
            ...currentOverrides,
        ]);

        setCorrectionModalOpen(false);
        setSuccessMessage('Ledger event corrected successfully.');
    };

    const handleRecalculateBatch = (batch) => {
        setRecalculatingBatchId(batch.id);
        setSuccessMessage('');

        window.setTimeout(() => {
            setRecalculatingBatchId(null);
            setSuccessMessage(
                `Score recalculation completed for ${batch.name}.`
            );
        }, 700);
    };

    const columns = [
        {
            key: 'createdAt',
            label: 'Time',
            render: (value) => formatDateTime(value),
        },
        {
            key: 'studentName',
            label: 'Student / Target',
            render: (value) => <strong>{value}</strong>,
        },
        {
            key: 'category',
            label: 'Category',
            render: (value) => (
                <Badge variant="warning">
                    {String(value).replace(/_/g, ' ')}
                </Badge>
            ),
        },
        {
            key: 'previousValue',
            label: 'Previous',
            render: (value) => value ?? '—',
        },
        {
            key: 'newValue',
            label: 'New',
            render: (value) => (
                <strong style={{ color: 'var(--color-accent)' }}>
                    {value}
                </strong>
            ),
        },
        {
            key: 'reason',
            label: 'Reason',
        },
        {
            key: 'adminName',
            label: 'Admin',
        },
    ];

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-xl)',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Marks Administration
                    </h1>

                    <p
                        style={{
                            marginTop: 'var(--space-xs)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Override marks, correct ledger events, enter manual
                        code-review scores, and recalculate student totals.
                    </p>
                </div>

                {successMessage && (
                    <Badge variant="success">{successMessage}</Badge>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(3, minmax(0, 1fr))',
                        gap: 'var(--space-md)',
                    }}
                >
                    <Card>
                        <FilePenLine
                            size={24}
                            style={{ color: 'var(--color-accent)' }}
                        />

                        <h3
                            style={{
                                marginTop: 'var(--space-sm)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Mark Override
                        </h3>

                        <p
                            style={{
                                marginTop: 'var(--space-xs)',
                                marginBottom: 'var(--space-md)',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            Adjust a student score with a mandatory reason.
                        </p>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setOverrideModalOpen(true)}
                        >
                            <Plus size={16} />
                            New Override
                        </Button>
                    </Card>

                    <Card>
                        <Calculator
                            size={24}
                            style={{ color: 'var(--color-accent)' }}
                        />

                        <h3
                            style={{
                                marginTop: 'var(--space-sm)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Manual Score
                        </h3>

                        <p
                            style={{
                                marginTop: 'var(--space-xs)',
                                marginBottom: 'var(--space-md)',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            Enter a score when automated code review fails.
                        </p>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setManualScoreModalOpen(true)}
                        >
                            <Plus size={16} />
                            Enter Score
                        </Button>
                    </Card>

                    <Card>
                        <Wrench
                            size={24}
                            style={{ color: 'var(--color-accent)' }}
                        />

                        <h3
                            style={{
                                marginTop: 'var(--space-sm)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Event Correction
                        </h3>

                        <p
                            style={{
                                marginTop: 'var(--space-xs)',
                                marginBottom: 'var(--space-md)',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            Correct a specific student-ledger event.
                        </p>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setCorrectionModalOpen(true)}
                        >
                            <Plus size={16} />
                            Correct Event
                        </Button>
                    </Card>
                </div>

                <Card>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-xs)',
                            marginBottom: 'var(--space-md)',
                        }}
                    >
                        <RefreshCw size={20} />

                        <h2
                            style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Batch Recalculation
                        </h2>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--space-sm)',
                        }}
                    >
                        {[].map((batch) => (
                            <RecalculationTriggerButton
                                key={batch.id}
                                batchName={batch.name}
                                loading={recalculatingBatchId === batch.id}
                                onTrigger={() => handleRecalculateBatch(batch)}
                            />
                        ))}
                    </div>
                </Card>

                <div>
                    <h2
                        style={{
                            marginBottom: 'var(--space-md)',
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Recent Mark Actions
                    </h2>

                    <DataTable
                        columns={columns}
                        data={overrides}
                        searchPlaceholder="Search mark actions..."
                    />
                </div>
            </div>

            <Modal
                isOpen={overrideModalOpen}
                onClose={() => setOverrideModalOpen(false)}
                title="Create Mark Override"
                size="md"
            >
                <MarkOverrideForm
                    onSubmit={handleCreateOverride}
                    onCancel={() => setOverrideModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={manualScoreModalOpen}
                onClose={() => setManualScoreModalOpen(false)}
                title="Enter Manual Score"
                size="md"
            >
                <ManualScoreEntryForm
                    onSubmit={handleManualScore}
                    onCancel={() => setManualScoreModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={correctionModalOpen}
                onClose={() => setCorrectionModalOpen(false)}
                title="Correct Ledger Event"
                size="md"
            >
                <EventCorrectionForm
                    onSubmit={handleEventCorrection}
                    onCancel={() => setCorrectionModalOpen(false)}
                />
            </Modal>
        </>
    );
}