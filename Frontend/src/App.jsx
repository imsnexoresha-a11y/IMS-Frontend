import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ROLES } from './utils/constants';

// Routing
import RoleRoute from './components/routing/RoleRoute';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Unauthorized from './pages/auth/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminBatches from './pages/admin/AdminBatches';
import AdminMarks from './pages/admin/AdminMarks';
import AdminAuditLog from './pages/admin/AdminAuditLog';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherBatchDetail from './pages/teacher/TeacherBatchDetail';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherBatches from './pages/teacher/TeacherBatches';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMarksHistory from './pages/student/StudentMarksHistory';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentCurriculumPage from './pages/student/StudentCurriculumPage';
import StudentQuizPage from './pages/student/StudentQuizPage';
import StudentPortfolioPage from './pages/student/StudentPortfolioPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentLecturesPage from './pages/student/StudentLecturesPage';

// Recruiter Pages
import RecruiterView from './pages/recruiter/RecruiterView';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <UIProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Public Recruiter Link */}
                <Route path="/recruiter/:uuid" element={<RecruiterView />} />

                {/* Admin Routes */}
                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/teachers" element={<AdminTeachers />} />
                  <Route path="/admin/students" element={<AdminStudents />} />
                  <Route path="/admin/batches" element={<AdminBatches />} />
                  <Route path="/admin/marks" element={<AdminMarks />} />
                  <Route path="/admin/audit-log" element={<AdminAuditLog />} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<RoleRoute allowedRoles={[ROLES.TEACHER]} />}>
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/batches" element={<TeacherBatches />} />
                  <Route path="/teacher/batches/:id" element={<TeacherBatchDetail />} />
                  <Route path="/teacher/students" element={<TeacherStudents />} />
                  <Route path="/teacher/profile" element={<TeacherProfile />} />
                </Route>

                {/* Student Routes */}
                <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]} />}>
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/student/marks-history" element={<StudentMarksHistory />} />
                  <Route path="/student/assignments" element={<StudentAssignmentsPage />} />
                  <Route path="/student/curriculum" element={<StudentCurriculumPage />} />
                  <Route path="/student/lectures" element={<StudentLecturesPage />} />
                  <Route path="/student/quiz" element={<StudentQuizPage />} />
                  <Route path="/student/portfolio" element={<StudentPortfolioPage />} />
                  <Route path="/student/profile" element={<StudentProfilePage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ToastProvider>
          </UIProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
