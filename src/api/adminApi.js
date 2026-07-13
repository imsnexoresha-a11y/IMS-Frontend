import apiClient from './apiClient';

import { mockResponse, mockPaginatedResponse } from './mockHelpers';
import {
  mockBatches,
  mockMarkOverrides,
  mockAuditLog,
  mockRecruiterLinks,
} from './mockData';

/*
|--------------------------------------------------------------------------
| Teachers
|--------------------------------------------------------------------------
*/

function normalizeTeacher(instructor) {
  if (!instructor) {
    return null;
  }

  const user = instructor.userId || instructor.user || {};

  return {
    id: instructor._id || instructor.id,
    _id: instructor._id || instructor.id,

    userId: user._id || user.id || instructor.userId,

    name: user.name || instructor.name || '',
    email: user.email || instructor.email || '',
    mobileNo:
      user.mobileNo ||
      instructor.mobileNo ||
      '',

    designation: instructor.designation || '',
    bio: instructor.bio || '',
    linkedInUrl: instructor.linkedInUrl || '',
    profileImage: instructor.profileImage || '',

    assignedBatches: instructor.assignedBatches || [],
    batchCount: instructor.assignedBatches?.length || 0,

    profileStatus:
      user.profileStatus ||
      instructor.profileStatus ||
      'Active',

    active:
      (
        user.profileStatus ||
        instructor.profileStatus ||
        'Active'
      ) === 'Active',

    createdAt:
      instructor.createdAt ||
      user.createdAt ||
      null,
  };
}

export async function getTeachers(params = {}) {
  const result = await apiClient.get('/admin/teachers', {
    params,
  });

  const instructors = Array.isArray(result)
    ? result
    : result?.instructors ||
    result?.teachers ||
    [];

  return instructors.map(normalizeTeacher);
}

export async function getTeacher(id) {
  if (!id) {
    throw new Error('Teacher ID is required.');
  }

  const result = await apiClient.get(
    `/admin/teachers/${id}`
  );

  return normalizeTeacher(result);
}

export async function createTeacher(data) {
  const result = await apiClient.post(
    '/admin/teachers',
    data
  );

  if (result?.instructor && result?.user) {
    return normalizeTeacher({
      ...result.instructor,
      userId: result.user,
    });
  }

  return normalizeTeacher(result);
}

export async function updateTeacher(id, data) {
  if (!id) {
    throw new Error('Teacher ID is required.');
  }

  const result = await apiClient.put(
    `/admin/teachers/${id}`,
    data
  );

  return normalizeTeacher(result);
}

export async function updateTeacherStatus(id, active) {
  if (!id) {
    throw new Error('Teacher ID is required.');
  }

  return apiClient.patch(
    `/admin/teachers/${id}/status`,
    {
      active: Boolean(active),
    }
  );
}

/*
 * Compatibility for older imports.
 * There is no DELETE teacher endpoint.
 */
export async function deleteTeacher(id) {
  return updateTeacherStatus(id, false);
}

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
| Backend routes:
| GET    /admin/students
| GET    /admin/students/:id
| POST   /admin/students
| POST   /admin/students/bulk
| PUT    /admin/students/:id
| PATCH  /admin/students/:id/status
| PATCH  /admin/students/:id/batch
*/

export async function getStudents(params = {}) {
  const result = await apiClient.get('/admin/students', {
    params,
  });

  return result?.students || [];
}

export async function getStudent(id) {
  if (!id) {
    throw new Error('Student ID is required.');
  }

  const result = await apiClient.get(`/admin/students/${id}`);

  return result?.student || result;
}

export async function createStudent(data) {
  return apiClient.post('/admin/students', data);
}

/*
 * Your backend currently expects JSON:
 *
 * {
 *   students: [...]
 * }
 *
 * It does not currently accept multipart/form-data directly.
 * CSV parsing will be added inside BulkUploadCSVModal later.
 */
export async function bulkUploadStudents(students) {
  const studentRecords = Array.isArray(students)
    ? students
    : students?.students;

  if (!Array.isArray(studentRecords) || studentRecords.length === 0) {
    throw new Error('At least one student record is required.');
  }

  return apiClient.post('/admin/students/bulk', {
    students: studentRecords,
  });
}

export async function updateStudent(id, data) {
  if (!id) {
    throw new Error('Student ID is required.');
  }

  return apiClient.put(`/admin/students/${id}`, data);
}

export async function updateStudentStatus(id, profileStatus) {
  if (!id) {
    throw new Error('Student ID is required.');
  }

  const allowedStatuses = [
    'Active',
    'Inactive',
    'blocked',
  ];

  if (!allowedStatuses.includes(profileStatus)) {
    throw new Error(
      'Student status must be Active, Inactive, or blocked.'
    );
  }

  return apiClient.patch(`/admin/students/${id}/status`, {
    profileStatus,
  });
}

export async function moveStudentToBatch(id, newBatchId) {
  if (!id) {
    throw new Error('Student ID is required.');
  }

  if (!newBatchId) {
    throw new Error('New batch ID is required.');
  }

  return apiClient.patch(`/admin/students/${id}/batch`, {
    newBatchId,
  });
}

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export async function getDashboardStats() {
  const result = await apiClient.get('/admin/dashboard');

  return result?.dashboard || result;
}

/*
|--------------------------------------------------------------------------
| Batches
|--------------------------------------------------------------------------
| These are connected because the backend routes already exist.
*/

export async function getBatches(params = {}) {
  const result = await apiClient.get('/admin/batches', {
    params,
  });

  return result?.batches || [];
}

export async function getBatch(id) {
  if (!id) {
    throw new Error('Batch ID is required.');
  }

  const result = await apiClient.get(`/admin/batches/${id}`);

  return result?.batch || result;
}

export async function createBatch(data) {
  return apiClient.post('/admin/batches', data);
}

export async function updateBatch(id, data) {
  if (!id) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.put(`/admin/batches/${id}`, data);
}

export async function closeBatch(id) {
  if (!id) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.patch(`/admin/batches/${id}/close`);
}

export async function assignTeachersToBatch(
  batchId,
  teacherIds
) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.patch(
    `/admin/batches/${batchId}/teachers`,
    {
      teacherIds,
    }
  );
}

export async function getBatchConfig(batchId) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  const result = await apiClient.get(
    `/admin/batch-config/${batchId}`
  );

  return result?.batchConfig || result;
}

export async function updateBatchConfig(batchId, config) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.put(
    `/admin/batch-config/${batchId}`,
    config
  );
}

/*
|--------------------------------------------------------------------------
| Marks Administration
|--------------------------------------------------------------------------
*/

export async function createMarkOverride(data) {
  return apiClient.post('/admin/marks/override', {
    studentId: data.studentId,
    delta: Number(data.delta),
    reason: data.reason,
  });
}

export async function correctLedgerEvent(data) {
  return apiClient.post(
    '/admin/marks/event-correction',
    {
      ledgerEventId: data.ledgerEventId,
      newMark: Number(data.newMark),
      reason: data.reason,
    }
  );
}

export async function createManualScore(data) {
  return apiClient.post('/admin/marks/manual-score', {
    studentId: data.studentId,
    submissionId: data.submissionId,
    manualScore: Number(data.manualScore),
    reason: data.reason,
  });
}

export async function getMarkOverrides(params = {}) {
  const result = await apiClient.get('/admin/audit-log', {
    params: {
      ...params,
      actionType: 'MARK_OVERRIDE',
    },
  });

  const logs = result?.logs || [];
  const items = logs.map((log) => ({
    id: log._id || log.id,
    studentId: log.entityId,
    studentName: log.entityId,
    category: log.newValue?.category || 'override',
    previousValue: log.oldValue?.totalScore ?? '—',
    newValue: log.newValue?.totalScore ?? 0,
    reason: log.reason,
    adminId: log.adminId || 'admin',
    adminName: log.adminId || 'Admin',
    createdAt: log.createdAt || log.timestamp,
  }));

  return {
    items,
    pagination: result.pagination || {
      page: 1,
      limit: 10,
      total: items.length,
      totalPages: 1,
    },
  };
}

export async function recalculateStudent(
  studentId,
  reason
) {
  if (!studentId) {
    throw new Error('Student ID is required.');
  }

  return apiClient.post(
    `/admin/marks/recalculate/${studentId}`,
    { reason }
  );
}

export async function recalculateBatch(
  batchId,
  reason
) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.post(
    `/admin/marks/recalculate-batch/${batchId}`,
    { reason }
  );
}

/*
|--------------------------------------------------------------------------
| Audit Log
|--------------------------------------------------------------------------
*/

export async function getAuditLog(params = {}) {
  return apiClient.get('/admin/audit-log', {
    params,
  });
}

export async function exportAuditLog(params = {}) {
  return apiClient.get('/admin/audit-log/export', {
    params,
  });
}
/*
|--------------------------------------------------------------------------
| Recruiter Links
|--------------------------------------------------------------------------
*/

export async function getRecruiterLinks() {
  return mockResponse(mockRecruiterLinks);
}

export async function generateRecruiterLink(batchId) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.post(
    `/admin/batches/${batchId}/recruiter-link`
  );
}

export async function revokeRecruiterLink(batchId) {
  if (!batchId) {
    throw new Error('Batch ID is required.');
  }

  return apiClient.delete(
    `/admin/batches/${batchId}/recruiter-link`
  );
}

/*
|--------------------------------------------------------------------------
| Recalculation
|--------------------------------------------------------------------------
| This remains mocked until the marks API page is integrated.
*/

export async function triggerRecalculation(batchId) {
  return mockResponse({
    success: true,
    batchId,
    message:
      'Recalculation integration will be connected with the marks API.',
  });
}

/*
 * Temporary export retained in case an older component reads mock batches
 * directly through this API module.
 */
export { mockBatches };