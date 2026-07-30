import apiClient from './apiClient';

// These endpoints are public. apiClient may still attach a token,
// but the backend does not require one for recruiter routes.

export async function getBatchOverview(batchUuid) {
  if (!batchUuid) {
    throw new Error('Recruiter link UUID is required.');
  }

  const result = await apiClient.get(
    `/recruiter/${batchUuid}`
  );

  return result?.batch || result;
}

export async function getBatchStudents(
  batchUuid,
  params = {}
) {
  if (!batchUuid) {
    throw new Error('Recruiter link UUID is required.');
  }

  const result = await apiClient.get(
    `/recruiter/${batchUuid}/students`,
    { params }
  );

  return (
    result?.students ||
    result?.items ||
    result ||
    []
  );
}

export async function getStudentPortfolio(
  batchUuid,
  studentId
) {
  if (!batchUuid) {
    throw new Error('Recruiter link UUID is required.');
  }

  if (!studentId) {
    throw new Error('Student ID is required.');
  }

  const result = await apiClient.get(
    `/recruiter/${batchUuid}/students/${studentId}`
  );

  return result?.student || result;
}