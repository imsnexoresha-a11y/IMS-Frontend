import {
  GraduationCap,
  Layers,
  Users,
} from 'lucide-react';

import StatCard from '../common/StatCard';

export default function DashboardStatsGrid({
  stats = {},
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-lg)',
      }}
    >
      <StatCard
        label="Total Batches"
        value={stats.totalBatches ?? 0}
        icon={Layers}
      />

      <StatCard
        label="Total Students"
        value={stats.totalStudents ?? 0}
        icon={Users}
        accent
      />

      <StatCard
        label="Total Teachers"
        value={stats.totalTeachers ?? 0}
        icon={GraduationCap}
      />
    </div>
  );
}