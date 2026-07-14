import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import * as marksAuditApi from '../api/adminMarksAuditApi';

export function useAuditLog(
  params = {}
) {
  return useQuery({
    queryKey: [
      'auditLog',
      params,
    ],

    queryFn: () =>
      marksAuditApi.getAuditLog(
        params
      ),

    staleTime: 15 * 1000,

    retry: 1,

    placeholderData:
      (previousData) =>
        previousData,
  });
}

export function useExportAuditLog() {
  return useMutation({
    mutationFn:
      marksAuditApi.exportAuditLog,
  });
}