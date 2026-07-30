import apiClient from './apiClient';

export async function getStudentMetrics(
  studentId,
  batchId
) {
  if (!studentId) {
    return {};
  }

  const endpoint = batchId
    ? `/metrics/full/${studentId}/${batchId}`
    : `/metrics/full/${studentId}`;

  return apiClient.get(endpoint);
}

export async function getBatchMetrics(batchId) {
  if (!batchId) {
    return {
      studentCount: 0,
      avgOverallScore: 0,
      avgAttendance: 0,
      avgQuizScore: 0,
      avgAssignmentScore: 0,
      scoreDistribution: [],
    };
  }

  return apiClient.get(
    `/metrics/batch/${batchId}`
  );
}