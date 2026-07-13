import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../api/teacherApi';

export function useLectures(batchId) {
  return useQuery({
    queryKey: ['lectures', batchId],
    queryFn: () => teacherApi.getLectures(batchId),
    enabled: !!batchId,
  });
}

export function useCreateLecture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, data }) => teacherApi.createLecture(batchId, data),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['lectures', batchId] }),
  });
}

export function useUpdateLectureStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, lectureId, status }) => teacherApi.updateLectureStatus(batchId, lectureId, status),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['lectures', batchId] }),
  });
}

export function useUpdateLecture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, lectureId, data }) => teacherApi.updateLecture(batchId, lectureId, data),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['lectures', batchId] }),
  });
}

export function useDeleteLecture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, lectureId }) => teacherApi.deleteLecture(batchId, lectureId),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['lectures', batchId] }),
  });
}

export function useLectureSummary(batchId, lectureId) {
  return useQuery({
    queryKey: ['lectureSummary', batchId, lectureId],
    queryFn: () => teacherApi.getLectureSummary(batchId, lectureId),
    enabled: !!batchId && !!lectureId,
  });
}

