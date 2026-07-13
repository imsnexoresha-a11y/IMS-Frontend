import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';

import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import RoleRoute from './components/routing/RoleRoute';

import { ROLES } from './utils/constants';

// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Unauthorized from './pages/auth/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminBatches from './pages/admin/AdminBatches';
import AdminLearningFlow from './pages/admin/AdminLearningFlow';
import AdminMarkOverrides from './pages/admin/AdminMarkOverrides';
import AdminAuditLog from './pages/admin/AdminAuditLog';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherBatchDetail from './pages/teacher/TeacherBatchDetail';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherBatches from './pages/teacher/TeacherBatches';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentMarksHistory from './pages/student/StudentMarksHistory';
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage';
import StudentCurriculumPage from './pages/student/StudentCurriculumPage';
import StudentQuizPage from './pages/student/StudentQuizPage';
import StudentPortfolioPage from './pages/student/StudentPortfolioPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentLecturesPage from './pages/student/StudentLecturesPage';

// Recruiter pages
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
                <Route path="/recruiter/:uuid" element={<RecruiterView />} />

                {/* Admin Routes */}
                <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/teachers" element={<AdminTeachers />} />
                  <Route path="/admin/students" element={<AdminStudents />} />
                  <Route path="/admin/batches" element={<AdminBatches />} />
                  <Route path="/admin/learning" element={<AdminLearningFlow />} />
                  <Route path="/admin/mark-overrides" element={<AdminMarkOverrides />} />
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

                <Route
                  path="*"
                  element={<Navigate to="/login" replace />}
                />
              </Routes>
            </ToastProvider>
          </UIProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}