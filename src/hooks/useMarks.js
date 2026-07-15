import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as marksAuditApi from '../api/adminMarksAuditApi';
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
      queryKey: ['markOverrides'],
    }),

    queryClient.invalidateQueries({
      queryKey: ['studentDashboard'],
    }),

    queryClient.invalidateQueries({
      queryKey: ['marksHistory'],
    }),
  ]);
}

export function useCreateMarkOverride() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      marksAuditApi.createMarkOverride,

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useCorrectLedgerEvent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      marksAuditApi.correctLedgerEvent,

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useCreateManualScore() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      marksAuditApi.createManualScore,

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useRecalculateStudent() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      reason,
    }) =>
      marksAuditApi.recalculateStudent(
        studentId,
        reason
      ),

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useRecalculateBatch() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      batchId,
      reason,
    }) =>
      marksAuditApi.recalculateBatch(
        batchId,
        reason
      ),

    onSuccess: () =>
      invalidateMarkData(queryClient),
  });
}

export function useMarksHistory(
  params = {}
) {
  return useQuery({
    queryKey: [
      'marksHistory',
      params,
    ],

    queryFn: () =>
      studentApi.getMarksHistory(
        params
      ),

    staleTime: 30 * 1000,

    retry: 1,
  });
}

export function useMarkOverrides(
  params = {}
) {
  return useQuery({
    queryKey: [
      'markOverrides',
      params,
    ],

    queryFn: () =>
      marksAuditApi.getMarkOverrides(
        params
      ),

    staleTime: 15 * 1000,

    retry: 1,
  });
}