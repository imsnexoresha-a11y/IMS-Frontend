import DashboardStatsGrid from '../../components/admin/DashboardStatsGrid';
import Card from '../../components/common/Card';
import Timeline from '../../components/common/Timeline';

export default function AdminDashboard() {
  const mockRecentActivity = [
    { title: 'New Batch Created', description: 'Batch "Summer 2026 Full-Stack" was created by Admin.', status: 'completed', time: '2 hours ago' },
    { title: 'Mark Override', description: 'Student "Alice Smith" assignment score updated.', status: 'active', time: '4 hours ago' },
    { title: 'Teacher Added', description: 'Teacher "Bob Jones" joined.', status: 'default', time: '1 day ago' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <DashboardStatsGrid />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-xl)' }}>
        <Card title="Quick Actions">
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            {/* Quick action buttons would go here */}
            <p>Welcome to the IMS Admin Dashboard. Use the sidebar to navigate to different management sections.</p>
          </div>
        </Card>
        <Card title="Recent Activity">
          <Timeline items={[]} />
        </Card>
      </div>
    </div>
  );
}
