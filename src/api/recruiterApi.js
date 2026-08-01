import apiClient from './apiClient';

// These endpoints are public. apiClient may still attach a token,
// but the backend does not require one for recruiter routes.

export async function getBatchOverview(batchUuid) {
  if (!batchUuid) {
    throw new Error('Recruiter link UUID is required.');
  }

  const result = await apiClient.get(`/recruiter/${batchUuid}`);
  return result?.batch || result;
}

export async function getBatchStudents(batchUuid, params = {}) {
  if (!batchUuid) {
    throw new Error('Recruiter link UUID is required.');
  }

  const result = await apiClient.get(`/recruiter/${batchUuid}/students`, { params });

  if (result && Array.isArray(result.students)) {
    return result;
  }
  if (Array.isArray(result)) {
    return { batchName: 'Batch Portfolio', students: result, total: result.length };
  }
  return {
    batchName: result?.batchName || 'Batch Portfolio',
    students: result?.students || result?.items || [],
    total: result?.total || 0,
  };
}

export async function getStudentPortfolio(batchUuid, studentId) {
  if (!batchUuid || !studentId) {
    throw new Error('Recruiter link UUID and student ID are required.');
  }

  const result = await apiClient.get(`/recruiter/${batchUuid}/students/${studentId}`);
  return result?.student ? result : { student: result };
}