import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';
import * as teacherApi from '../api/teacherApi';

export function useTeachers(params = {}) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => adminApi.getTeachers(params),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.createTeacher,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['teachers'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      adminApi.updateTeacher(id, data),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['teachers'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['teacher', variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useUpdateTeacherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }) =>
      adminApi.updateTeacherStatus(id, active),

    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['teachers'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['teacher', variables.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}

export function useTeacherProfile() {
  return useQuery({
    queryKey: ['teacherProfile'],
    queryFn: () => teacherApi.getTeacherProfile(),
  });
}

export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => teacherApi.updateTeacherProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacherProfile'] }),
  });
}

/*
 * Compatibility hook for the current page.
 *
 * The backend/handbook does not define DELETE /admin/teachers/:id.
 * Calling this hook marks the teacher inactive instead.
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      adminApi.updateTeacherStatus(id, false),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['teachers'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['adminDashboard'],
        }),
      ]);
    },
  });
}
