import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import Tabs from '../../components/common/Tabs';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import AdminTopicList from '../../components/admin/curriculum/AdminTopicList';
import AdminTopicForm from '../../components/admin/curriculum/AdminTopicForm';
import AdminTopicDetails from '../../components/admin/curriculum/AdminTopicDetails';

import AdminLectureList from '../../components/admin/lecture/AdminLectureList';

import AdminAssignmentsPanel from '../../components/admin/assignment/AdminAssignmentsPanel';
import AdminAttendancePanel from '../../components/admin/attendance/AdminAttendancePanel';
import AdminQuizPanel from '../../components/admin/quiz/AdminQuizPanel';
import AdminCodeReviewPanel from '../../components/admin/progress/AdminCodeReviewPanel';
import AdminScoringPanel from '../../components/admin/progress/AdminScoringPanel';
import AdminAnalyticsPanel from '../../components/admin/progress/AdminAnalyticsPanel';

import { useBatches } from '../../hooks/useBatches';

import {
    useTopics,
    useCreateTopic,
    useUpdateTopic,
    useDeleteTopic,
    useUploadTopicNotes,
    useDeleteTopicNote,
} from '../../hooks/useTopics';

import { useLectures } from '../../hooks/useLectures';

function getEntityId(value) {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    return value._id || value.id || '';
}

function getList(response, keys = []) {
    if (Array.isArray(response)) {
        return response;
    }

    for (const key of keys) {
        if (Array.isArray(response?.[key])) {
            return response[key];
        }
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
}

function normalizeNote(note) {
    if (
        typeof note === 'object' &&
        note !== null
    ) {
        return {
            ...note,

            id:
                note.id ||
                note._id ||
                note.filename ||
                note.path ||
                note.url,

            filename:
                note.filename ||
                note.originalName ||
                note.name ||
                'Document',

            uploadedAt:
                note.uploadedAt ||
                note.createdAt ||
                null,
        };
    }

    const filePath = String(note);
    const parts = filePath.split('/');

    return {
        id: parts[parts.length - 1] || filePath,

        filename:
            parts[parts.length - 1] ||
            'Document',

        uploadedAt: null,

        url: filePath,
    };
}

function normalizeTopic(
    topic,
    index,
    selectedBatchId
) {
    const id = getEntityId(topic);

    const notesSource = Array.isArray(
        topic?.notes
    )
        ? topic.notes
        : Array.isArray(topic?.notesFiles)
            ? topic.notesFiles
            : [];

    const notes =
        notesSource.map(normalizeNote);

    const order =
        topic?.order ??
        topic?.orderIndex ??
        index + 1;

    return {
        ...topic,

        id,
        _id: id,

        batchId:
            getEntityId(topic?.batchId) ||
            selectedBatchId,

        order,
        orderIndex: order,

        notes,

        notesCount:
            topic?.notesCount ??
            notes.length,

        lectureCount:
            topic?.lectureCount ??
            topic?.sessionCount ??
            0,

        completed:
            topic?.completed ??
            String(
                topic?.status || ''
            ).toLowerCase() ===
            'completed',
    };
}

function normalizeLecture(lecture) {
    const id = getEntityId(lecture);

    const rawTopic =
        lecture?.topicId ||
        lecture?.topicIds?.[0] ||
        '';

    const topicId =
        getEntityId(rawTopic);

    const date =
        lecture?.date ||
        lecture?.sessionDateAndTime ||
        '';

    const status = String(
        lecture?.status || 'scheduled'
    )
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/-/g, '_');

    return {
        ...lecture,

        id,
        _id: id,

        batchId:
            getEntityId(lecture?.batchId),

        courseId:
            getEntityId(lecture?.courseId),

        topicId,

        topicIds:
            topicId
                ? [topicId]
                : [],

        date,

        sessionDateAndTime: date,

        title:
            lecture?.title ||
            lecture?.sessionTitle ||
            'Untitled Lecture',

        meetUrl:
            lecture?.meetUrl ||
            lecture?.meetingUrl ||
            '',

        description:
            lecture?.description || '',

        status:
            status === 'inprogress'
                ? 'in_progress'
                : status,
    };
}

export default function AdminLearningFlow() {
    const {
        data: batchesResponse,
        isLoading: batchesLoading,
        isError: batchesFailed,
        error: batchesError,
        refetch: refetchBatches,
    } = useBatches();

    const batches = useMemo(
        () =>
            getList(batchesResponse, [
                'batches',
                'items',
            ]),
        [batchesResponse]
    );

    const [
        selectedBatchId,
        setSelectedBatchId,
    ] = useState('');

    useEffect(() => {
        if (
            selectedBatchId ||
            batches.length === 0
        ) {
            return;
        }

        const firstBatchId =
            getEntityId(batches[0]);

        if (firstBatchId) {
            setSelectedBatchId(
                firstBatchId
            );
        }
    }, [
        batches,
        selectedBatchId,
    ]);

    const {
        data: topicsResponse = [],
        isLoading: topicsLoading,
        isError: topicsFailed,
        error: topicsError,
    } = useTopics(selectedBatchId);

    const {
        data: lecturesResponse = [],
        isLoading: lecturesLoading,
        isError: lecturesFailed,
        error: lecturesError,
    } = useLectures(selectedBatchId);

    const createTopicMutation =
        useCreateTopic();

    const updateTopicMutation =
        useUpdateTopic();

    const deleteTopicMutation =
        useDeleteTopic();

    const uploadNotesMutation =
        useUploadTopicNotes();

    const deleteNoteMutation =
        useDeleteTopicNote();

    const [
        topicModalOpen,
        setTopicModalOpen,
    ] = useState(false);

    const [
        topicDetailsOpen,
        setTopicDetailsOpen,
    ] = useState(false);

    const [
        editingTopic,
        setEditingTopic,
    ] = useState(null);

    const [
        selectedTopicId,
        setSelectedTopicId,
    ] = useState('');

    const [
        topicToDelete,
        setTopicToDelete,
    ] = useState(null);

    const [
        topicActionError,
        setTopicActionError,
    ] = useState('');

    const [
        lectureActionError,
        setLectureActionError,
    ] = useState('');

    const batchOptions = useMemo(
        () =>
            batches
                .map((batch) => ({
                    value:
                        getEntityId(batch),

                    label:
                        batch.name ||
                        batch.batchName ||
                        batch.title ||
                        'Unnamed Batch',
                }))
                .filter(
                    (option) =>
                        option.value
                ),
        [batches]
    );

    const selectedBatchTopics =
        useMemo(
            () =>
                getList(
                    topicsResponse,
                    [
                        'topics',
                        'items',
                    ]
                )
                    .map(
                        (
                            topic,
                            index
                        ) =>
                            normalizeTopic(
                                topic,
                                index,
                                selectedBatchId
                            )
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            (first.order ||
                                0) -
                            (second.order ||
                                0)
                    ),
            [
                topicsResponse,
                selectedBatchId,
            ]
        );

    const selectedBatchLectures =
        useMemo(
            () =>
                getList(
                    lecturesResponse,
                    [
                        'lectures',
                        'sessions',
                        'items',
                    ]
                )
                    .map(
                        normalizeLecture
                    )
                    .sort(
                        (
                            first,
                            second
                        ) =>
                            new Date(
                                first.date
                            ) -
                            new Date(
                                second.date
                            )
                    ),
            [lecturesResponse]
        );

    const selectedTopic = useMemo(
        () =>
            selectedBatchTopics.find(
                (topic) =>
                    getEntityId(topic) ===
                    selectedTopicId
            ) || null,
        [
            selectedBatchTopics,
            selectedTopicId,
        ]
    );

    const openCreateTopicModal = () => {
        setEditingTopic(null);
        setTopicActionError('');
        setTopicModalOpen(true);
    };

    const openEditTopicModal = (topic) => {
        setEditingTopic(topic);
        setTopicActionError('');
        setTopicModalOpen(true);
    };

    const closeTopicModal = () => {
        setEditingTopic(null);
        setTopicModalOpen(false);
        setTopicActionError('');
    };

    const openTopicDetails = (topic) => {
        setSelectedTopicId(
            getEntityId(topic)
        );

        setTopicActionError('');
        setTopicDetailsOpen(true);
    };

    const closeTopicDetails = () => {
        setSelectedTopicId('');
        setTopicDetailsOpen(false);
    };

    const handleBatchChange = (event) => {
        setSelectedBatchId(
            event.target.value
        );

        closeTopicDetails();
        closeTopicModal();

        setTopicToDelete(null);
        setTopicActionError('');
        setLectureActionError('');
    };

    const handleSaveTopic = async (
        formData
    ) => {
        if (!selectedBatchId) {
            setTopicActionError(
                'Please select a batch first.'
            );

            return;
        }

        const title =
            formData.title.trim();

        const description =
            formData.description?.trim() ||
            `Introduction and learning material for ${title}.`;

        const data = {
            title,
            description,
            estimatedHours: 1,

            learningObjectives: [
                `Understand the main concepts of ${title}.`,
            ],
        };

        setTopicActionError('');

        try {
            if (editingTopic) {
                await updateTopicMutation.mutateAsync(
                    {
                        batchId:
                            selectedBatchId,

                        topicId:
                            getEntityId(
                                editingTopic
                            ),

                        data,
                    }
                );
            } else {
                await createTopicMutation.mutateAsync(
                    {
                        batchId:
                            selectedBatchId,

                        data,
                    }
                );
            }

            closeTopicModal();
        } catch (error) {
            setTopicActionError(
                error?.message ||
                'Unable to save topic.'
            );
        }
    };

    const handleDeleteTopic = async () => {
        if (!topicToDelete) {
            return;
        }

        const topicId =
            getEntityId(topicToDelete);

        setTopicActionError('');

        try {
            await deleteTopicMutation.mutateAsync(
                {
                    batchId:
                        selectedBatchId,

                    topicId,
                }
            );

            if (
                selectedTopicId ===
                topicId
            ) {
                closeTopicDetails();
            }

            setTopicToDelete(null);
        } catch (error) {
            setTopicActionError(
                error?.message ||
                'Unable to delete topic.'
            );

            setTopicToDelete(null);
        }
    };

    const handleUploadNote = async (
        file
    ) => {
        if (
            !selectedTopic ||
            !file
        ) {
            return;
        }

        const formData =
            new FormData();

        formData.append(
            'notes',
            file
        );

        setTopicActionError('');

        try {
            await uploadNotesMutation.mutateAsync(
                {
                    batchId:
                        selectedBatchId,

                    topicId:
                        getEntityId(
                            selectedTopic
                        ),

                    formData,
                }
            );
        } catch (error) {
            setTopicActionError(
                error?.message ||
                'Unable to upload note.'
            );
        }
    };

    const handleDeleteNote = async (
        noteId
    ) => {
        if (
            !selectedTopic ||
            !noteId
        ) {
            return;
        }

        setTopicActionError('');

        try {
            await deleteNoteMutation.mutateAsync(
                {
                    batchId:
                        selectedBatchId,

                    topicId:
                        getEntityId(
                            selectedTopic
                        ),

                    fileId: noteId,
                }
            );
        } catch (error) {
            setTopicActionError(
                error?.message ||
                'Unable to delete note.'
            );
        }
    };

    const showAdminLectureRestriction = () => {
        setLectureActionError(
            'Lecture changes require an instructor profile and are currently unavailable for Admin users.'
        );
    };

    const tabs = [
        {
            label:
                'Curriculum & Topics',

            content: (
                <>
                    {topicActionError && (
                        <div
                            role="alert"
                            style={{
                                marginBottom:
                                    'var(--space-md)',

                                padding:
                                    'var(--space-sm)',

                                border:
                                    '2px solid var(--color-danger)',

                                color:
                                    'var(--color-danger)',

                                fontWeight:
                                    'var(--font-bold)',
                            }}
                        >
                            {topicActionError}
                        </div>
                    )}

                    {topicsLoading ? (
                        <p>
                            Loading topics...
                        </p>
                    ) : topicsFailed ? (
                        <p
                            style={{
                                color:
                                    'var(--color-danger)',
                            }}
                        >
                            {topicsError?.message ||
                                'Unable to load topics.'}
                        </p>
                    ) : (
                        <AdminTopicList
                            topics={
                                selectedBatchTopics
                            }
                            onAdd={
                                openCreateTopicModal
                            }
                            onSelect={
                                openTopicDetails
                            }
                            onEdit={
                                openEditTopicModal
                            }
                            onDelete={
                                setTopicToDelete
                            }
                        />
                    )}
                </>
            ),
        },

        {
            label: 'Lectures',

            content: (
                <>
                    {lectureActionError && (
                        <div
                            role="alert"
                            style={{
                                marginBottom:
                                    'var(--space-md)',

                                padding:
                                    'var(--space-sm)',

                                border:
                                    '2px solid var(--color-warning)',

                                color:
                                    'var(--color-text-primary)',

                                fontWeight:
                                    'var(--font-bold)',
                            }}
                        >
                            {lectureActionError}
                        </div>
                    )}

                    {lecturesLoading ? (
                        <p>
                            Loading lectures...
                        </p>
                    ) : lecturesFailed ? (
                        <p
                            style={{
                                color:
                                    'var(--color-danger)',
                            }}
                        >
                            {lecturesError?.message ||
                                'Unable to load lectures.'}
                        </p>
                    ) : (
                        <AdminLectureList
                            lectures={
                                selectedBatchLectures
                            }
                            topics={
                                selectedBatchTopics
                            }
                            onAdd={
                                showAdminLectureRestriction
                            }
                            onEdit={
                                showAdminLectureRestriction
                            }
                            onDelete={
                                showAdminLectureRestriction
                            }
                            onStatusChange={
                                showAdminLectureRestriction
                            }
                        />
                    )}
                </>
            ),
        },

        {
            label: 'Assignments',

            content: (
                <AdminAssignmentsPanel
                    batchId={
                        selectedBatchId
                    }
                    topics={
                        selectedBatchTopics
                    }
                    lectures={
                        selectedBatchLectures
                    }
                />
            ),
        },

        {
            label: 'Attendance',

            content: (
                <AdminAttendancePanel
                    batchId={
                        selectedBatchId
                    }
                    lectures={
                        selectedBatchLectures
                    }
                />
            ),
        },

        {
            label: 'Quizzes',

            content: (
                <AdminQuizPanel
                    batchId={
                        selectedBatchId
                    }
                    topics={
                        selectedBatchTopics
                    }
                    lectures={
                        selectedBatchLectures
                    }
                />
            ),
        },

        {
            label: 'Code Reviews',

            content: (
                <AdminCodeReviewPanel
                    batchId={
                        selectedBatchId
                    }
                />
            ),
        },

        {
            label: 'Scoring Engine',

            content: (
                <AdminScoringPanel
                    batchId={
                        selectedBatchId
                    }
                />
            ),
        },

        {
            label: 'Analytics',

            content: (
                <AdminAnalyticsPanel
                    topics={
                        selectedBatchTopics
                    }
                    lectures={
                        selectedBatchLectures
                    }
                />
            ),
        },
    ];

    if (batchesLoading) {
        return (
            <p>Loading batches...</p>
        );
    }

    if (batchesFailed) {
        return (
            <div>
                <p
                    style={{
                        color:
                            'var(--color-danger)',
                    }}
                >
                    {batchesError?.message ||
                        'Unable to load batches.'}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        refetchBatches()
                    }
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection:
                        'column',
                    gap:
                        'var(--space-xl)',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize:
                                'var(--text-2xl)',

                            fontWeight:
                                'var(--font-bold)',
                        }}
                    >
                        Learning Management
                    </h1>

                    <p
                        style={{
                            marginTop:
                                'var(--space-xs)',

                            color:
                                'var(--color-text-secondary)',
                        }}
                    >
                        Review curriculum,
                        lectures, assignments,
                        attendance, quizzes,
                        code reviews, scoring,
                        and analytics.
                    </p>
                </div>

                {batches.length === 0 ? (
                    <p>
                        No batches are
                        available.
                    </p>
                ) : (
                    <div
                        style={{
                            maxWidth:
                                '360px',
                        }}
                    >
                        <Select
                            label="Select Batch"
                            name="batchId"
                            value={
                                selectedBatchId
                            }
                            options={
                                batchOptions
                            }
                            onChange={
                                handleBatchChange
                            }
                        />
                    </div>
                )}

                {selectedBatchId ? (
                    <Tabs tabs={tabs} />
                ) : (
                    batches.length > 0 && (
                        <p>
                            Select a batch to
                            continue.
                        </p>
                    )
                )}
            </div>

            <Modal
                isOpen={topicModalOpen}
                onClose={closeTopicModal}
                title={
                    editingTopic
                        ? 'Edit Topic'
                        : 'Add Topic'
                }
                size="md"
            >
                {topicActionError && (
                    <div
                        role="alert"
                        style={{
                            marginBottom:
                                'var(--space-md)',

                            color:
                                'var(--color-danger)',

                            fontWeight:
                                'var(--font-bold)',
                        }}
                    >
                        {topicActionError}
                    </div>
                )}

                <AdminTopicForm
                    key={
                        getEntityId(
                            editingTopic
                        ) || 'new-topic'
                    }
                    defaultValues={
                        editingTopic
                            ? {
                                title:
                                    editingTopic.title,

                                description:
                                    editingTopic.description ||
                                    '',
                            }
                            : null
                    }
                    onSubmit={
                        handleSaveTopic
                    }
                    onCancel={
                        closeTopicModal
                    }
                />
            </Modal>

            <Modal
                isOpen={
                    topicDetailsOpen
                }
                onClose={
                    closeTopicDetails
                }
                title="Topic Details"
                size="lg"
            >
                {topicActionError && (
                    <div
                        role="alert"
                        style={{
                            marginBottom:
                                'var(--space-md)',

                            color:
                                'var(--color-danger)',

                            fontWeight:
                                'var(--font-bold)',
                        }}
                    >
                        {topicActionError}
                    </div>
                )}

                <AdminTopicDetails
                    topic={
                        selectedTopic
                    }
                    notes={
                        selectedTopic?.notes ||
                        []
                    }
                    onUploadNote={
                        handleUploadNote
                    }
                    onDeleteNote={
                        handleDeleteNote
                    }
                />
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(
                    topicToDelete
                )}
                title="Delete Topic"
                message={
                    topicToDelete
                        ? `Delete "${topicToDelete.title}"? This action cannot be undone.`
                        : ''
                }
                confirmLabel={
                    deleteTopicMutation.isPending
                        ? 'Deleting...'
                        : 'Delete'
                }
                variant="danger"
                loading={
                    deleteTopicMutation.isPending
                }
                onConfirm={
                    handleDeleteTopic
                }
                onCancel={() =>
                    setTopicToDelete(null)
                }
            />
        </>
    );
}