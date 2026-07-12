import apiClient from './apiClient';

// NOTE: Recruiter endpoints are public — no JWT auth required.

export async function getBatchOverview(batchUuid) {
  return apiClient.get(`/recruiter/${batchUuid}`);
}

export async function getBatchStudents(batchUuid, params = {}) {
  const data = await apiClient.get(`/recruiter/${batchUuid}/students`, { params });
  return {
    items: data.students || data || [],
    pagination: data.pagination || { page: 1, limit: 100, total: (data.students || data || []).length, totalPages: 1 }
  };
}

export async function getStudentPortfolio(batchUuid, studentId) {
  return apiClient.get(`/recruiter/${batchUuid}/students/${studentId}`);
}
