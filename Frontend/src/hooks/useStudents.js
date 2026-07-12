import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '../api/adminApi';
import * as studentApi from '../api/studentApi';

export function useStudents(params = {}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => adminApi.getStudents(params),
  });
}

export function useBulkUploadStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.bulkUploadStudents,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: ['studentProfile'],
    queryFn: studentApi.getStudentProfile,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentApi.updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
    },
  });
}
