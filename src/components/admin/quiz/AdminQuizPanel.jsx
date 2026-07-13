import { useMemo, useState } from 'react';
import {
    CheckCircle,
    ClipboardCheck,
    Download,
    ExternalLink,
    Plus,
    Trash2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

import Badge from '../../common/Badge';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import FileUpload from '../../common/FileUpload';
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import Select from '../../common/Select';
import Textarea from '../../common/Textarea';
import ConfirmDialog from '../../common/ConfirmDialog';

import { CSV_ACCEPT } from '../../../utils/constants';
import { downloadCSVTemplate } from '../../../utils/downloadTemplate';
import { mockQuizResults } from '../../../api/mockData';

const QUIZ_RESULTS_TEMPLATE_HEADERS = [
    'studentId',
    'quizId',
    'score',
    'maxScore',
];

const QUIZ_RESULTS_TEMPLATE_ROWS = [
    {
        studentId: 'student-001',
        quizId: 'quiz-001',
        score: 85,
        maxScore: 100,
    },
    {
        studentId: 'student-002',
        quizId: 'quiz-001',
        score: 92,
        maxScore: 100,
    },
];

function AdminQuizForm({
    topics,
    lectures,
    onSubmit,
    onCancel,
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            topicId: '',
            lectureId: '',
            source: 'google_forms',
            externalUrl: '',
            maxScore: 100,
            description: '',
        },
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
            }}
        >
            <Input
                label="Quiz Title"
                name="title"
                required
                error={errors.title?.message}
                {...register('title', {
                    required: 'Quiz title is required',
                })}
            />

            <Select
                label="Topic"
                name="topicId"
                options={[
                    {
                        value: '',
                        label: 'Select topic',
                    },
                    ...topics.map((topic) => ({
                        value: topic.id,
                        label: topic.title,
                    })),
                ]}
                error={errors.topicId?.message}
                {...register('topicId', {
                    required: 'Topic is required',
                })}
            />

            <Select
                label="Lecture"
                name="lectureId"
                options={[
                    {
                        value: '',
                        label: 'No lecture selected',
                    },
                    ...lectures.map((lecture) => ({
                        value: lecture.id,
                        label: lecture.title,
                    })),
                ]}
                {...register('lectureId')}
            />

            <Select
                label="Quiz Platform"
                name="source"
                options={[
                    {
                        value: 'google_forms',
                        label: 'Google Forms',
                    },
                    {
                        value: 'kahoot',
                        label: 'Kahoot',
                    },
                    {
                        value: 'internal',
                        label: 'Internal Quiz',
                    },
                ]}
                {...register('source')}
            />

            <Input
                label="Quiz URL"
                name="externalUrl"
                type="url"
                placeholder="https://forms.google.com/..."
                {...register('externalUrl')}
            />

            <Input
                label="Maximum Score"
                name="maxScore"
                type="number"
                min="1"
                required
                error={errors.maxScore?.message}
                {...register('maxScore', {
                    required: 'Maximum score is required',
                    min: {
                        value: 1,
                        message: 'Score must be at least 1',
                    },
                })}
            />

            <Textarea
                label="Description"
                name="description"
                rows={4}
                {...register('description')}
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
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                >
                    Create Quiz
                </Button>
            </div>
        </form>
    );
}

export default function AdminQuizPanel({
    batchId,
    topics = [],
    lectures = [],
}) {
    const [quizzes, setQuizzes] = useState([
        {
            id: 'quiz-001',
            batchId: 'batch-001',
            topicId: 'topic-001',
            lectureId: 'lec-001',
            title: 'HTML Basics',
            source: 'google_forms',
            externalUrl: 'https://forms.google.com',
            maxScore: 100,
            status: 'published',
            resultCount: mockQuizResults.length,
        },
    ]);

    const [createOpen, setCreateOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState(null);
    const [resultsQuiz, setResultsQuiz] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [templateMessage, setTemplateMessage] = useState('');

    const visibleQuizzes = useMemo(
        () =>
            quizzes.filter(
                (quiz) => !batchId || quiz.batchId === batchId
            ),
        [quizzes, batchId]
    );

    const topicMap = Object.fromEntries(
        topics.map((topic) => [topic.id, topic.title])
    );

    const handleCreateQuiz = (data) => {
        setQuizzes((currentQuizzes) => [
            ...currentQuizzes,
            {
                id: `quiz-${Date.now()}`,
                batchId,
                ...data,
                maxScore: Number(data.maxScore),
                status: 'published',
                resultCount: 0,
            },
        ]);

        setCreateOpen(false);
    };

    const handleDelete = () => {
        if (!quizToDelete) {
            return;
        }

        setQuizzes((currentQuizzes) =>
            currentQuizzes.filter(
                (quiz) => quiz.id !== quizToDelete.id
            )
        );

        setQuizToDelete(null);
    };

    const handleDownloadTemplate = () => {
        downloadCSVTemplate({
            filename: 'template_quiz_results.csv',
            headers: QUIZ_RESULTS_TEMPLATE_HEADERS,
            exampleRows: QUIZ_RESULTS_TEMPLATE_ROWS,
        });

        setTemplateMessage(
            'Quiz results template downloaded successfully.'
        );
    };

    const handleResultsModalClose = () => {
        setResultsQuiz(null);
        setUploadMessage('');
        setTemplateMessage('');
    };

    const columns = [
        {
            key: 'title',
            label: 'Quiz',
            render: (value, row) => (
                <div>
                    <strong>{value}</strong>

                    <div
                        style={{
                            marginTop: '2px',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-xs)',
                        }}
                    >
                        {topicMap[row.topicId] || 'Topic unavailable'}
                    </div>
                </div>
            ),
        },
        {
            key: 'source',
            label: 'Platform',
            render: (value) => (
                <Badge variant="info">
                    {value.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            key: 'externalUrl',
            label: 'Link',
            render: (value) =>
                value ? (
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
                        Open
                        <ExternalLink size={13} />
                    </a>
                ) : (
                    '—'
                ),
        },
        {
            key: 'maxScore',
            label: 'Max Score',
        },
        {
            key: 'resultCount',
            label: 'Results',
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Badge
                    variant="success"
                    dot
                >
                    {value}
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
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setResultsQuiz(row)}
                    >
                        Results
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => setQuizToDelete(row)}
                    >
                        <Trash2 size={14} />
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
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
                            <ClipboardCheck size={20} />
                            Quiz Management
                        </h3>

                        <p
                            style={{
                                marginTop: '4px',
                                color: 'var(--color-text-secondary)',
                            }}
                        >
                            Connect Google Forms, Kahoot, or internal quizzes.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                    >
                        <Plus size={15} />
                        Create Quiz
                    </Button>
                </div>

                <DataTable
                    columns={columns}
                    data={visibleQuizzes}
                    searchPlaceholder="Search quizzes..."
                />
            </div>

            <Modal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                title="Create Quiz"
                size="lg"
            >
                <AdminQuizForm
                    topics={topics}
                    lectures={lectures}
                    onSubmit={handleCreateQuiz}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={Boolean(resultsQuiz)}
                onClose={handleResultsModalClose}
                title="Quiz Results"
                size="lg"
            >
                {resultsQuiz && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-lg)',
                        }}
                    >
                        <div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleDownloadTemplate}
                            >
                                <Download size={16} />
                                Download Quiz Results Template
                            </Button>
                        </div>

                        {templateMessage && (
                            <Badge variant="success">
                                <CheckCircle size={14} />
                                {templateMessage}
                            </Badge>
                        )}

                        <div
                            style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                border: '2px solid var(--border-color)',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--text-xs)',
                                lineHeight: 1.6,
                            }}
                        >
                            Required columns:
                            <br />
                            <strong>
                                studentId, quizId, score, maxScore
                            </strong>
                        </div>

                        <FileUpload
                            label="Upload Quiz Results CSV"
                            accept={CSV_ACCEPT}
                            onFileSelect={(file) => {
                                if (file) {
                                    setUploadMessage(
                                        `${file.name} selected for ${resultsQuiz.title}.`
                                    );
                                } else {
                                    setUploadMessage('');
                                }
                            }}
                        />

                        {uploadMessage && (
                            <Badge variant="info">
                                {uploadMessage}
                            </Badge>
                        )}

                        <DataTable
                            columns={[
                                {
                                    key: 'studentName',
                                    label: 'Student',
                                },
                                {
                                    key: 'score',
                                    label: 'Score',
                                    render: (value, row) => (
                                        <strong>
                                            {value}/{row.maxScore}
                                        </strong>
                                    ),
                                },
                            ]}
                            data={mockQuizResults}
                            searchable={false}
                        />
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                isOpen={Boolean(quizToDelete)}
                title="Delete Quiz"
                message={
                    quizToDelete
                        ? `Delete "${quizToDelete.title}"?`
                        : ''
                }
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setQuizToDelete(null)}
            />
        </>
    );
}