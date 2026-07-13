import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentDashboardStats from '../../components/student/StudentDashboardStats';
import PerformanceChart from '../../components/student/PerformanceChart';
import StudentUpcomingLectures from '../../components/student/StudentUpcomingLectures';
import { getStudentDashboard } from '../../api/studentApi';

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getStudentDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statsProp = dashboardData ? {
    attendancePercent: dashboardData.attendancePercent || 0,
    overallScore: dashboardData.totalMarks || 0,
    rank: dashboardData.rank || 0,
    totalStudents: dashboardData.totalStudents || 0,
    nextLecture: dashboardData.upcomingLectures?.[0]?.title || 'None scheduled',
  } : null;

  return (
    <div style={{ padding: 'var(--space-xl)', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-black)', color: 'var(--color-primary)', margin: 0 }}>Overview</h1>
          {dashboardData?.student?.batchName && (
            <span style={{ 
              backgroundColor: 'var(--color-primary-light)', 
              color: 'var(--color-primary)', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-bold)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-primary)'
            }}>
              Batch: {dashboardData.student.batchName}
            </span>
          )}
        </div>
        
        {loading ? (
          <p>Loading overview...</p>
        ) : (
          <>
            <StudentDashboardStats stats={statsProp} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
              <PerformanceChart />
              <StudentUpcomingLectures lectures={dashboardData?.upcomingLectures || []} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

