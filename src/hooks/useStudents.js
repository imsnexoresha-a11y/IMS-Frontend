import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';
import * as studentApi from '../api/studentApi';
import { useAuth } from './useAuth';

export function useStudents(params = {}) {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => adminApi.getStudents(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => adminApi.getStudent(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createStudent,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['students'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useBulkUploadStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.bulkUploadStudents,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['students'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
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
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: studentApi.updateStudentProfile,
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      if (updatedData) {
        updateUser(updatedData);
      }
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.updateStudent(id, data),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['students'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['student', variables.id],
        }),
      ]);
    },
  });
}

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, profileStatus }) =>
      adminApi.updateStudentStatus(
        id,
        profileStatus
      ),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['students'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['student', variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useMoveStudentToBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newBatchId }) =>
      adminApi.moveStudentToBatch(
        id,
        newBatchId
      ),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['students'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['student', variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['batches'],
        }),
      ]);
    },
  });
}
