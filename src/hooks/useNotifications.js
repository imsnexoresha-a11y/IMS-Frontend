import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as studentApi from '../api/studentApi';

export function useNotifications(studentId) {
  return useQuery({
    queryKey: ['notifications', studentId],
    queryFn: () => studentApi.getNotifications(studentId),
    enabled: !!studentId,
  });
}

export function useMarkNotificationRead(studentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => studentApi.markNotificationRead(id, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', studentId] });
    },
  });
}

export function useMarkAllNotificationsRead(studentId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => studentApi.markAllNotificationsRead(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', studentId] });
    },
  });
}
