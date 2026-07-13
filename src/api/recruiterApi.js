import { mockResponse, mockPaginatedResponse } from './mockHelpers';
import { mockBatches, mockStudents, mockStudentMetrics, mockAssignments, mockTopics } from './mockData';
// import apiClient from './apiClient';
// NOTE: Recruiter endpoints are public — no JWT auth required.

export async function getBatchOverview(batchUuid) {
  // Real: return apiClient.get(`/recruiter/${batchUuid}`);
  const batch = mockBatches.find((b) => b.recruiterLinkUuid === batchUuid);
  if (!batch) {
    const error = new Error('This link is no longer active');
    error.status = 404;
    throw error;
  }
  return mockResponse({
    batchName: batch.name,
    teacherName: batch.teacherName,
    startDate: batch.startDate,
    endDate: batch.endDate,
    studentCount: batch.studentCount,
    lectureCount: batch.lectureCount,
    topicCount: 6,
  });
}

export async function getBatchStudents(batchUuid, params = {}) {
  // Real: return apiClient.get(`/recruiter/${batchUuid}/students`, { params });
  const batch = mockBatches.find((b) => b.recruiterLinkUuid === batchUuid);
  if (!batch) throw new Error('Invalid link');
  const students = mockStudents.filter((s) => s.batchId === batch.id);
  return mockPaginatedResponse(students, params.page, params.limit);
}

export async function getStudentPortfolio(batchUuid, studentId) {
  // Real: return apiClient.get(`/recruiter/${batchUuid}/students/${studentId}`);
  const student = mockStudents.find((s) => s.id === studentId);
  if (!student) throw new Error('Student not found');
  return mockResponse({
    student,
    metrics: mockStudentMetrics.metrics,
    assignments: mockAssignments.filter((a) => a.status === 'reviewed'),
    curriculum: mockTopics,
    teacherName: 'Marcus Johnson',
  });
}
