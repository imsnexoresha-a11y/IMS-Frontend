import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
    Calculator,
    FilePenLine,
    RefreshCw,
    Wrench,
} from 'lucide-react';

import {
    useCorrectLedgerEvent,
    useCreateManualScore,
    useCreateMarkOverride,
    useRecalculateBatch,
    useRecalculateStudent,
} from '../../hooks/useMarks';

import { useStudents } from '../../hooks/useStudents';
import { useBatches } from '../../hooks/useBatches';

import MarkOverrideForm from '../../components/admin/MarkOverrideForm';
import ManualScoreEntryForm from '../../components/admin/ManualScoreEntryForm';
import EventCorrectionForm from '../../components/admin/EventCorrectionForm';

import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { useToast } from '../../components/common/Toast';

function getStudentName(student) {
    return (
        student?.userId?.name ||
        student?.user?.name ||
        student?.name ||
        'Unnamed student'
    );
}

function RecalculationForm({
    type,
    students,
    batches,
    onSubmit,
    onCancel,
    loading,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const options =
        type === 'student'
            ? students.map((student) => ({
                value: student._id || student.id,
                label: getStudentName(student),
            }))
            : batches.map((batch) => ({
                value: batch._id || batch.id,
                label: batch.name,
            }));

    const fieldName =
        type === 'student'
            ? 'studentId'
            : 'batchId';

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
            }}
        >
            <Select
                label={
                    type === 'student'
                        ? 'Student'
                        : 'Batch'
                }
                options={options}
                error={errors[fieldName]?.message}
                {...register(fieldName, {
                    required: `${type === 'student'
                            ? 'Student'
                            : 'Batch'
                        } is required`,
                })}
            />

            <Textarea
                label="Reason"
                rows={3}
                error={errors.reason?.message}
                {...register('reason', {
                    required: 'Reason is required',
                    minLength: {
                        value: 20,
                        message:
                            'Reason must contain at least 20 characters',
                    },
                })}
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
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                >
                    {loading
                        ? 'Recalculating...'
                        : 'Recalculate'}
                </Button>
            </div>
        </form>
    );
}

export default function AdminMarkOverrides() {
    const toast = useToast();
    const [activeModal, setActiveModal] =
        useState(null);

    const [successMessage, setSuccessMessage] =
        useState('');

    const [errorMessage, setErrorMessage] =
        useState('');

    const { data: students = [] } =
        useStudents();

    const { data: batches = [] } =
        useBatches();

    const overrideMutation =
        useCreateMarkOverride();

    const correctionMutation =
        useCorrectLedgerEvent();

    const manualMutation =
        useCreateManualScore();

    const studentRecalculationMutation =
        useRecalculateStudent();

    const batchRecalculationMutation =
        useRecalculateBatch();

    const execute = async (
        mutation,
        data,
        successText
    ) => {
        setSuccessMessage('');
        setErrorMessage('');

        try {
            await mutation.mutateAsync(data);
            setSuccessMessage(successText);
            toast.success('✅ Done!', successText);
            setActiveModal(null);
        } catch (error) {
            const msg = error?.message || 'Request failed.';
            setErrorMessage(msg);
            toast.error('❌ Action Failed', msg);
            throw error;
        }
    };

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
                    <h1>Marks Administration</h1>
                    <p
                        style={{
                            color:
                                'var(--color-text-secondary)',
                        }}
                    >
                        Override marks, correct ledger
                        events, record manual scores, and
                        recalculate totals.
                    </p>
                </div>

                {successMessage && (
                    <Badge variant="success">
                        {successMessage}
                    </Badge>
                )}

                {errorMessage && (
                    <div
                        role="alert"
                        style={{
                            border:
                                '2px solid var(--color-danger)',
                            color: 'var(--color-danger)',
                            padding: 'var(--space-sm)',
                            fontWeight:
                                'var(--font-bold)',
                        }}
                    >
                        {errorMessage}
                    </div>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 'var(--space-md)',
                    }}
                >
                    <Card>
                        <FilePenLine size={24} />
                        <h3>Mark Override</h3>
                        <Button
                            variant="primary"
                            onClick={() =>
                                setActiveModal('override')
                            }
                        >
                            Open
                        </Button>
                    </Card>

                    <Card>
                        <Wrench size={24} />
                        <h3>Event Correction</h3>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setActiveModal('correction')
                            }
                        >
                            Open
                        </Button>
                    </Card>

                    <Card>
                        <Calculator size={24} />
                        <h3>Manual Score</h3>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setActiveModal('manual')
                            }
                        >
                            Open
                        </Button>
                    </Card>

                    <Card>
                        <RefreshCw size={24} />
                        <h3>Recalculate Student</h3>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setActiveModal(
                                    'recalculate-student'
                                )
                            }
                        >
                            Open
                        </Button>
                    </Card>

                    <Card>
                        <RefreshCw size={24} />
                        <h3>Recalculate Batch</h3>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                setActiveModal(
                                    'recalculate-batch'
                                )
                            }
                        >
                            Open
                        </Button>
                    </Card>
                </div>
            </div>

            <Modal
                isOpen={activeModal === 'override'}
                onClose={() => setActiveModal(null)}
                title="Mark Override"
                size="md"
            >
                <MarkOverrideForm
                    students={students}
                    loading={overrideMutation.isPending}
                    onCancel={() => setActiveModal(null)}
                    onSubmit={(data) =>
                        execute(
                            overrideMutation,
                            data,
                            'Mark override completed successfully.'
                        )
                    }
                />
            </Modal>

            <Modal
                isOpen={activeModal === 'correction'}
                onClose={() => setActiveModal(null)}
                title="Correct Ledger Event"
                size="md"
            >
                <EventCorrectionForm
                    loading={
                        correctionMutation.isPending
                    }
                    onCancel={() => setActiveModal(null)}
                    onSubmit={(data) =>
                        execute(
                            correctionMutation,
                            data,
                            'Ledger event corrected successfully.'
                        )
                    }
                />
            </Modal>

            <Modal
                isOpen={activeModal === 'manual'}
                onClose={() => setActiveModal(null)}
                title="Manual Score"
                size="md"
            >
                <ManualScoreEntryForm
                    students={students}
                    loading={manualMutation.isPending}
                    onCancel={() => setActiveModal(null)}
                    onSubmit={(data) =>
                        execute(
                            manualMutation,
                            data,
                            'Manual score recorded successfully.'
                        )
                    }
                />
            </Modal>

            <Modal
                isOpen={
                    activeModal ===
                    'recalculate-student'
                }
                onClose={() => setActiveModal(null)}
                title="Recalculate Student"
                size="md"
            >
                <RecalculationForm
                    type="student"
                    students={students}
                    batches={batches}
                    loading={
                        studentRecalculationMutation.isPending
                    }
                    onCancel={() => setActiveModal(null)}
                    onSubmit={(data) =>
                        execute(
                            studentRecalculationMutation,
                            data,
                            'Student recalculated successfully.'
                        )
                    }
                />
            </Modal>

            <Modal
                isOpen={
                    activeModal ===
                    'recalculate-batch'
                }
                onClose={() => setActiveModal(null)}
                title="Recalculate Batch"
                size="md"
            >
                <RecalculationForm
                    type="batch"
                    students={students}
                    batches={batches}
                    loading={
                        batchRecalculationMutation.isPending
                    }
                    onCancel={() => setActiveModal(null)}
                    onSubmit={(data) =>
                        execute(
                            batchRecalculationMutation,
                            data,
                            'Batch recalculated successfully.'
                        )
                    }
                />
            </Modal>
        </>
    );
}