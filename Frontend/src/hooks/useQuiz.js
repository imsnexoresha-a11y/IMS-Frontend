import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../api/teacherApi';

export function useUploadQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ batchId, lectureId, quizData }) =>
      teacherApi.uploadQuizCSV(batchId, lectureId, quizData),
    onSuccess: (_, { batchId, lectureId }) => {
      queryClient.invalidateQueries({ queryKey: ['lectures', batchId] });
      queryClient.invalidateQueries({ queryKey: ['quizResults', batchId, lectureId] });
      queryClient.invalidateQueries({ queryKey: ['batchStudents', batchId] });
    },
  });
}

export function useQuizResults(batchId, lectureId) {
  return useQuery({
    queryKey: ['quizResults', batchId, lectureId],
    queryFn: () => teacherApi.uploadQuizCSV(batchId, lectureId, null),
    enabled: !!lectureId,
  });
}

