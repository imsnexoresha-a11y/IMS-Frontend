import { useMemo, useState } from 'react';
import {
    Award,
    Calculator,
    ChevronRight,
    RotateCcw,
    Search,
} from 'lucide-react';

import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Card from '../../common/Card';
import DataTable from '../../common/DataTable';
import Input from '../../common/Input';
import Modal from '../../common/Modal';
import StatCard from '../../common/StatCard';
import Timeline from '../../common/Timeline';



const BASE_SCORE = 100;

const INITIAL_SCORE_BREAKDOWN = {
    'student-001': {
        attendance: -5,
        quiz: 18,
        assignment: 34,
        codeReview: 21,
        bonus: 2,
    },
    'student-002': {
        attendance: 0,
        quiz: 22,
        assignment: 30,
        codeReview: 18,
        bonus: 0,
    },
    'student-003': {
        attendance: -2,
        quiz: 16,
        assignment: 28,
        codeReview: 20,
        bonus: 3,
    },
    'student-004': {
        attendance: -8,
        quiz: 13,
        assignment: 24,
        codeReview: 16,
        bonus: 0,
    },
    'student-007': {
        attendance: -10,
        quiz: 12,
        assignment: 22,
        codeReview: 14,
        bonus: 0,
    },
    'student-008': {
        attendance: -5,
        quiz: 11,
        assignment: 21,
        codeReview: 15,
        bonus: 0,
    },
};

function getBreakdown(studentId) {
    return (
        INITIAL_SCORE_BREAKDOWN[studentId] || {
            attendance: 0,
            quiz: 0,
            assignment: 0,
            codeReview: 0,
            bonus: 0,
        }
    );
}

function calculateTotal(breakdown) {
    return (
        BASE_SCORE +
        breakdown.attendance +
        breakdown.quiz +
        breakdown.assignment +
        breakdown.codeReview +
        breakdown.bonus
    );
}

function getPerformanceStatus(total) {
    if (total >= 150) {
        return {
            label: 'Excellent',
            variant: 'success',
        };
    }

    if (total >= 125) {
        return {
            label: 'Good',
            variant: 'info',
        };
    }

    if (total >= 100) {
        return {
            label: 'Average',
            variant: 'warning',
        };
    }

    return {
        label: 'At Risk',
        variant: 'error',
    };
}

function ScoreValue({ value }) {
    const prefix = value > 0 ? '+' : '';

    return (
        <strong
            style={{
                color:
                    value < 0
                        ? 'var(--color-danger)'
                        : value > 0
                            ? 'var(--color-success)'
                            : 'var(--color-text-secondary)',
            }}
        >
            {prefix}
            {value}
        </strong>
    );
}

function StudentScoreDetails({ student, breakdown }) {
    const total = calculateTotal(breakdown);
    const performance = getPerformanceStatus(total);

    const timelineItems = [
        {
            title: 'Base score assigned',
            description: 'Every intern begins with 100 points.',
            date: 'Initial',
            value: '+100',
        },
        {
            title: 'Attendance adjustments',
            description:
                breakdown.attendance < 0
                    ? 'Points deducted for missed or partial lectures.'
                    : 'No attendance deductions.',
            date: 'Attendance',
            value: `${breakdown.attendance > 0 ? '+' : ''}${breakdown.attendance}`,
        },
        {
            title: 'Quiz performance',
            description: 'Points earned from quiz results.',
            date: 'Quiz',
            value: `+${breakdown.quiz}`,
        },
        {
            title: 'Assignment performance',
            description: 'Points earned from completed assignments.',
            date: 'Assignment',
            value: `+${breakdown.assignment}`,
        },
        {
            title: 'Automated code review',
            description:
                'Points generated from GitHub repository analysis.',
            date: 'Code Review',
            value: `+${breakdown.codeReview}`,
        },
        {
            title: 'Bonus adjustments',
            description: 'Manual rewards or additional achievements.',
            date: 'Bonus',
            value: `+${breakdown.bonus}`,
        },
    ];

    return (
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
                    {student.name}
                </h3>

                <p
                    style={{
                        marginTop: '4px',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    {student.email} · {student.batchName}
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(3, minmax(0, 1fr))',
                    gap: 'var(--space-md)',
                }}
            >
                <StatCard
                    title="Base Score"
                    value={BASE_SCORE}
                    icon={Award}
                />

                <StatCard
                    title="Current Score"
                    value={total}
                    icon={Calculator}
                />

                <Card>
                    <div
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Performance
                    </div>

                    <div
                        style={{
                            marginTop: 'var(--space-sm)',
                        }}
                    >
                        <Badge
                            variant={performance.variant}
                            dot
                        >
                            {performance.label}
                        </Badge>
                    </div>
                </Card>
            </div>

            <Card>
                <h4
                    style={{
                        marginBottom: 'var(--space-md)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Score Breakdown
                </h4>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(5, minmax(0, 1fr))',
                        gap: 'var(--space-md)',
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Attendance
                        </div>
                        <ScoreValue
                            value={breakdown.attendance}
                        />
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Quizzes
                        </div>
                        <ScoreValue value={breakdown.quiz} />
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Assignments
                        </div>
                        <ScoreValue
                            value={breakdown.assignment}
                        />
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Code Review
                        </div>
                        <ScoreValue
                            value={breakdown.codeReview}
                        />
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: 'var(--text-xs)',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Bonus
                        </div>
                        <ScoreValue value={breakdown.bonus} />
                    </div>
                </div>
            </Card>

            <Card>
                <h4
                    style={{
                        marginBottom: 'var(--space-md)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Score Timeline
                </h4>

                <Timeline items={timelineItems} />
            </Card>

            {false && (
                    <Card>
                        <h4
                            style={{
                                marginBottom: 'var(--space-md)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Recent Ledger Events
                        </h4>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-xs)',
                            }}
                        >
                            {[]
                                .slice()
                                .reverse()
                                .slice(0, 5)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 'var(--space-md)',
                                            padding: 'var(--space-sm)',
                                            border:
                                                '2px solid var(--border-color)',
                                        }}
                                    >
                                        <div>
                                            <strong>
                                                {event.description}
                                            </strong>

                                            <div
                                                style={{
                                                    marginTop: '2px',
                                                    fontSize:
                                                        'var(--text-xs)',
                                                    color:
                                                        'var(--color-text-secondary)',
                                                }}
                                            >
                                                {event.date} · {event.source}
                                            </div>
                                        </div>

                                        <ScoreValue value={event.value} />
                                    </div>
                                ))}
                        </div>
                    </Card>
                )}
        </div>
    );
}

export default function AdminScoringPanel({
    batchId,
}) {
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] =
        useState(null);
    const [recalculatedAt, setRecalculatedAt] =
        useState(null);

    const students = useMemo(() => {
        return []
            .filter(
                (student) =>
                    !batchId ||
                    student.batchId === batchId ||
                    student.batchName
            )
            .map((student) => {
                const breakdown = getBreakdown(student.id);
                const total = calculateTotal(breakdown);
                const performance =
                    getPerformanceStatus(total);

                return {
                    ...student,
                    baseScore: BASE_SCORE,
                    attendancePoints:
                        breakdown.attendance,
                    quizPoints: breakdown.quiz,
                    assignmentPoints:
                        breakdown.assignment,
                    codeReviewPoints:
                        breakdown.codeReview,
                    bonusPoints: breakdown.bonus,
                    calculatedTotal: total,
                    performanceLabel:
                        performance.label,
                    performanceVariant:
                        performance.variant,
                };
            })
            .filter((student) => {
                const query = search
                    .trim()
                    .toLowerCase();

                if (!query) {
                    return true;
                }

                return (
                    student.name
                        ?.toLowerCase()
                        .includes(query) ||
                    student.email
                        ?.toLowerCase()
                        .includes(query) ||
                    student.batchName
                        ?.toLowerCase()
                        .includes(query)
                );
            })
            .sort(
                (first, second) =>
                    second.calculatedTotal -
                    first.calculatedTotal
            )
            .map((student, index) => ({
                ...student,
                calculatedRank: index + 1,
            }));
    }, [batchId, search]);

    const averageScore = students.length
        ? (
            students.reduce(
                (total, student) =>
                    total + student.calculatedTotal,
                0
            ) / students.length
        ).toFixed(1)
        : 0;

    const topScore =
        students[0]?.calculatedTotal || 0;

    const atRiskCount = students.filter(
        (student) =>
            student.calculatedTotal < BASE_SCORE
    ).length;

    const handleRecalculate = () => {
        setRecalculatedAt(
            new Date().toLocaleTimeString()
        );
    };

    const columns = [
        {
            key: 'calculatedRank',
            label: '#',
            render: (value) => (
                <strong>{value}</strong>
            ),
        },
        {
            key: 'name',
            label: 'Student',
            render: (value, row) => (
                <div>
                    <strong>{value}</strong>

                    <div
                        style={{
                            marginTop: '2px',
                            fontSize: 'var(--text-xs)',
                            color:
                                'var(--color-text-secondary)',
                        }}
                    >
                        {row.email}
                    </div>
                </div>
            ),
        },
        {
            key: 'baseScore',
            label: 'Base',
            render: (value) => (
                <strong>{value}</strong>
            ),
        },
        {
            key: 'attendancePoints',
            label: 'Attendance',
            render: (value) => (
                <ScoreValue value={value} />
            ),
        },
        {
            key: 'quizPoints',
            label: 'Quiz',
            render: (value) => (
                <ScoreValue value={value} />
            ),
        },
        {
            key: 'assignmentPoints',
            label: 'Assignment',
            render: (value) => (
                <ScoreValue value={value} />
            ),
        },
        {
            key: 'codeReviewPoints',
            label: 'Code Review',
            render: (value) => (
                <ScoreValue value={value} />
            ),
        },
        {
            key: 'calculatedTotal',
            label: 'Total',
            render: (value) => (
                <strong
                    style={{
                        fontSize: 'var(--text-md)',
                        color: 'var(--color-accent)',
                    }}
                >
                    {value}
                </strong>
            ),
        },
        {
            key: 'performanceLabel',
            label: 'Status',
            render: (value, row) => (
                <Badge
                    variant={row.performanceVariant}
                    dot
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                        setSelectedStudent(row)
                    }
                >
                    View
                    <ChevronRight size={14} />
                </Button>
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
                        alignItems: 'flex-start',
                        gap: 'var(--space-md)',
                    }}
                >
                    <div>
                        <h3
                            style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 'var(--font-bold)',
                            }}
                        >
                            Scoring Engine
                        </h3>

                        <p
                            style={{
                                marginTop: '4px',
                                color:
                                    'var(--color-text-secondary)',
                            }}
                        >
                            Every intern begins with 100 points.
                            Attendance, quizzes, assignments, and
                            code reviews adjust the total.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleRecalculate}
                    >
                        <RotateCcw size={15} />
                        Recalculate Batch
                    </Button>
                </div>

                {recalculatedAt && (
                    <Badge variant="success">
                        Scores recalculated at{' '}
                        {recalculatedAt}
                    </Badge>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(3, minmax(0, 1fr))',
                        gap: 'var(--space-md)',
                    }}
                >
                    <StatCard
                        title="Average Score"
                        value={averageScore}
                        icon={Calculator}
                    />

                    <StatCard
                        title="Highest Score"
                        value={topScore}
                        icon={Award}
                    />

                    <StatCard
                        title="Students At Risk"
                        value={atRiskCount}
                        icon={Search}
                    />
                </div>

                <div style={{ maxWidth: '420px' }}>
                    <Input
                        label="Search Students"
                        name="studentSearch"
                        placeholder="Search by name, email, or batch"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={students}
                    searchable={false}
                    pageSize={10}
                />
            </div>

            <Modal
                isOpen={Boolean(selectedStudent)}
                onClose={() =>
                    setSelectedStudent(null)
                }
                title="Student Score Details"
                size="lg"
            >
                {selectedStudent && (
                    <StudentScoreDetails
                        student={selectedStudent}
                        breakdown={getBreakdown(
                            selectedStudent.id
                        )}
                    />
                )}
            </Modal>
        </>
    );
}