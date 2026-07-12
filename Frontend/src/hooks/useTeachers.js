import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminApi from '../api/adminApi';
import * as teacherApi from '../api/teacherApi';


export function useTeachers(params = {}) {
  return useQuery({
    queryKey: ['teachers', params],
    queryFn: () => adminApi.getTeachers(params),
  });
}

export function useTeacher(id) {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => adminApi.getTeacher(id),
    enabled: !!id,
  });
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminApi.updateTeacher(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminApi.deleteTeacher,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teachers'] }),
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

