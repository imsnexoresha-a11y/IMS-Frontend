import { useQuery } from '@tanstack/react-query';
import * as studentApi from '../api/studentApi';
import * as recruiterApi from '../api/recruiterApi';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: studentApi.getPortfolio,
  });
}

export function useStudentPortfolio(batchUuid, studentId) {
  return useQuery({
    queryKey: ['recruiterStudentPortfolio', batchUuid, studentId],
    queryFn: () => recruiterApi.getStudentPortfolio(batchUuid, studentId),
    enabled: !!batchUuid && !!studentId,
  });
}
