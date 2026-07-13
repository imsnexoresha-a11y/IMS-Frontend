import { mockResponse } from './mockHelpers';
import { mockStudentMetrics } from './mockData';
// import apiClient from './apiClient';

export async function getStudentMetrics(studentId) {
  // Real: return apiClient.get(`/metrics/students/${studentId}`);
  return mockResponse({ ...mockStudentMetrics, studentId });
}

export async function getBatchMetrics(batchUuid) {
  // Real: return apiClient.get(`/metrics/batches/${batchUuid}`);
  return mockResponse({
    batchName: 'Cohort Alpha 2026',
    avgOverallScore: 85.0,
    avgAttendance: 91.5,
    avgQuizScore: 78.9,
    avgAssignmentScore: 79.0,
    avgCodeReviewScore: 82.3,
    topPerformer: 'Anika Patel',
    completionRate: 50,
    studentCount: 6,
  });
}
