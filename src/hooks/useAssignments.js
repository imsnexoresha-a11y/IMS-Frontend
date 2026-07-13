import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentApi from '../api/studentApi';

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: studentApi.getAssignments,
  });
}

export function useAssignmentDetail(id) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => studentApi.getAssignmentDetail(id),
    enabled: !!id,
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => studentApi.submitAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}
