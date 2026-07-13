import { useQuery } from '@tanstack/react-query';
import * as metricsApi from '../api/metricsApi';

export function useStudentMetrics(studentId) {
  return useQuery({
    queryKey: ['studentMetrics', studentId],
    queryFn: () => metricsApi.getStudentMetrics(studentId),
    enabled: !!studentId,
  });
}

export function useBatchMetrics(batchUuid) {
  return useQuery({
    queryKey: ['batchMetrics', batchUuid],
    queryFn: () => metricsApi.getBatchMetrics(batchUuid),
    enabled: !!batchUuid,
  });
}
