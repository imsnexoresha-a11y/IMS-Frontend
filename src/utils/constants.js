export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  RECRUITER: 'recruiter',
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  LATE: 'late',
};

export const LECTURE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const MARK_CATEGORIES = {
  ATTENDANCE: 'attendance',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  CODE_REVIEW: 'code_review',
  BONUS: 'bonus',
};

export const NAV_ITEMS = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
    { label: 'Teachers', path: '/admin/teachers', icon: 'GraduationCap' },
    { label: 'Students', path: '/admin/students', icon: 'Users' },
    { label: 'Batches', path: '/admin/batches', icon: 'Layers' },
    { label: 'Learning Flow', path: '/admin/learning', icon: 'BookOpenCheck' },
    { label: 'Mark Overrides', path: '/admin/mark-overrides', icon: 'PenTool' },
    { label: 'Audit Log', path: '/admin/audit-log', icon: 'ScrollText' },
  ],
  [ROLES.TEACHER]: [
    { label: 'Dashboard', path: '/teacher', icon: 'LayoutDashboard' },
    { label: 'My Batches', path: '/teacher/batches', icon: 'Layers' },
    { label: 'Students', path: '/teacher/students', icon: 'Users' },
    { label: 'Profile', path: '/teacher/profile', icon: 'User' },
  ],
  [ROLES.STUDENT]: [
    { label: 'Dashboard', path: '/student', icon: 'LayoutDashboard' },
    { label: 'Marks History', path: '/student/marks-history', icon: 'BarChart3' },
    { label: 'Assignments', path: '/student/assignments', icon: 'ClipboardList' },
    { label: 'Curriculum', path: '/student/curriculum', icon: 'BookOpen' },
    { label: 'Lectures', path: '/student/lectures', icon: 'Video' },
    { label: 'Quiz', path: '/student/quiz', icon: 'HelpCircle' },
    { label: 'Portfolio', path: '/student/portfolio', icon: 'Briefcase' },
    { label: 'Profile', path: '/student/profile', icon: 'User' },
  ],
};

export const MARK_SCALE = {
  MIN: 30,
  MAX: 100,
};

export const ITEMS_PER_PAGE = 10;

export const CSV_ACCEPT = '.csv,text/csv,application/vnd.ms-excel';

export const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/;
