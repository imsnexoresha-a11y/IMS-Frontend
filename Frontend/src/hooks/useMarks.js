import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentApi from '../api/studentApi';
import * as adminApi from '../api/adminApi';

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

export function useCreateMarkOverride() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createMarkOverride,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markOverrides'] });
      queryClient.invalidateQueries({ queryKey: ['marksHistory'] });
    },
  });
}
