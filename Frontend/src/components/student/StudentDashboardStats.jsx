import { Award, Target, CalendarDays, Activity } from 'lucide-react';
import StatCard from '../common/StatCard';
import { formatPercent } from '../../utils/formatters';

export default function StudentDashboardStats({ stats }) {
  const data = {
    attendancePercent: stats?.attendancePercent ?? 0,
    overallScore: stats?.overallScore ?? 0,
    rank: stats?.rank ?? 0,
    totalStudents: stats?.totalStudents ?? 0,
    nextLecture: stats?.nextLecture ?? 'None scheduled',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)' }}>
      <StatCard
        label="Overall Score"
        value={data.overallScore.toFixed(1)}
        icon={Target}
        trend={2.5}
        trendLabel="vs last week"
        accent
        className="student-block-hover"
      />
      <StatCard
        label="Batch Rank"
        value={`${data.rank} / ${data.totalStudents}`}
        icon={Award}
        className="student-block-hover"
      />
      <StatCard
        label="Attendance"
        value={formatPercent(data.attendancePercent, 0)}
        icon={Activity}
        trend={data.attendancePercent >= 80 ? 1 : -1}
        trendLabel={data.attendancePercent >= 80 ? 'Good' : 'Needs attention'}
        className="student-block-hover"
      />
      <StatCard
        label="Up Next"
        value={data.nextLecture}
        icon={CalendarDays}
        className="student-block-hover"
      />
    </div>
  );
}
