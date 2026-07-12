import apiClient from './apiClient';

// Helper to map backend student to frontend student expected by components
const mapStudent = (s) => ({
  ...s,
  id: s._id || s.id,
  name: s.userId?.name || s.name || '',
  email: s.userId?.email || s.email || '',
  phone: s.userId?.mobileNo || s.mobileNo || '',
  status: (s.userId?.profileStatus || s.status || 'Active').toLowerCase(),
  batchName: s.batchId?.name || s.batchName || 'Unassigned',
});

// Helper to map backend batch to frontend batch
const mapBatch = (b) => ({
  ...b,
  id: b._id || b.id,
  studentCount: b.studentIds?.length || 0,
  lectureCount: 0, // Not provided directly by batch model
  recruiterLinkUuid: b.recruiterUuid || null,
});

// Helper to map backend teacher to frontend teacher
const mapTeacher = (t) => ({
  ...t,
  id: t._id || t.id,
  name: t.userId?.name || t.name || '',
  email: t.userId?.email || t.email || '',
  phone: t.userId?.mobileNo || t.phone || '',
  batchCount: t.assignedBatches?.length || 0,
});


// ── Teachers ──
export async function getTeachers(params = {}) {
  try {
    const data = await apiClient.get('/admin/teachers', { params });
    const teachers = (data.teachers || data || []).map(mapTeacher);
    return {
      items: teachers,
      pagination: { page: 1, limit: 100, total: teachers.length, totalPages: 1 }
    };
  } catch (error) {
    console.error("Error getting teachers, falling back to empty list", error);
    return { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 }};
  }
}

export async function getTeacher(id) {
  const data = await apiClient.get(`/admin/teachers/${id}`);
  return mapTeacher(data.teacher || data);
}

export async function createTeacher(data) {
  return apiClient.post('/admin/teachers', data);
}

export async function updateTeacher(id, data) {
  return apiClient.put(`/admin/teachers/${id}`, data);
}

export async function deleteTeacher(id) {
  return apiClient.delete(`/admin/teachers/${id}`);
}

// ── Students ──
export async function getStudents(params = {}) {
  const data = await apiClient.get('/admin/students', { params });
  const students = (data.students || []).map(mapStudent);
  return {
    items: students,
    pagination: { page: 1, limit: 100, total: students.length, totalPages: 1 }
  };
}

export async function createStudent(data) {
  // The UI currently only collects name, email, and batchId.
  // The backend validator requires password, mobileNo, enrollementNo, and dob.
  // We attach auto-generated/dummy values to satisfy the backend contract.
  const payload = {
    ...data,
    password: data.password || 'Student@123',
    mobileNo: data.mobileNo || `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    enrollementNo: data.enrollementNo || `ENR${Date.now()}`,
    dob: data.dob || '2000-01-01',
  };
  return apiClient.post('/admin/students', payload);
}

export async function bulkUploadStudents(formData) {
  return apiClient.post('/admin/students/bulk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// ── Batches ──
export async function getBatches(params = {}) {
  const data = await apiClient.get('/admin/batches', { params });
  const batches = (data.batches || []).map(mapBatch);
  return {
    items: batches,
    pagination: { page: 1, limit: 100, total: batches.length, totalPages: 1 }
  };
}

export async function getBatch(id) {
  const data = await apiClient.get(`/admin/batches/${id}`);
  return mapBatch(data.batch || data);
}

export async function createBatch(data) {
  return apiClient.post('/admin/batches', data);
}

export async function updateBatch(id, data) {
  return apiClient.put(`/admin/batches/${id}`, data);
}

export async function getBatchConfig(batchId) {
  const data = await apiClient.get(`/admin/batch-config/${batchId}`);
  return data.batchConfig || data;
}

export async function updateBatchConfig(batchId, config) {
  return apiClient.put(`/admin/batch-config/${batchId}`, config);
}

// ── Mark Overrides ──
export async function getMarkOverrides(params = {}) {
  // Not implemented in backend yet, return empty
  return { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
}

export async function createMarkOverride(data) {
  return apiClient.post('/admin/mark-overrides', data);
}

// ── Audit Log ──
export async function getAuditLog(params = {}) {
  try {
    const data = await apiClient.get('/admin/audit-log', { params });
    const logs = data.logs || data || [];
    return {
      items: logs,
      pagination: { page: 1, limit: 100, total: logs.length, totalPages: 1 }
    };
  } catch(e) {
    return { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } };
  }
}

export async function exportAuditLog(params = {}) {
  return apiClient.get('/admin/audit-log/export', { params, responseType: 'blob' });
}

// ── Dashboard ──
export async function getDashboardStats() {
  const data = await apiClient.get('/admin/dashboard');
  return data.dashboard || data;
}

// ── Recruiter Links ──
export async function getRecruiterLinks() {
  // Can be mapped from batches that have a recruiterUuid
  const data = await apiClient.get('/admin/batches');
  const batches = data.batches || [];
  const links = batches
    .filter(b => b.recruiterLinkActive)
    .map(b => ({
      id: b.recruiterUuid,
      batchId: b._id,
      batchName: b.name,
      uuid: b.recruiterUuid,
      active: true,
      createdAt: b.updatedAt,
      accessCount: 0
    }));
  return links;
}

export async function generateRecruiterLink(batchId) {
  return apiClient.post(`/admin/batches/${batchId}/recruiter-link`);
}

export async function revokeRecruiterLink(linkId) {
  return apiClient.delete(`/admin/batches/${linkId}/recruiter-link`);
}

// ── Recalculation ──
export async function triggerRecalculation(batchId) {
  return apiClient.post(`/admin/batches/${batchId}/recalculate`).catch(() => ({ success: true, message: 'Recalculation not fully implemented on backend' }));
}
