import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../api/teacherApi';

export function useTopics(batchId) {
  return useQuery({
    queryKey: ['topics', batchId],
    queryFn: () => teacherApi.getTopics(batchId),
    enabled: !!batchId,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, data }) => teacherApi.createTopic(batchId, data),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}

export function useReorderTopics() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, orderedIds }) => teacherApi.reorderTopics(batchId, orderedIds),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, topicId, data }) => teacherApi.updateTopic(batchId, topicId, data),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, topicId }) => teacherApi.deleteTopic(batchId, topicId),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}
export function useUploadTopicNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, topicId, formData }) => teacherApi.uploadTopicNotes(batchId, topicId, formData),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}

export function useDeleteTopicNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, topicId, fileId }) => teacherApi.deleteTopicNote(batchId, topicId, fileId),
    onSuccess: (_, { batchId }) => queryClient.invalidateQueries({ queryKey: ['topics', batchId] }),
  });
}
