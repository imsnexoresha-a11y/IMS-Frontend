import apiClient from './apiClient';

// ── Dashboard ──
export async function getStudentDashboard() {
  const data = await apiClient.get('/student/dashboard').catch(() => ({}));
  return {
    totalMarks: data.totalMarks || 0,
    rank: data.rank || 0,
    totalStudents: data.totalStudents || 0,
    attendancePercent: data.attendancePercent || 0,
    onTimePercent: data.onTimePercent || 0,
    assignmentsPending: data.assignmentsPending || 0,
    assignmentsCompleted: data.assignmentsCompleted || 0,
    upcomingLectures: data.upcomingLectures || [],
    pendingAssignments: data.pendingAssignments || [],
  };
}

// ── Marks History ──
export async function getMarksHistory(params = {}) {
  const data = await apiClient.get('/student/marks/history', { params }).catch(() => ({ entries: [] }));
  const entries = Array.isArray(data.entries) ? data.entries : (Array.isArray(data) ? data : []);
  return { entries };
}

// ── Assignments ──
export async function getAssignments() {
  const data = await apiClient.get('/student/assignments').catch(() => []);
  return data.assignments || data || [];
}

export async function getAssignmentDetail(id) {
  const data = await apiClient.get(`/student/assignments/${id}`).catch(() => ({}));
  return data.assignment || data;
}

export async function submitAssignment(id, data) {
  return apiClient.post(`/student/assignments/${id}/submit`, data);
}

// ── Portfolio ──
export async function getPortfolio() {
  const data = await apiClient.get('/student/portfolio').catch(() => ({}));
  const user = JSON.parse(localStorage.getItem('ims_user')) || { name: 'Student' };
  return {
    profile: data.profile || {
      user: { name: user.name, email: user.email },
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || user.avatar || null,
      enrollementNo: 'IMS-2026-000',
      githubLink: 'https://github.com/',
      linkedinLink: 'https://linkedin.com/',
      skills: []
    },
    metrics: data.metrics || {
      totalPoints: 0, rank: 0, assignmentAvgScore: 0, attendancePercentage: 0
    },
    assignments: data.assignments || []
  };
}

export async function downloadPortfolioPDF() {
  const token = localStorage.getItem('ims_token');
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
  const { default: axios } = await import('axios');
  const response = await axios.get(`${baseURL}/student/portfolio/pdf`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${token}` },
    timeout: 30000,
  });
  return response.data;
}

// ── Curriculum ──
export async function getCurriculum() {
  const data = await apiClient.get('/student/curriculum').catch(() => []);
  return data.curriculum || data || [];
}

// ── Quizzes ──
export async function getQuizzes() {
  const data = await apiClient.get('/quizzes').catch(() => []);
  return data.quizzes || data || [];
}

// ── Notifications ──
export async function getNotifications(studentId, params = {}) {
  const data = await apiClient.get('/student/notifications', { params }).catch(() => []);
  return data.notifications || data || [];
}

export async function markNotificationRead(id) {
  return apiClient.patch(`/student/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  return apiClient.patch('/student/notifications/read-all');
}

// ── Profile ──
export async function getStudentProfile() {
  const data = await apiClient.get('/student/profile').catch(() => ({}));
  const user = JSON.parse(localStorage.getItem('ims_user')) || { name: 'Student', email: 'student@example.com' };
  return {
    id: data.id || data._id || user.id,
    name: data.name || user.name,
    email: data.email || user.email,
    dateOfBirth: data.dateOfBirth || data.dob || '2000-01-01',
    githubLink: data.githubLink || data.gitHubUrl || 'https://github.com/',
    linkedinLink: data.linkedinLink || data.linkedInUrl || 'https://linkedin.com/',
    skills: data.skills || [],
    bio: data.bio || '',
    profilePic: data.profilePic || null,
    batchName: data.batchId?.name || 'Unassigned',
    educationQualification: data.educationQualification || '',
    gender: data.gender || '',
    instituteName: data.instituteName || '',
    resume: data.resume || ''
  };
}

export async function updateStudentProfile(data) {
  const res = await apiClient.put('/student/profile', data);
  const user = JSON.parse(localStorage.getItem('ims_user')) || {};
  const updatedUser = { ...user, ...data };
  localStorage.setItem('ims_user', JSON.stringify(updatedUser));
  return res;
}
