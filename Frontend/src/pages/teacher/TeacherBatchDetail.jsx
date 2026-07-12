import { useParams, useLocation } from 'react-router-dom';
import Tabs from '../../components/common/Tabs';
import TopicList from '../../components/teacher/TopicList';
import LectureList from '../../components/teacher/LectureList';
import CourseList from '../../components/teacher/CourseList';
import { AttendanceCSVUpload } from '../../components/teacher/AttendanceUpload';
import { QuizCSVUpload } from '../../components/teacher/QuizUpload';

export default function TeacherBatchDetail() {
  const { id } = useParams();
  const location = useLocation();
  const defaultTab = location.state?.activeTab ?? 0;
  const selectedLectureId = location.state?.selectedLectureId ?? '';
  
  const tabs = [
    {
      label: 'Courses',
      content: <CourseList batchId={id} />
    },
    {
      label: 'Topics & Materials',
      content: <TopicList batchId={id} />
    },
    {
      label: 'Lectures',
      content: <LectureList batchId={id} />
    },
    {
      label: 'Attendance',
      content: <AttendanceCSVUpload batchId={id} initialLectureId={selectedLectureId} />
    },
    {
      label: 'Quizzes',
      content: <QuizCSVUpload batchId={id} initialLectureId={selectedLectureId} />
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-black)', marginBottom: 'var(--space-xs)' }}>
        Batch Management
      </h2>
      <Tabs defaultTab={defaultTab} tabs={tabs} />
    </div>
  );
}
