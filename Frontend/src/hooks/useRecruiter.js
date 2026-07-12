import { useQuery } from '@tanstack/react-query';
import * as recruiterApi from '../api/recruiterApi';

export function useRecruiterBatch(batchUuid) {
  return useQuery({
    queryKey: ['recruiterBatch', batchUuid],
    queryFn: () => recruiterApi.getBatchOverview(batchUuid),
    enabled: !!batchUuid,
    retry: false,
  });
}

export function useRecruiterStudents(batchUuid, params = {}) {
  return useQuery({
    queryKey: ['recruiterStudents', batchUuid, params],
    queryFn: () => recruiterApi.getBatchStudents(batchUuid, params),
    enabled: !!batchUuid,
  });
}

export function useRecruiterStudent(batchUuid, studentId) {
  return useQuery({
    queryKey: ['recruiterStudent', batchUuid, studentId],
    queryFn: () => recruiterApi.getStudentPortfolio(batchUuid, studentId),
    enabled: !!batchUuid && !!studentId,
  });
}
