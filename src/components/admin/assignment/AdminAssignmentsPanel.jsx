import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ClipboardList,
    Code2,
    ExternalLink,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';

import DataTable from '../../common/DataTable';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import ConfirmDialog from '../../common/ConfirmDialog';
import EmptyState from '../../common/EmptyState';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Select from '../../common/Select';

import { mockAssignments } from '../../../api/mockData';
import { formatDateTime } from '../../../utils/formatters';
import { GITHUB_URL_PATTERN } from '../../../utils/constants';

const STATUS_VARIANTS = {
    draft: 'neutral',
    published: 'info',
    pending: 'warning',
    submitted: 'info',
    reviewed: 'success',
    late: 'error',
};

function toDateTimeLocal(dateValue) {
    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const offset = date.getTimezoneOffset();
    const localDate = new Date(
        date.getTime() - offset * 60 * 1000
    );

    return localDate.toISOString().slice(0, 16);
}

function AdminAssignmentForm({
    topics,
    lectures,
    defaultValues,
    onSubmit,
    onCancel,
}) {
    const topicOptions = topics.map((topic) => ({
        value: topic.id,
        label: topic.title,
    }));

    const lectureOptions = lectures.map((lecture) => ({
        value: lecture.id,
        label: lecture.title,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues:
            defaultValues || {
                title: '',
                topicId: '',
                lectureId: '',
                instructions: '',
                starterRepoUrl: '',
                dueDate: '',
                maxScore: 100,
                codeReviewEnabled: 'true',
                status: 'published',
            },
    });

    const submitForm = async (formData) => {
        await onSubmit?.({
            title: formData.title.trim(),
            topicId: formData.topicId,
            lectureId: formData.lectureId || null,
            instructions: formData.instructions.trim(),
            starterRepoUrl:
                formData.starterRepoUrl?.trim() || '',
            dueDate: formData.dueDate,
            maxScore: Number(formData.maxScore),
            codeReviewEnabled:
                formData.codeReviewEnabled === 'true',
            status: formData.status,
        });
    };

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
            }}
        >
            <Input
                label="Assignment Title"
                name="title"
                placeholder="Example: Build a React Task Manager"
                required
                error={errors.title?.message}
                {...register('title', {
                    required: 'Assignment title is required',
                    minLength: {
                        value: 3,
                        message:
                            'Assignment title must contain at least 3 characters',
                    },
                    maxLength: {
                        value: 120,
                        message:
                            'Assignment title cannot exceed 120 characters',
                    },
                })}
            />

            <Select
                label="Topic"
                name="topicId"
                options={[
                    {
                        value: '',
                        label: 'Select a topic',
                    },
                    ...topicOptions,
                ]}
                required
                error={errors.topicId?.message}
                {...register('topicId', {
                    required: 'Please select a topic',
                })}
            />

            <Select
                label="Related Lecture"
                name="lectureId"
                options={[
                    {
                        value: '',
                        label: 'No lecture selected',
                    },
                    ...lectureOptions,
                ]}
                {...register('lectureId')}
            />

            <Textarea
                label="Task Instructions"
                name="instructions"
                placeholder="Describe the GitHub-based task, requirements, and expected output"
                rows={6}
                required
                error={errors.instructions?.message}
                {...register('instructions', {
                    required: 'Assignment instructions are required',
                    minLength: {
                        value: 10,
                        message:
                            'Instructions must contain at least 10 characters',
                    },
                    maxLength: {
                        value: 2000,
                        message:
                            'Instructions cannot exceed 2000 characters',
                    },
                })}
            />

            <Input
                label="Starter GitHub Repository"
                name="starterRepoUrl"
                type="url"
                placeholder="https://github.com/organization/starter-repo"
                error={errors.starterRepoUrl?.message}
                {...register('starterRepoUrl', {
                    validate: (value) =>
                        !value ||
                        GITHUB_URL_PATTERN.test(value) ||
                        'Enter a valid GitHub repository URL',
                })}
            />

            <Input
                label="Due Date and Time"
                name="dueDate"
                type="datetime-local"
                required
                error={errors.dueDate?.message}
                {...register('dueDate', {
                    required: 'Due date is required',
                })}
            />

            <Input
                label="Maximum Score"
                name="maxScore"
                type="number"
                min="1"
                max="1000"
                required
                error={errors.maxScore?.message}
                {...register('maxScore', {
                    required: 'Maximum score is required',
                    min: {
                        value: 1,
                        message: 'Maximum score must be at least 1',
                    },
                    max: {
                        value: 1000,
                        message: 'Maximum score cannot exceed 1000',
                    },
                })}
            />

            <Select
                label="Automated Code Review"
                name="codeReviewEnabled"
                options={[
                    {
                        value: 'true',
                        label: 'Enabled',
                    },
                    {
                        value: 'false',
                        label: 'Disabled',
                    },
                ]}
                {...register('codeReviewEnabled')}
            />

            <Select
                label="Assignment Status"
                name="status"
                options={[
                    {
                        value: 'draft',
                        label: 'Draft',
                    },
                    {
                        value: 'published',
                        label: 'Published',
                    },
                ]}
                {...register('status')}
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
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? 'Saving...'
                        : defaultValues
                            ? 'Update Assignment'
                            : 'Create Assignment'}
                </Button>
            </div>
        </form>
    );
}

export default function AdminAssignmentsPanel({
    batchId,
    topics = [],
    lectures = [],
}) {
    const [assignments, setAssignments] = useState(
        mockAssignments.map((assignment) => ({
            ...assignment,
            topicId:
                assignment.topicId ||
                lectures.find(
                    (lecture) =>
                        lecture.id === assignment.lectureId
                )?.topicId ||
                topics[0]?.id ||
                '',
            instructions:
                assignment.instructions ||
                'Complete the assigned development task and submit your GitHub repository URL.',
            starterRepoUrl:
                assignment.starterRepoUrl || '',
            maxScore: assignment.maxScore || 100,
            codeReviewEnabled:
                assignment.codeReviewEnabled ?? true,
            status:
                assignment.status === 'pending'
                    ? 'published'
                    : assignment.status,
        }))
    );

    const [assignmentModalOpen, setAssignmentModalOpen] =
        useState(false);

    const [editingAssignment, setEditingAssignment] =
        useState(null);

    const [assignmentToDelete, setAssignmentToDelete] =
        useState(null);

    const batchAssignments = useMemo(
        () =>
            assignments
                .filter(
                    (assignment) =>
                        assignment.batchId === batchId
                )
                .sort(
                    (first, second) =>
                        new Date(first.dueDate) -
                        new Date(second.dueDate)
                ),
        [assignments, batchId]
    );

    const topicMap = Object.fromEntries(
        topics.map((topic) => [
            topic.id,
            topic.title,
        ])
    );

    const lectureMap = Object.fromEntries(
        lectures.map((lecture) => [
            lecture.id,
            lecture.title,
        ])
    );

    const openCreateModal = () => {
        setEditingAssignment(null);
        setAssignmentModalOpen(true);
    };

    const openEditModal = (assignment) => {
        setEditingAssignment(assignment);
        setAssignmentModalOpen(true);
    };

    const closeAssignmentModal = () => {
        setEditingAssignment(null);
        setAssignmentModalOpen(false);
    };

    const handleSaveAssignment = async (formData) => {
        const normalizedDueDate = new Date(
            formData.dueDate
        ).toISOString();

        if (editingAssignment) {
            setAssignments((currentAssignments) =>
                currentAssignments.map((assignment) =>
                    assignment.id === editingAssignment.id
                        ? {
                            ...assignment,
                            ...formData,
                            dueDate: normalizedDueDate,
                        }
                        : assignment
                )
            );
        } else {
            const newAssignment = {
                id: `assignment-${Date.now()}`,
                batchId,
                ...formData,
                dueDate: normalizedDueDate,
                submittedAt: null,
                githubUrl: null,
                score: null,
                feedback: null,
                isLate: false,
                submissionCount: 0,
            };

            setAssignments((currentAssignments) => [
                ...currentAssignments,
                newAssignment,
            ]);
        }

        closeAssignmentModal();
    };

    const handleDeleteAssignment = () => {
        if (!assignmentToDelete) {
            return;
        }

        setAssignments((currentAssignments) =>
            currentAssignments.filter(
                (assignment) =>
                    assignment.id !== assignmentToDelete.id
            )
        );

        setAssignmentToDelete(null);
    };

    const columns = [
        {
            key: 'title',
            label: 'Assignment',
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
                        {topicMap[row.topicId] ||
                            'Topic unavailable'}
                    </div>
                </div>
            ),
        },
        {
            key: 'lectureId',
            label: 'Lecture',
            render: (value) =>
                lectureMap[value] || '—',
        },
        {
            key: 'dueDate',
            label: 'Due Date',
            render: (value) =>
                value ? formatDateTime(value) : '—',
        },
        {
            key: 'maxScore',
            label: 'Max Score',
            render: (value) => (
                <strong>{value}</strong>
            ),
        },
        {
            key: 'codeReviewEnabled',
            label: 'Code Review',
            render: (value) => (
                <Badge
                    variant={value ? 'success' : 'neutral'}
                >
                    {value ? 'Enabled' : 'Disabled'}
                </Badge>
            ),
        },
        {
            key: 'starterRepoUrl',
            label: 'Starter Repo',
            render: (value) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
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
                ) : (
                    '—'
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Badge
                    variant={
                        STATUS_VARIANTS[value] || 'neutral'
                    }
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
                        gap: 'var(--space-xs)',
                    }}
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => openEditModal(row)}
                        aria-label={`Edit ${row.title}`}
                    >
                        <Pencil size={14} />
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() =>
                            setAssignmentToDelete(row)
                        }
                        aria-label={`Delete ${row.title}`}
                    >
                        <Trash2 size={14} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
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
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-xs)',
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            <ClipboardList size={20} />
                            Assignments
                        </h3>

                        <p
                            style={{
                                marginTop: '2px',
                                color:
                                    'var(--color-text-secondary)',
                                fontSize: 'var(--text-sm)',
                            }}
                        >
                            Create GitHub-based tasks and enable
                            automated code reviews.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        onClick={openCreateModal}
                        disabled={topics.length === 0}
                    >
                        <Plus size={16} />
                        Create Assignment
                    </Button>
                </div>

                {batchAssignments.length === 0 ? (
                    <EmptyState
                        title="No assignments created"
                        description="Create a GitHub-based assignment for this batch."
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={batchAssignments}
                        searchPlaceholder="Search assignments..."
                    />
                )}
            </div>

            <Modal
                isOpen={assignmentModalOpen}
                onClose={closeAssignmentModal}
                title={
                    editingAssignment
                        ? 'Edit Assignment'
                        : 'Create Assignment'
                }
                size="lg"
            >
                <AdminAssignmentForm
                    topics={topics}
                    lectures={lectures}
                    defaultValues={
                        editingAssignment
                            ? {
                                title: editingAssignment.title,
                                topicId:
                                    editingAssignment.topicId || '',
                                lectureId:
                                    editingAssignment.lectureId || '',
                                instructions:
                                    editingAssignment.instructions ||
                                    '',
                                starterRepoUrl:
                                    editingAssignment.starterRepoUrl ||
                                    '',
                                dueDate: toDateTimeLocal(
                                    editingAssignment.dueDate
                                ),
                                maxScore:
                                    editingAssignment.maxScore || 100,
                                codeReviewEnabled: String(
                                    editingAssignment
                                        .codeReviewEnabled ?? true
                                ),
                                status:
                                    editingAssignment.status || 'draft',
                            }
                            : null
                    }
                    onSubmit={handleSaveAssignment}
                    onCancel={closeAssignmentModal}
                />
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(assignmentToDelete)}
                title="Delete Assignment"
                message={
                    assignmentToDelete
                        ? `Delete "${assignmentToDelete.title}"? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteAssignment}
                onCancel={() =>
                    setAssignmentToDelete(null)
                }
            />
        </>
    );
}