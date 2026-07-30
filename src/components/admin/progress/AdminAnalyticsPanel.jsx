import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    BarChart3,
    ClipboardCheck,
    GraduationCap,
    Users,
} from 'lucide-react';

import Card from '../../common/Card';
import StatCard from '../../common/StatCard';
import { useBatchMetrics } from '../../../hooks/useMetrics';

const EMPTY_DISTRIBUTION = [
    {
        range: 'Below 80',
        students: 0,
    },
    {
        range: '80–99',
        students: 0,
    },
    {
        range: '100–119',
        students: 0,
    },
    {
        range: '120–139',
        students: 0,
    },
    {
        range: '140+',
        students: 0,
    },
];

function formatMetric(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return '0';
    }

    return number.toFixed(2);
}

export default function AdminAnalyticsPanel({
    batchId,
    topics = [],
    lectures = [],
}) {
    const {
        data: metrics,
        isLoading,
        isError,
    } = useBatchMetrics(batchId);

    const completedTopics = topics.filter(
        (topic) =>
            topic.completed ||
            topic.status === 'completed'
    ).length;

    const completedLectures = lectures.filter(
        (lecture) =>
            lecture.status === 'completed'
    ).length;

    const totalStudents =
        Number(metrics?.studentCount) || 0;

    const averageScore = formatMetric(
        metrics?.avgOverallScore
    );

    const scoreDistribution =
        Array.isArray(metrics?.scoreDistribution) &&
            metrics.scoreDistribution.length > 0
            ? metrics.scoreDistribution
            : EMPTY_DISTRIBUTION;

    if (!batchId) {
        return (
            <Card>
                <p
                    style={{
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    Select a batch to view analytics.
                </p>
            </Card>
        );
    }

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
                    Batch Analytics
                </h3>

                <p
                    style={{
                        marginTop: '4px',
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    View real learning progress,
                    attendance, quizzes, assignments,
                    and score distribution.
                </p>
            </div>

            {isLoading && (
                <Card>
                    <p>Loading batch analytics...</p>
                </Card>
            )}

            {isError && (
                <Card>
                    <p
                        style={{
                            color: 'var(--color-danger)',
                        }}
                    >
                        Could not load batch analytics.
                    </p>
                </Card>
            )}

            {!isLoading && !isError && (
                <>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: 'var(--space-md)',
                        }}
                    >
                        <StatCard
                            title="Students"
                            value={totalStudents}
                            icon={Users}
                        />

                        <StatCard
                            title="Topics Completed"
                            value={`${completedTopics}/${topics.length}`}
                            icon={GraduationCap}
                        />

                        <StatCard
                            title="Lectures Completed"
                            value={`${completedLectures}/${lectures.length}`}
                            icon={ClipboardCheck}
                        />

                        <StatCard
                            title="Average Score"
                            value={averageScore}
                            icon={BarChart3}
                        />
                    </div>

                    <Card>
                        <h4
                            style={{
                                marginBottom:
                                    'var(--space-md)',
                                fontWeight:
                                    'var(--font-bold)',
                            }}
                        >
                            Performance Summary
                        </h4>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: 'var(--space-md)',
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        color:
                                            'var(--color-text-secondary)',
                                    }}
                                >
                                    Average Attendance
                                </p>

                                <strong>
                                    {formatMetric(
                                        metrics?.avgAttendance
                                    )}
                                    %
                                </strong>
                            </div>

                            <div>
                                <p
                                    style={{
                                        color:
                                            'var(--color-text-secondary)',
                                    }}
                                >
                                    Average Quiz Score
                                </p>

                                <strong>
                                    {formatMetric(
                                        metrics?.avgQuizScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <p
                                    style={{
                                        color:
                                            'var(--color-text-secondary)',
                                    }}
                                >
                                    Average Assignment Score
                                </p>

                                <strong>
                                    {formatMetric(
                                        metrics?.avgAssignmentScore
                                    )}
                                </strong>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h4
                            style={{
                                marginBottom:
                                    'var(--space-md)',
                                fontWeight:
                                    'var(--font-bold)',
                            }}
                        >
                            Score Distribution
                        </h4>

                        <div
                            style={{
                                width: '100%',
                                height: 320,
                            }}
                        >
                            <ResponsiveContainer>
                                <BarChart
                                    data={scoreDistribution}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis dataKey="range" />

                                    <YAxis
                                        allowDecimals={false}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="students"
                                        fill="currentColor"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}