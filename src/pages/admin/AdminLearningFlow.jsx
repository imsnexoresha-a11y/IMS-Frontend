import { useMemo, useState } from 'react';

import Tabs from '../../components/common/Tabs';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import AdminTopicList from '../../components/admin/curriculum/AdminTopicList';
import AdminTopicForm from '../../components/admin/curriculum/AdminTopicForm';
import AdminTopicDetails from '../../components/admin/curriculum/AdminTopicDetails';

import AdminLectureList from '../../components/admin/lecture/AdminLectureList';
import AdminLectureForm from '../../components/admin/lecture/AdminLectureForm';

import AdminAssignmentsPanel from '../../components/admin/assignment/AdminAssignmentsPanel';
import AdminAttendancePanel from '../../components/admin/attendance/AdminAttendancePanel';
import AdminQuizPanel from '../../components/admin/quiz/AdminQuizPanel';
import AdminCodeReviewPanel from '../../components/admin/progress/AdminCodeReviewPanel';
import AdminScoringPanel from '../../components/admin/progress/AdminScoringPanel';
import AdminAnalyticsPanel from '../../components/admin/progress/AdminAnalyticsPanel';

import {
    mockBatches,
    mockLectures,
    mockTopics,
} from '../../api/mockData';

const INITIAL_NOTES = {
    'topic-001': [
        {
            id: 'note-001',
            filename: 'Week1-Intro-Slides.pdf',
            uploadedAt: '12 Jan 2026',
        },
        {
            id: 'note-002',
            filename: 'HTML-Cheatsheet.pdf',
            uploadedAt: '14 Jan 2026',
        },
    ],
    'topic-002': [
        {
            id: 'note-003',
            filename: 'JavaScript-Core-Notes.pdf',
            uploadedAt: '19 Jan 2026',
        },
        {
            id: 'note-004',
            filename: 'Functions-and-Scope.pdf',
            uploadedAt: '20 Jan 2026',
        },
        {
            id: 'note-005',
            filename: 'DOM-Practice.docx',
            uploadedAt: '21 Jan 2026',
        },
    ],
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

export default function AdminLearningFlow() {
    const [selectedBatchId, setSelectedBatchId] = useState(
        mockBatches[0]?.id || ''
    );

    const [topics, setTopics] = useState(mockTopics);

    const [lectures, setLectures] = useState(
        mockLectures.map((lecture) => ({
            ...lecture,
            meetUrl:
                lecture.meetUrl ||
                'https://meet.google.com/example-meet',
            description: lecture.description || '',
        }))
    );

    const [notesByTopic, setNotesByTopic] =
        useState(INITIAL_NOTES);

    const [topicModalOpen, setTopicModalOpen] =
        useState(false);

    const [topicDetailsOpen, setTopicDetailsOpen] =
        useState(false);

    const [lectureModalOpen, setLectureModalOpen] =
        useState(false);

    const [editingTopic, setEditingTopic] =
        useState(null);

    const [selectedTopic, setSelectedTopic] =
        useState(null);

    const [topicToDelete, setTopicToDelete] =
        useState(null);

    const [editingLecture, setEditingLecture] =
        useState(null);

    const [lectureToDelete, setLectureToDelete] =
        useState(null);

    const batchOptions = mockBatches.map((batch) => ({
        value: batch.id,
        label: batch.name,
    }));

    const selectedBatchTopics = useMemo(
        () =>
            topics
                .filter(
                    (topic) => topic.batchId === selectedBatchId
                )
                .sort((a, b) => a.order - b.order),
        [topics, selectedBatchId]
    );

    const selectedBatchLectures = useMemo(
        () =>
            lectures
                .filter(
                    (lecture) =>
                        lecture.batchId === selectedBatchId
                )
                .sort(
                    (first, second) =>
                        new Date(first.date) -
                        new Date(second.date)
                ),
        [lectures, selectedBatchId]
    );

    const selectedTopicNotes = selectedTopic
        ? notesByTopic[selectedTopic.id] || []
        : [];

    const openCreateTopicModal = () => {
        setEditingTopic(null);
        setTopicModalOpen(true);
    };

    const openEditTopicModal = (topic) => {
        setEditingTopic(topic);
        setTopicModalOpen(true);
    };

    const closeTopicModal = () => {
        setEditingTopic(null);
        setTopicModalOpen(false);
    };

    const openTopicDetails = (topic) => {
        setSelectedTopic(topic);
        setTopicDetailsOpen(true);
    };

    const closeTopicDetails = () => {
        setSelectedTopic(null);
        setTopicDetailsOpen(false);
    };

    const openCreateLectureModal = () => {
        setEditingLecture(null);
        setLectureModalOpen(true);
    };

    const openEditLectureModal = (lecture) => {
        setEditingLecture(lecture);
        setLectureModalOpen(true);
    };

    const closeLectureModal = () => {
        setEditingLecture(null);
        setLectureModalOpen(false);
    };

    const handleSaveTopic = async (formData) => {
        if (editingTopic) {
            setTopics((currentTopics) =>
                currentTopics.map((topic) =>
                    topic.id === editingTopic.id
                        ? {
                            ...topic,
                            title: formData.title,
                            description: formData.description,
                        }
                        : topic
                )
            );
        } else {
            const newTopic = {
                id: `topic-${Date.now()}`,
                batchId: selectedBatchId,
                title: formData.title,
                description: formData.description,
                order: selectedBatchTopics.length + 1,
                lectureCount: 0,
                notesCount: 0,
                completed: false,
            };

            setTopics((currentTopics) => [
                ...currentTopics,
                newTopic,
            ]);
        }

        closeTopicModal();
    };

    const handleDeleteTopic = () => {
        if (!topicToDelete) {
            return;
        }

        setTopics((currentTopics) => {
            const remainingTopics = currentTopics.filter(
                (topic) => topic.id !== topicToDelete.id
            );

            const reorderedBatchTopics = remainingTopics
                .filter(
                    (topic) =>
                        topic.batchId === topicToDelete.batchId
                )
                .sort((a, b) => a.order - b.order)
                .map((topic, index) => ({
                    ...topic,
                    order: index + 1,
                }));

            return remainingTopics.map((topic) => {
                const reorderedTopic =
                    reorderedBatchTopics.find(
                        (item) => item.id === topic.id
                    );

                return reorderedTopic || topic;
            });
        });

        setNotesByTopic((currentNotes) => {
            const nextNotes = { ...currentNotes };
            delete nextNotes[topicToDelete.id];
            return nextNotes;
        });

        if (selectedTopic?.id === topicToDelete.id) {
            closeTopicDetails();
        }

        setTopicToDelete(null);
    };

    const handleUploadNote = (file) => {
        if (!selectedTopic || !file) {
            return;
        }

        const newNote = {
            id: `note-${Date.now()}`,
            filename: file.name,
            uploadedAt: new Date().toLocaleDateString(
                'en-GB',
                {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }
            ),
        };

        setNotesByTopic((currentNotes) => ({
            ...currentNotes,
            [selectedTopic.id]: [
                ...(currentNotes[selectedTopic.id] || []),
                newNote,
            ],
        }));

        setTopics((currentTopics) =>
            currentTopics.map((topic) =>
                topic.id === selectedTopic.id
                    ? {
                        ...topic,
                        notesCount:
                            (topic.notesCount || 0) + 1,
                    }
                    : topic
            )
        );
    };

    const handleDeleteNote = (noteId) => {
        if (!selectedTopic) {
            return;
        }

        setNotesByTopic((currentNotes) => ({
            ...currentNotes,
            [selectedTopic.id]: (
                currentNotes[selectedTopic.id] || []
            ).filter((note) => note.id !== noteId),
        }));

        setTopics((currentTopics) =>
            currentTopics.map((topic) =>
                topic.id === selectedTopic.id
                    ? {
                        ...topic,
                        notesCount: Math.max(
                            (topic.notesCount || 0) - 1,
                            0
                        ),
                    }
                    : topic
            )
        );
    };

    const handleSaveLecture = async (formData) => {
        const normalizedDate = new Date(
            formData.date
        ).toISOString();

        if (editingLecture) {
            setLectures((currentLectures) =>
                currentLectures.map((lecture) =>
                    lecture.id === editingLecture.id
                        ? {
                            ...lecture,
                            ...formData,
                            date: normalizedDate,
                        }
                        : lecture
                )
            );
        } else {
            const newLecture = {
                id: `lecture-${Date.now()}`,
                batchId: selectedBatchId,
                topicId: formData.topicId,
                title: formData.title,
                date: normalizedDate,
                meetUrl: formData.meetUrl,
                description: formData.description,
                status: 'scheduled',
                attendanceCount: null,
                avgQuizScore: null,
                avgAssignmentScore: null,
            };

            setLectures((currentLectures) => [
                ...currentLectures,
                newLecture,
            ]);

            setTopics((currentTopics) =>
                currentTopics.map((topic) =>
                    topic.id === formData.topicId
                        ? {
                            ...topic,
                            lectureCount:
                                (topic.lectureCount || 0) + 1,
                        }
                        : topic
                )
            );
        }

        closeLectureModal();
    };

    const handleLectureStatusChange = (
        lectureId,
        status
    ) => {
        setLectures((currentLectures) =>
            currentLectures.map((lecture) =>
                lecture.id === lectureId
                    ? {
                        ...lecture,
                        status,
                    }
                    : lecture
            )
        );
    };

    const handleDeleteLecture = () => {
        if (!lectureToDelete) {
            return;
        }

        setLectures((currentLectures) =>
            currentLectures.filter(
                (lecture) =>
                    lecture.id !== lectureToDelete.id
            )
        );

        setTopics((currentTopics) =>
            currentTopics.map((topic) =>
                topic.id === lectureToDelete.topicId
                    ? {
                        ...topic,
                        lectureCount: Math.max(
                            (topic.lectureCount || 0) - 1,
                            0
                        ),
                    }
                    : topic
            )
        );

        setLectureToDelete(null);
    };

    const tabs = [
        {
            label: 'Curriculum & Topics',
            content: (
                <AdminTopicList
                    topics={selectedBatchTopics}
                    onAdd={openCreateTopicModal}
                    onSelect={openTopicDetails}
                    onEdit={openEditTopicModal}
                    onDelete={setTopicToDelete}
                />
            ),
        },
        {
            label: 'Lectures',
            content: (
                <AdminLectureList
                    lectures={selectedBatchLectures}
                    topics={selectedBatchTopics}
                    onAdd={openCreateLectureModal}
                    onEdit={openEditLectureModal}
                    onDelete={setLectureToDelete}
                    onStatusChange={
                        handleLectureStatusChange
                    }
                />
            ),
        },
        {
            label: 'Assignments',
            content: (
                <AdminAssignmentsPanel
                    batchId={selectedBatchId}
                    topics={selectedBatchTopics}
                    lectures={selectedBatchLectures}
                />
            ),
        },
        {
            label: 'Attendance',
            content: (
                <AdminAttendancePanel
                    batchId={selectedBatchId}
                    lectures={selectedBatchLectures}
                />
            ),
        },
        {
            label: 'Quizzes',
            content: (
                <AdminQuizPanel
                    batchId={selectedBatchId}
                    topics={selectedBatchTopics}
                    lectures={selectedBatchLectures}
                />
            ),
        },
        {
            label: 'Code Reviews',
            content: (
                <AdminCodeReviewPanel
                    batchId={selectedBatchId}
                />
            ),
        },
        {
            label: 'Scoring Engine',
            content: (
                <AdminScoringPanel
                    batchId={selectedBatchId}
                />
            ),
        },
        {
            label: 'Analytics',
            content: (
                <AdminAnalyticsPanel
                    topics={selectedBatchTopics}
                    lectures={selectedBatchLectures}
                />
            ),
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
                        Learning Management
                    </h1>

                    <p
                        style={{
                            marginTop: 'var(--space-xs)',
                            color:
                                'var(--color-text-secondary)',
                        }}
                    >
                        Manage curriculum, lectures,
                        assignments, attendance, quizzes,
                        code reviews, scoring, and analytics.
                    </p>
                </div>

                <div style={{ maxWidth: '360px' }}>
                    <Select
                        label="Select Batch"
                        name="batchId"
                        value={selectedBatchId}
                        options={batchOptions}
                        onChange={(event) => {
                            setSelectedBatchId(
                                event.target.value
                            );

                            closeTopicDetails();
                        }}
                    />
                </div>

                {selectedBatchId ? (
                    <Tabs tabs={tabs} />
                ) : (
                    <p>No batch is available.</p>
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
                <AdminTopicForm
                    defaultValues={
                        editingTopic
                            ? {
                                title: editingTopic.title,
                                description:
                                    editingTopic.description || '',
                            }
                            : null
                    }
                    onSubmit={handleSaveTopic}
                    onCancel={closeTopicModal}
                />
            </Modal>

            <Modal
                isOpen={topicDetailsOpen}
                onClose={closeTopicDetails}
                title="Topic Details"
                size="lg"
            >
                <AdminTopicDetails
                    topic={selectedTopic}
                    notes={selectedTopicNotes}
                    onUploadNote={handleUploadNote}
                    onDeleteNote={handleDeleteNote}
                />
            </Modal>

            <Modal
                isOpen={lectureModalOpen}
                onClose={closeLectureModal}
                title={
                    editingLecture
                        ? 'Edit Lecture'
                        : 'Schedule Lecture'
                }
                size="md"
            >
                <AdminLectureForm
                    topics={selectedBatchTopics}
                    defaultValues={
                        editingLecture
                            ? {
                                title: editingLecture.title,
                                topicId:
                                    editingLecture.topicId,
                                date: toDateTimeLocal(
                                    editingLecture.date
                                ),
                                meetUrl:
                                    editingLecture.meetUrl || '',
                                description:
                                    editingLecture.description ||
                                    '',
                            }
                            : null
                    }
                    onSubmit={handleSaveLecture}
                    onCancel={closeLectureModal}
                />
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(topicToDelete)}
                title="Delete Topic"
                message={
                    topicToDelete
                        ? `Delete "${topicToDelete.title}"? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteTopic}
                onCancel={() =>
                    setTopicToDelete(null)
                }
            />

            <ConfirmDialog
                isOpen={Boolean(lectureToDelete)}
                title="Delete Lecture"
                message={
                    lectureToDelete
                        ? `Delete "${lectureToDelete.title}"? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDeleteLecture}
                onCancel={() =>
                    setLectureToDelete(null)
                }
            />
        </>
    );
}