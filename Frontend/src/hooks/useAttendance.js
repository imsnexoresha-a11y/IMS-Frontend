import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../api/teacherApi';

export function useUploadAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, lectureId, attendanceData }) =>
      teacherApi.uploadAttendanceCSV(batchId, lectureId, attendanceData),
    onSuccess: (_, { batchId, lectureId }) => {
      queryClient.invalidateQueries({ queryKey: ['lectures', batchId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', batchId, lectureId] });
      queryClient.invalidateQueries({ queryKey: ['batchStudents', batchId] });
    },
  });
}

export function useAttendanceResults(batchId, lectureId) {
  return useQuery({
    queryKey: ['attendance', batchId, lectureId],
    queryFn: () => teacherApi.uploadAttendanceCSV(batchId, lectureId, null),
    enabled: !!lectureId,
  });
}

export function useBatchStudents(batchId) {
  return useQuery({
    queryKey: ['batchStudents', batchId],
    queryFn: () => teacherApi.getBatchStudents(batchId),
    enabled: !!batchId,
  });
}

