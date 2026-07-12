import { useQuery, useMutation } from '@tanstack/react-query';
import * as adminApi from '../api/adminApi';

export function useAuditLog(params = {}) {
  return useQuery({
    queryKey: ['auditLog', params],
    queryFn: () => adminApi.getAuditLog(params),
  });
}

export function useExportAuditLog() {
  return useMutation({
    mutationFn: adminApi.exportAuditLog,
  });
}
