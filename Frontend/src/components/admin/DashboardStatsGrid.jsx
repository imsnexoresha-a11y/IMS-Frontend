import { useState, useEffect } from 'react';
import Card from '../common/Card';
import { Users, GraduationCap, Briefcase, Activity } from 'lucide-react';
import { getDashboardStats } from '../../api/adminApi';

export default function DashboardStatsGrid() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeBatches: 0,
    totalTeachers: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        if (data) {
          setStats({
            totalStudents: data.totalStudents || 0,
            activeBatches: data.activeBatches || 0,
            totalTeachers: data.totalTeachers || 0,
            averageAttendance: data.averageAttendance || 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    }
    fetchStats();
  }, []);

  const items = [
    { title: 'Total Students', value: stats.totalStudents, icon: <Users size={24} />, color: 'var(--color-primary)' },
    { title: 'Active Batches', value: stats.activeBatches, icon: <Briefcase size={24} />, color: 'var(--color-success)' },
    { title: 'Total Teachers', value: stats.totalTeachers, icon: <GraduationCap size={24} />, color: 'var(--color-accent)' },
    { title: 'Avg Attendance', value: `${stats.averageAttendance}%`, icon: <Activity size={24} />, color: 'var(--color-warning)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
      {items.map((item, i) => (
        <Card key={i} className="student-block-hover">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div style={{ padding: 'var(--space-sm)', borderRadius: 'var(--radius-md)', background: `${item.color}20`, color: item.color }}>
              {item.icon}
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>{item.title}</p>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{item.value}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

