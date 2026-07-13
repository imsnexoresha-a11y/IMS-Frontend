import { Users, BarChart3, ClipboardList } from 'lucide-react';
import StatCard from '../common/StatCard';
import { useLectureSummary } from '../../hooks/useLectures';

export default function PerLectureSummaryCard({ batchId, lecture }) {
  const lectureId = lecture?.id || lecture?._id;
  const { data: summaryData, isLoading, isError } = useLectureSummary(batchId, lectureId);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>Loading session summary...</div>;
  }

  if (isError || !summaryData) {
    return <div style={{ textAlign: 'center', color: 'var(--color-danger)', padding: 'var(--space-md)' }}>Error loading summary data.</div>;
  }

  const session = summaryData.session || lecture || {};
  const attendance = summaryData.attendance || {};
  const presentCount = attendance.present ?? 0;
  const totalCount = attendance.total ?? 0;
  const avgQuiz = summaryData.avgQuizScore ?? 0;
  const avgAssign = summaryData.avgAssignmentScore ?? 0;

  return (
    <div>
      <h4 style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-md)' }}>{session.title}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
        <StatCard label="Attendance Rate" value={totalCount > 0 ? `${((presentCount / totalCount) * 100).toFixed(0)}%` : '0%'} icon={Users} />
        <StatCard label="Avg Quiz" value={avgQuiz ? `${Number(avgQuiz).toFixed(1)} / 5` : '—'} icon={BarChart3} accent />
        <StatCard label="Avg Assignment" value={avgAssign ? `${Number(avgAssign).toFixed(1)} / 10` : '—'} icon={ClipboardList} />
      </div>
      <div style={{ padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'var(--color-neutral-bg)', fontSize: 'var(--text-xs)', border: '2px solid var(--color-neutral)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Present: <strong style={{ color: 'var(--color-success)' }}>{presentCount}</strong></span>
          <span>Half Attendance: <strong style={{ color: 'var(--color-warning)' }}>{attendance.half ?? 0}</strong></span>
          <span>Absent: <strong style={{ color: 'var(--color-danger)' }}>{attendance.absent ?? 0}</strong></span>
        </div>
      </div>
    </div>
  );
}
