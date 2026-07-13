import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';

export function useBatches(params = {}) {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => adminApi.getBatches(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useBatch(id) {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => adminApi.getBatch(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createBatch,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useUpdateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.updateBatch(id, data),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batch', variables.id],
        }),
      ]);
    },
  });
}

export function useCloseBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.closeBatch,

    onSuccess: async (_result, batchId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batch', batchId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useAssignTeachersToBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, teacherIds }) =>
      adminApi.assignTeachersToBatch(
        batchId,
        teacherIds
      ),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batch', variables.batchId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['teachers'],
        }),
      ]);
    },
  });
}

export function useBatchConfig(batchId) {
  return useQuery({
    queryKey: ['batchConfig', batchId],
    queryFn: () =>
      adminApi.getBatchConfig(batchId),
    enabled: Boolean(batchId),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useUpdateBatchConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ batchId, config }) =>
      adminApi.updateBatchConfig(
        batchId,
        config
      ),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            'batchConfig',
            variables.batchId,
          ],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
      ]);
    },
  });
}

export function useGenerateRecruiterLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.generateRecruiterLink,

    onSuccess: async (_result, batchId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batch', batchId],
        }),
      ]);
    },
  });
}

export function useRevokeRecruiterLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.revokeRecruiterLink,

    onSuccess: async (_result, batchId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batch', batchId],
        }),
      ]);
    },
  });
}