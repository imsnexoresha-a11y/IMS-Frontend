import { useQuery } from '@tanstack/react-query';

import * as adminApi from '../api/adminApi';
import * as studentApi from '../api/studentApi';
import * as teacherApi from '../api/teacherApi';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminApi.getDashboardStats,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useTeacherDashboard() {
  return useQuery({
    queryKey: ['teacherDashboard'],
    queryFn: teacherApi.getTeacherBatches,
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function useTeacherDashboardStats() {
  return useQuery({
    queryKey: ['teacherDashboardStats'],
    queryFn: teacherApi.getTeacherDashboardStats,
  });
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: studentApi.getStudentDashboard,
    staleTime: 30 * 1000,
    retry: 1,
  });
}