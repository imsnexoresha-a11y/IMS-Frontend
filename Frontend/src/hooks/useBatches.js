import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '../api/adminApi';

export function useBatches(params = {}) {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: () => adminApi.getBatches(params),
  });
}

export function useBatch(id) {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => adminApi.getBatch(id),
    enabled: !!id,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createBatch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] }),
  });
}

export function useBatchConfig(batchId) {
  return useQuery({
    queryKey: ['batchConfig', batchId],
    queryFn: () => adminApi.getBatchConfig(batchId),
    enabled: !!batchId,
  });
}

export function useUpdateBatchConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, config }) => adminApi.updateBatchConfig(batchId, config),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['batchConfig', batchId] }),
  });
}
