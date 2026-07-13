import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';

export function useAuditLog(params = {}) {
  return useQuery({
    queryKey: ['auditLog', params],
    queryFn: () => adminApi.getAuditLog(params),
    staleTime: 15 * 1000,
    retry: 1,
  });
}

export function useExportAuditLog() {
  return useMutation({
    mutationFn: adminApi.exportAuditLog,
  });
}