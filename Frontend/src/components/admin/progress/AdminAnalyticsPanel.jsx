import {
    BarChart,
    Bar,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import Card from '../../common/Card';
import StatCard from '../../common/StatCard';
import {
    BarChart3,
    ClipboardCheck,
    GraduationCap,
    Users,
} from 'lucide-react';


const TREND_DATA = [
    {
        week: 'Week 1',
        attendance: 88,
        quiz: 72,
        assignment: 68,
    },
    {
        week: 'Week 2',
        attendance: 91,
        quiz: 76,
        assignment: 74,
    },
    {
        week: 'Week 3',
        attendance: 89,
        quiz: 81,
        assignment: 79,
    },
    {
        week: 'Week 4',
        attendance: 94,
        quiz: 84,
        assignment: 83,
    },
];

const SCORE_DISTRIBUTION = [
    { range: 'Below 80', students: 1 },
    { range: '80–99', students: 2 },
    { range: '100–119', students: 2 },
    { range: '120–139', students: 2 },
    { range: '140+', students: 1 },
];

export default function AdminAnalyticsPanel({
    topics = [],
    lectures = [],
    students = [],
}) {
    const totalStudents = students.length;
    const completedTopics = topics.filter(
        (topic) => topic.completed
    ).length;
    const completedLectures = lectures.filter(
        (lecture) => lecture.status === 'completed'
    ).length;

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
                    View learning progress, attendance, quizzes, assignments, and score
                    distribution.
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(4, minmax(0, 1fr))',
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
                    value="124.8"
                    icon={BarChart3}
                />
            </div>

            <Card>
                <h4
                    style={{
                        marginBottom: 'var(--space-md)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Weekly Performance Trend
                </h4>

                <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                        <LineChart data={TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="attendance"
                                stroke="currentColor"
                            />
                            <Line
                                type="monotone"
                                dataKey="quiz"
                                stroke="currentColor"
                            />
                            <Line
                                type="monotone"
                                dataKey="assignment"
                                stroke="currentColor"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <h4
                    style={{
                        marginBottom: 'var(--space-md)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    Score Distribution
                </h4>

                <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                        <BarChart data={SCORE_DISTRIBUTION}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="range" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="students" fill="currentColor" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}