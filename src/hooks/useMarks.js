import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';
import * as studentApi from '../api/studentApi';

function invalidateMarkData(queryClient) {
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: ['students'],
    }),
    queryClient.invalidateQueries({
      queryKey: ['adminDashboard'],
    }),
    queryClient.invalidateQueries({
      queryKey: ['auditLog'],
    }),
    queryClient.invalidateQueries({
      queryKey: ['studentDashboard'],
    }),
  ]);
}

export function useCreateMarkOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createMarkOverride,
    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useCorrectLedgerEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.correctLedgerEvent,
    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useCreateManualScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createManualScore,
    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useRecalculateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, reason }) =>
      adminApi.recalculateStudent(
        studentId,
        reason
      ),

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useRecalculateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, reason }) =>
      adminApi.recalculateBatch(
        batchId,
        reason
      ),

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useMarksHistory(params = {}) {
  return useQuery({
    queryKey: ['marksHistory', params],
    queryFn: () => studentApi.getMarksHistory(params),
  });
}

export function useMarkOverrides(params = {}) {
  return useQuery({
    queryKey: ['markOverrides', params],
    queryFn: () => adminApi.getMarkOverrides(params),
  });
}