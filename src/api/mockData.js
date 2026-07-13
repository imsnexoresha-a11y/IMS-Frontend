/**
 * Centralized mock data for IMS development
 * All data shapes match the real backend API contract.
 */

// ── Teachers ──
export const mockTeachers = [
  { id: 'teacher-001', name: 'Marcus Johnson', email: 'marcus.j@ims.dev', phone: '+1-555-0101', specialization: 'Full-Stack Development', batchCount: 3, createdAt: '2025-09-01T10:00:00Z' },
  { id: 'teacher-002', name: 'Priya Sharma', email: 'priya.s@ims.dev', phone: '+1-555-0102', specialization: 'Data Science', batchCount: 2, createdAt: '2025-09-15T10:00:00Z' },
  { id: 'teacher-003', name: 'James Williams', email: 'james.w@ims.dev', phone: '+1-555-0103', specialization: 'DevOps & Cloud', batchCount: 1, createdAt: '2025-10-01T10:00:00Z' },
  { id: 'teacher-004', name: 'Fatima Al-Rashid', email: 'fatima.ar@ims.dev', phone: '+1-555-0104', specialization: 'Frontend Engineering', batchCount: 2, createdAt: '2025-10-10T10:00:00Z' },
];

// ── Students ──
export const mockStudents = [
  { id: 'student-001', name: 'Tunde Balogun', email: 'tunde.balogun@ims-nexoresha.com', batchId: 'batch-001', batchName: 'Cohort Alpha 2026', rank: 1, totalMarks: 92.4, attendancePercent: 96, onTimePercent: 88, status: 'active', joinedAt: '2026-01-10T10:00:00Z' },
  { id: 'student-002', name: 'Fola Akin', email: 'fola.akin@ims-nexoresha.com', batchId: 'batch-001', batchName: 'Cohort Alpha 2026', rank: 2, totalMarks: 89.1, attendancePercent: 92, onTimePercent: 95, status: 'active', joinedAt: '2026-01-10T10:00:00Z' },
  { id: 'student-003', name: 'Grace Mensah', email: 'grace.mensah@ims-nexoresha.com', batchId: 'batch-001', batchName: 'Cohort Alpha 2026', rank: 3, totalMarks: 87.6, attendancePercent: 100, onTimePercent: 82, status: 'active', joinedAt: '2026-01-10T10:00:00Z' },
];

// ── Batches ──
export const mockBatches = [
  {
    id: 'batch-001', name: 'Cohort Alpha 2026', teacherId: 'teacher-001', teacherName: 'Marcus Johnson',
    startDate: '2026-01-10', endDate: '2026-07-10', studentCount: 6, lectureCount: 24,
    status: 'active', recruiterLinkUuid: 'rec-uuid-alpha-001',
    config: { attendanceWeight: 10, quizWeight: 15, assignmentWeight: 40, codeReviewWeight: 25, bonusWeight: 10 },
    createdAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'batch-002', name: 'Cohort Beta 2026', teacherId: 'teacher-002', teacherName: 'Priya Sharma',
    startDate: '2026-03-01', endDate: '2026-09-01', studentCount: 2, lectureCount: 12,
    status: 'active', recruiterLinkUuid: 'rec-uuid-beta-002',
    config: { attendanceWeight: 10, quizWeight: 20, assignmentWeight: 35, codeReviewWeight: 25, bonusWeight: 10 },
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'batch-003', name: 'Cohort Gamma 2025', teacherId: 'teacher-003', teacherName: 'James Williams',
    startDate: '2025-06-01', endDate: '2025-12-01', studentCount: 8, lectureCount: 30,
    status: 'completed', recruiterLinkUuid: null,
    config: { attendanceWeight: 10, quizWeight: 15, assignmentWeight: 40, codeReviewWeight: 25, bonusWeight: 10 },
    createdAt: '2025-05-10T10:00:00Z',
  },
];

// ── Topics ──
export const mockTopics = [
  { id: 'topic-001', batchId: 'batch-001', title: 'HTML & CSS Fundamentals', order: 1, lectureCount: 4, notesCount: 2, completed: true },
  { id: 'topic-002', batchId: 'batch-001', title: 'JavaScript Core', order: 2, lectureCount: 6, notesCount: 3, completed: true },
  { id: 'topic-003', batchId: 'batch-001', title: 'React Essentials', order: 3, lectureCount: 5, notesCount: 4, completed: false },
  { id: 'topic-004', batchId: 'batch-001', title: 'Node.js & Express', order: 4, lectureCount: 4, notesCount: 1, completed: false },
  { id: 'topic-005', batchId: 'batch-001', title: 'MongoDB & Mongoose', order: 5, lectureCount: 3, notesCount: 0, completed: false },
  { id: 'topic-006', batchId: 'batch-001', title: 'Authentication & Security', order: 6, lectureCount: 2, notesCount: 0, completed: false },
];

// ── Lectures ──
export const mockLectures = [
  { id: 'lec-001', batchId: 'batch-001', topicId: 'topic-001', title: 'Intro to HTML', date: '2026-01-12T09:00:00Z', status: 'completed', attendanceCount: 6, avgQuizScore: 85.2, avgAssignmentScore: 78.5, teacherName: 'Marcus Johnson' },
  { id: 'lec-002', batchId: 'batch-001', topicId: 'topic-001', title: 'CSS Box Model & Layouts', date: '2026-01-14T09:00:00Z', status: 'completed', attendanceCount: 5, avgQuizScore: 72.0, avgAssignmentScore: 80.1, teacherName: 'Marcus Johnson' },
  { id: 'lec-003', batchId: 'batch-001', topicId: 'topic-002', title: 'Variables, Types & Functions', date: '2026-01-19T09:00:00Z', status: 'completed', attendanceCount: 6, avgQuizScore: 90.5, avgAssignmentScore: 85.3, teacherName: 'Marcus Johnson' },
  { id: 'lec-004', batchId: 'batch-001', topicId: 'topic-002', title: 'DOM Manipulation', date: '2026-01-21T09:00:00Z', status: 'completed', attendanceCount: 5, avgQuizScore: 68.0, avgAssignmentScore: 72.0, teacherName: 'Marcus Johnson' },
  { id: 'lec-005', batchId: 'batch-001', topicId: 'topic-003', title: 'React Components & JSX', date: '2026-02-02T09:00:00Z', status: 'in_progress', attendanceCount: null, avgQuizScore: null, avgAssignmentScore: null, teacherName: 'Marcus Johnson' },
  { id: 'lec-006', batchId: 'batch-001', topicId: 'topic-003', title: 'State & Props', date: '2026-02-04T09:00:00Z', status: 'scheduled', attendanceCount: null, avgQuizScore: null, avgAssignmentScore: null, teacherName: 'Marcus Johnson' },
  { id: 'lec-007', batchId: 'batch-001', topicId: 'topic-003', title: 'Hooks Deep Dive', date: '2026-02-06T09:00:00Z', status: 'scheduled', attendanceCount: null, avgQuizScore: null, avgAssignmentScore: null, teacherName: 'Marcus Johnson' },
];

// ── Assignments ──
export const mockAssignments = [
  { id: 'asgn-001', batchId: 'batch-001', lectureId: 'lec-001', title: 'Build a Personal Portfolio Page', dueDate: '2026-01-18T23:59:00Z', status: 'reviewed', submittedAt: '2026-01-17T20:30:00Z', githubUrl: 'https://github.com/anika-p/portfolio-page', score: 85, feedback: 'Great use of semantic HTML. Consider adding more responsive breakpoints.', isLate: false },
  { id: 'asgn-002', batchId: 'batch-001', lectureId: 'lec-002', title: 'CSS Grid Dashboard Layout', dueDate: '2026-01-20T23:59:00Z', status: 'reviewed', submittedAt: '2026-01-21T02:15:00Z', githubUrl: 'https://github.com/anika-p/css-grid-dash', score: 72, feedback: 'Submitted late. Good grid usage but missing tablet breakpoint.', isLate: true },
  { id: 'asgn-003', batchId: 'batch-001', lectureId: 'lec-003', title: 'JavaScript Calculator', dueDate: '2026-01-25T23:59:00Z', status: 'submitted', submittedAt: '2026-01-24T18:00:00Z', githubUrl: 'https://github.com/anika-p/js-calculator', score: null, feedback: null, isLate: false },
  { id: 'asgn-004', batchId: 'batch-001', lectureId: 'lec-004', title: 'Interactive To-Do App', dueDate: '2026-02-01T23:59:00Z', status: 'pending', submittedAt: null, githubUrl: null, score: null, feedback: null, isLate: false },
  { id: 'asgn-005', batchId: 'batch-001', lectureId: 'lec-005', title: 'React Component Library', dueDate: '2026-02-10T23:59:00Z', status: 'pending', submittedAt: null, githubUrl: null, score: null, feedback: null, isLate: false },
];

// ── Marks History ──
export const mockMarksHistory = [
  { id: 'mark-001', date: '2026-01-12', category: 'attendance', description: 'Lecture: Intro to HTML', value: 5, source: 'auto' },
  { id: 'mark-002', date: '2026-01-12', category: 'quiz', description: 'Quiz: HTML Basics', value: 8.5, source: 'auto' },
  { id: 'mark-003', date: '2026-01-14', category: 'attendance', description: 'Lecture: CSS Box Model', value: 5, source: 'auto' },
  { id: 'mark-004', date: '2026-01-18', category: 'assignment', description: 'Portfolio Page', value: 34, source: 'code_review' },
  { id: 'mark-005', date: '2026-01-18', category: 'code_review', description: 'Portfolio Page — Code Review', value: 21.25, source: 'teacher' },
  { id: 'mark-006', date: '2026-01-19', category: 'attendance', description: 'Lecture: Variables & Functions', value: 5, source: 'auto' },
  { id: 'mark-007', date: '2026-01-19', category: 'quiz', description: 'Quiz: JS Fundamentals', value: 9.05, source: 'auto' },
  { id: 'mark-008', date: '2026-01-20', category: 'assignment', description: 'CSS Grid Dashboard', value: 28.8, source: 'code_review' },
  { id: 'mark-009', date: '2026-01-25', category: 'bonus', description: 'Early submission bonus', value: 2, source: 'admin_override' },
];

// ── Attendance Records ──
export const mockAttendance = [
  { studentId: 'student-001', studentName: 'Anika Patel', lectureId: 'lec-001', status: 'present' },
  { studentId: 'student-002', studentName: 'Carlos Rivera', lectureId: 'lec-001', status: 'present' },
  { studentId: 'student-003', studentName: 'Emily Zhang', lectureId: 'lec-001', status: 'present' },
  { studentId: 'student-004', studentName: 'David Okafor', lectureId: 'lec-001', status: 'late' },
  { studentId: 'student-007', studentName: 'Lina Novak', lectureId: 'lec-001', status: 'absent' },
  { studentId: 'student-008', studentName: 'Chen Wei', lectureId: 'lec-001', status: 'present' },
];

// ── Quiz Results ──
export const mockQuizResults = [
  { studentId: 'student-001', studentName: 'Anika Patel', lectureId: 'lec-001', score: 85, maxScore: 100 },
  { studentId: 'student-002', studentName: 'Carlos Rivera', lectureId: 'lec-001', score: 92, maxScore: 100 },
  { studentId: 'student-003', studentName: 'Emily Zhang', lectureId: 'lec-001', score: 78, maxScore: 100 },
  { studentId: 'student-004', studentName: 'David Okafor', lectureId: 'lec-001', score: 88, maxScore: 100 },
  { studentId: 'student-008', studentName: 'Chen Wei', lectureId: 'lec-001', score: 68, maxScore: 100 },
];

// ── Mark Overrides ──
export const mockMarkOverrides = [
  { id: 'override-001', studentId: 'student-001', studentName: 'Anika Patel', category: 'bonus', previousValue: 0, newValue: 2, reason: 'Exceptional early submission and extra credit documentation provided during Week 3.', adminId: 'admin-001', adminName: 'Sarah Chen', createdAt: '2026-01-25T14:00:00Z' },
  { id: 'override-002', studentId: 'student-004', studentName: 'David Okafor', category: 'attendance', previousValue: 0, newValue: 5, reason: 'Medical emergency verified — doctor note provided. Student watched recorded lecture and completed all follow-up work.', adminId: 'admin-001', adminName: 'Sarah Chen', createdAt: '2026-01-20T16:30:00Z' },
];

// ── Audit Log ──
export const mockAuditLog = [
  { id: 'audit-001', action: 'mark_override', actor: 'Sarah Chen', actorRole: 'admin', target: 'Anika Patel', details: 'Added bonus mark: 0 → 2. Reason: Exceptional early submission.', timestamp: '2026-01-25T14:00:00Z' },
  { id: 'audit-002', action: 'student_created', actor: 'Sarah Chen', actorRole: 'admin', target: 'Chen Wei', details: 'Student added to Cohort Alpha 2026.', timestamp: '2026-01-10T10:15:00Z' },
  { id: 'audit-003', action: 'batch_created', actor: 'Sarah Chen', actorRole: 'admin', target: 'Cohort Beta 2026', details: 'New batch created with teacher Priya Sharma.', timestamp: '2026-02-15T10:00:00Z' },
  { id: 'audit-004', action: 'lecture_status_changed', actor: 'Marcus Johnson', actorRole: 'teacher', target: 'Lecture: React Components', details: 'Status: scheduled → in_progress', timestamp: '2026-02-02T09:01:00Z' },
  { id: 'audit-005', action: 'attendance_uploaded', actor: 'Marcus Johnson', actorRole: 'teacher', target: 'Lecture: Intro to HTML', details: 'CSV uploaded with 6 attendance records.', timestamp: '2026-01-12T10:30:00Z' },
  { id: 'audit-006', action: 'assignment_submitted', actor: 'Anika Patel', actorRole: 'student', target: 'Portfolio Page', details: 'GitHub URL: github.com/anika-p/portfolio-page', timestamp: '2026-01-17T20:30:00Z' },
  { id: 'audit-007', action: 'recruiter_link_generated', actor: 'Sarah Chen', actorRole: 'admin', target: 'Cohort Alpha 2026', details: 'Public recruiter link generated: rec-uuid-alpha-001', timestamp: '2026-01-28T11:00:00Z' },
  { id: 'audit-008', action: 'recalculation_triggered', actor: 'Sarah Chen', actorRole: 'admin', target: 'Cohort Alpha 2026', details: 'Full marks recalculation triggered for all students.', timestamp: '2026-02-01T08:00:00Z' },
];

// ── Notifications ──
export const mockNotifications = [
  { id: 'notif-001', type: 'assignment', title: 'New Assignment Posted', message: 'React Component Library — due Feb 10', read: false, createdAt: '2026-02-02T10:00:00Z', link: '/student/assignments' },
  { id: 'notif-002', type: 'review', title: 'Assignment Reviewed', message: 'CSS Grid Dashboard scored 72/100', read: false, createdAt: '2026-01-22T09:00:00Z', link: '/student/assignments' },
  { id: 'notif-003', type: 'lecture', title: 'Upcoming Lecture', message: 'State & Props — Feb 4 at 9:00 AM', read: true, createdAt: '2026-02-03T08:00:00Z', link: '/student/lectures' },
  { id: 'notif-004', type: 'mark', title: 'Bonus Mark Added', message: 'You received +2 bonus marks for early submission', read: true, createdAt: '2026-01-25T14:05:00Z', link: '/student/marks-history' },
];

// ── Dashboard Stats ──
export const mockAdminDashboardStats = {
  totalBatches: 3,
  activeBatches: 2,
  totalStudents: 8,
  totalTeachers: 4,
  topScorers: [
    { name: 'Sophie Martin', batch: 'Beta 2026', marks: 94.2 },
    { name: 'Anika Patel', batch: 'Alpha 2026', marks: 92.4 },
    { name: 'Carlos Rivera', batch: 'Alpha 2026', marks: 89.1 },
  ],
  bottomScorers: [
    { name: 'Chen Wei', batch: 'Alpha 2026', marks: 76.5 },
    { name: 'Lina Novak', batch: 'Alpha 2026', marks: 78.9 },
  ],
  recentActivity: mockAuditLog.slice(0, 5),
};

export const mockStudentDashboard = {
  totalMarks: 92.4,
  rank: 1,
  totalStudents: 6,
  attendancePercent: 96,
  onTimePercent: 88,
  assignmentsPending: 2,
  assignmentsCompleted: 3,
  upcomingLectures: mockLectures.filter((l) => l.status === 'scheduled').slice(0, 3),
  pendingAssignments: mockAssignments.filter((a) => a.status === 'pending'),
};

// ── Recruiter / Portfolio Metrics (18 metrics) ──
export const mockStudentMetrics = {
  studentId: 'student-001',
  studentName: 'Anika Patel',
  batchName: 'Cohort Alpha 2026',
  overallScore: 92.4,
  rank: 1,
  totalStudents: 6,
  metrics: {
    attendanceRate: 96,
    onTimeSubmissionRate: 88,
    avgQuizScore: 84.6,
    avgAssignmentScore: 81.2,
    avgCodeReviewScore: 87.5,
    totalLecturesAttended: 23,
    totalLectures: 24,
    assignmentsSubmitted: 3,
    totalAssignments: 5,
    lateSubmissions: 1,
    bonusMarks: 2,
    topicsCovered: 3,
    totalTopics: 6,
    consistencyScore: 91,
    improvementTrend: 4.2,
    peerRanking: 1,
    codeQualityAvg: 87.5,
    engagementScore: 94,
  },
};

// ── Recruiter Link Data ──
export const mockRecruiterLinks = [
  { id: 'rec-link-001', batchId: 'batch-001', batchName: 'Cohort Alpha 2026', uuid: 'rec-uuid-alpha-001', active: true, createdAt: '2026-01-28T11:00:00Z', accessCount: 42 },
  { id: 'rec-link-002', batchId: 'batch-002', batchName: 'Cohort Beta 2026', uuid: 'rec-uuid-beta-002', active: true, createdAt: '2026-03-05T11:00:00Z', accessCount: 15 },
];
