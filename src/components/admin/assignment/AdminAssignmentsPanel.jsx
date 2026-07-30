import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ClipboardList,
    Code2,
    ExternalLink,
    Plus,
} from 'lucide-react';

import DataTable from '../../common/DataTable';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import EmptyState from '../../common/EmptyState';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Select from '../../common/Select';

import { createSessionAssignment } from '../../../api/teacherApi';
import { formatDateTime } from '../../../utils/formatters';
import { GITHUB_URL_PATTERN } from '../../../utils/constants';

function getId(item) {
    return item?._id || item?.id || '';
}

function getLectureAssignment(lecture) {
    if (!lecture?.assignmentTitle) {
        return null;
    }

    const lectureId = getId(lecture);

    return {
        id: lecture.assignmentId || `lecture-assignment-${lectureId}`,
        lectureId,
        topicId:
            lecture.topicId ||
            lecture.topicIds?.[0] ||
            '',
        title: lecture.assignmentTitle,
        instructions:
            lecture.assignmentDescription ||
            'Complete the assignment as instructed.',
        dueDate:
            lecture.assignmentDeadline ||
            lecture.submissionDeadline ||
            null,
        starterRepoUrl:
            lecture.githubRepoSeed ||
            lecture.starterRepoUrl ||
            '',
        status: 'published',
    };
}

function AdminAssignmentForm({
    topics,
    lectures,
    onSubmit,
    onCancel,
}) {
    const availableLectures = lectures.filter(
        (lecture) => !lecture.assignmentTitle
    );

    const lectureOptions = availableLectures.map((lecture) => {
        const lectureId = getId(lecture);
        const topicId =
            lecture.topicId ||
            lecture.topicIds?.[0] ||
            '';

        const topic = topics.find(
            (item) => getId(item) === topicId
        );

        return {
            value: lectureId,
            label: topic?.title
                ? `${lecture.title} — ${topic.title}`
                : lecture.title,
        };
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            lectureId: '',
            title: '',
            instructions: '',
            starterRepoUrl: '',
            dueDate: '',
        },
    });

    const submitForm = async (formData) => {
        await onSubmit({
            lectureId: formData.lectureId,
            title: formData.title.trim(),
            instructions: formData.instructions.trim(),
            starterRepoUrl:
                formData.starterRepoUrl?.trim() || '',
            dueDate: formData.dueDate,
        });

        reset();
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
            <Select
                label="Related Lecture"
                name="lectureId"
                options={[
                    {
                        value: '',
                        label: 'Select a lecture',
                    },
                    ...lectureOptions,
                ]}
                required
                error={errors.lectureId?.message}
                {...register('lectureId', {
                    required: 'Please select a lecture',
                })}
            />

            {availableLectures.length === 0 && (
                <div
                    style={{
                        padding: 'var(--space-md)',
                        borderRadius: 'var(--radius-md)',
                        background:
                            'var(--color-surface-secondary)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    Every lecture in this batch already has an
                    assignment. Create another lecture before adding
                    a new assignment.
                </div>
            )}

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

            <Textarea
                label="Task Instructions"
                name="instructions"
                placeholder="Describe the task, requirements, and expected output"
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
                    validate: (value) => {
                        if (!value) {
                            return 'Due date is required';
                        }

                        const dueDate = new Date(value);

                        if (Number.isNaN(dueDate.getTime())) {
                            return 'Enter a valid due date';
                        }

                        if (dueDate <= new Date()) {
                            return 'Due date must be in the future';
                        }

                        return true;
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
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={
                        isSubmitting ||
                        availableLectures.length === 0
                    }
                >
                    {isSubmitting
                        ? 'Creating...'
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
    const [createdAssignments, setCreatedAssignments] =
        useState([]);

    const [assignmentModalOpen, setAssignmentModalOpen] =
        useState(false);

    const [requestError, setRequestError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setCreatedAssignments([]);
        setRequestError('');
        setSuccessMessage('');
        setAssignmentModalOpen(false);
    }, [batchId]);

    const lectureAssignments = useMemo(
        () =>
            lectures
                .map(getLectureAssignment)
                .filter(Boolean),
        [lectures]
    );

    const assignments = useMemo(() => {
        const assignmentsByLecture = new Map();

        lectureAssignments.forEach((assignment) => {
            assignmentsByLecture.set(
                assignment.lectureId,
                assignment
            );
        });

        createdAssignments.forEach((assignment) => {
            assignmentsByLecture.set(
                assignment.lectureId,
                assignment
            );
        });

        return Array.from(assignmentsByLecture.values()).sort(
            (first, second) => {
                if (!first.dueDate) {
                    return 1;
                }

                if (!second.dueDate) {
                    return -1;
                }

                return (
                    new Date(first.dueDate) -
                    new Date(second.dueDate)
                );
            }
        );
    }, [lectureAssignments, createdAssignments]);

    const topicMap = useMemo(
        () =>
            Object.fromEntries(
                topics.map((topic) => [
                    getId(topic),
                    topic.title,
                ])
            ),
        [topics]
    );

    const lectureMap = useMemo(
        () =>
            Object.fromEntries(
                lectures.map((lecture) => [
                    getId(lecture),
                    lecture.title,
                ])
            ),
        [lectures]
    );

    const lecturesWithCurrentAssignments = useMemo(() => {
        const assignedLectureIds = new Set(
            assignments.map(
                (assignment) => assignment.lectureId
            )
        );

        return lectures.map((lecture) => ({
            ...lecture,
            assignmentTitle: assignedLectureIds.has(
                getId(lecture)
            )
                ? lecture.assignmentTitle ||
                'Assignment already created'
                : '',
        }));
    }, [lectures, assignments]);

    const openCreateModal = () => {
        setRequestError('');
        setSuccessMessage('');
        setAssignmentModalOpen(true);
    };

    const closeAssignmentModal = () => {
        setRequestError('');
        setAssignmentModalOpen(false);
    };

    const handleCreateAssignment = async (formData) => {
        setRequestError('');
        setSuccessMessage('');

        try {
            const assignmentDeadline = new Date(
                formData.dueDate
            ).toISOString();

            const response = await createSessionAssignment(
                formData.lectureId,
                {
                    assignmentTitle: formData.title,
                    assignmentDescription:
                        formData.instructions,
                    assignmentDeadline,
                    githubRepoSeed:
                        formData.starterRepoUrl ||
                        undefined,
                }
            );

            const lecture = lectures.find(
                (item) =>
                    getId(item) === formData.lectureId
            );

            const newAssignment = {
                id:
                    response?._id ||
                    `assignment-${Date.now()}`,
                lectureId: formData.lectureId,
                topicId:
                    lecture?.topicId ||
                    lecture?.topicIds?.[0] ||
                    '',
                title:
                    response?.title ||
                    formData.title,
                instructions:
                    response?.prompt ||
                    formData.instructions,
                dueDate:
                    response?.submissionDeadline ||
                    assignmentDeadline,
                starterRepoUrl:
                    formData.starterRepoUrl ||
                    '',
                status: 'published',
            };

            setCreatedAssignments((current) => [
                ...current.filter(
                    (assignment) =>
                        assignment.lectureId !==
                        formData.lectureId
                ),
                newAssignment,
            ]);

            setAssignmentModalOpen(false);
            setSuccessMessage(
                'Assignment created successfully. Students have been notified.'
            );
        } catch (error) {
            setRequestError(
                error.message ||
                'Failed to create assignment'
            );

            throw error;
        }
    };

    const columns = [
        {
            key: 'title',
            label: 'Assignment',
            render: (value, row) => (
                <div>
                    <div
                        style={{
                            fontWeight:
                                'var(--font-bold)',
                        }}
                    >
                        {value}
                    </div>

                    <div
                        style={{
                            marginTop: '2px',
                            fontSize:
                                'var(--text-xs)',
                            color:
                                'var(--color-text-secondary)',
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
                value
                    ? formatDateTime(value)
                    : '—',
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
                            color:
                                'var(--color-accent)',
                            fontWeight:
                                'var(--font-bold)',
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
            render: (value, row) => {
                const isPastDue = row.dueDate && new Date(row.dueDate) < new Date();
                const displayStatus = isPastDue && value === 'published' ? 'overdue' : (value || 'published');
                const variant = displayStatus === 'overdue' ? 'error' : (displayStatus === 'published' ? 'success' : 'neutral');
                return (
                    <Badge
                        variant={variant}
                        dot
                    >
                        {displayStatus === 'overdue' ? 'Overdue' : (displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1))}
                    </Badge>
                );
            },
        },
    ];

    return (
        <>
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        alignItems: 'center',
                        marginBottom:
                            'var(--space-md)',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-xs)',
                                fontSize:
                                    'var(--text-lg)',
                                fontWeight:
                                    'var(--font-bold)',
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
                                fontSize:
                                    'var(--text-sm)',
                            }}
                        >
                            Manually create assignments for
                            lectures in this batch.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={openCreateModal}
                        disabled={
                            lectures.length === 0 ||
                            assignments.length >=
                            lectures.length
                        }
                    >
                        <Plus size={16} />
                        Create Assignment
                    </Button>
                </div>

                {successMessage && (
                    <div
                        style={{
                            marginBottom:
                                'var(--space-md)',
                            padding:
                                'var(--space-sm) var(--space-md)',
                            borderRadius:
                                'var(--radius-md)',
                            background:
                                'var(--color-success-light)',
                            color:
                                'var(--color-success)',
                            fontSize:
                                'var(--text-sm)',
                            fontWeight:
                                'var(--font-semibold)',
                        }}
                    >
                        {successMessage}
                    </div>
                )}

                {lectures.length === 0 ? (
                    <EmptyState
                        title="No lectures available"
                        description="Create a lecture before creating an assignment."
                    />
                ) : assignments.length === 0 ? (
                    <EmptyState
                        title="No assignments created"
                        description="Create a manual assignment for one of this batch's lectures."
                    />
                ) : (
                    <DataTable
                        columns={columns}
                        data={assignments}
                        searchPlaceholder="Search assignments..."
                    />
                )}
            </div>

            <Modal
                isOpen={assignmentModalOpen}
                onClose={closeAssignmentModal}
                title="Create Assignment"
                size="lg"
            >
                {requestError && (
                    <div
                        style={{
                            marginBottom:
                                'var(--space-md)',
                            padding:
                                'var(--space-sm) var(--space-md)',
                            borderRadius:
                                'var(--radius-md)',
                            background:
                                'var(--color-error-light)',
                            color:
                                'var(--color-error)',
                            fontSize:
                                'var(--text-sm)',
                            fontWeight:
                                'var(--font-semibold)',
                        }}
                    >
                        {requestError}
                    </div>
                )}

                <AdminAssignmentForm
                    topics={topics}
                    lectures={
                        lecturesWithCurrentAssignments
                    }
                    onSubmit={handleCreateAssignment}
                    onCancel={closeAssignmentModal}
                />
            </Modal>
        </>
    );
}