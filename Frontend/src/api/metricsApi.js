import apiClient from './apiClient';

export async function getStudentMetrics(studentId) {
  return apiClient.get(`/metrics/students/${studentId}`).catch(() => ({
    studentId,
    studentName: 'Student',
    batchName: 'Batch',
    overallScore: 0,
    rank: 0,
    totalStudents: 0,
    metrics: {
      attendanceRate: 0,
      onTimeSubmissionRate: 0,
      avgQuizScore: 0,
      avgAssignmentScore: 0,
      avgCodeReviewScore: 0,
      totalLecturesAttended: 0,
      totalLectures: 0,
      assignmentsSubmitted: 0,
      totalAssignments: 0,
      lateSubmissions: 0,
      bonusMarks: 0,
      topicsCovered: 0,
      totalTopics: 0,
      consistencyScore: 0,
      improvementTrend: 0,
      peerRanking: 0,
      codeQualityAvg: 0,
      engagementScore: 0,
    }
  }));
}

export async function getBatchMetrics(batchUuid) {
  return apiClient.get(`/metrics/batches/${batchUuid}`).catch(() => ({
    batchName: 'Batch',
    avgOverallScore: 0,
    avgAttendance: 0,
    avgQuizScore: 0,
    avgAssignmentScore: 0,
    avgCodeReviewScore: 0,
    topPerformer: 'N/A',
    completionRate: 0,
    studentCount: 0,
  }));
}
