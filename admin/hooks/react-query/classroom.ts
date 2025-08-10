import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { useQueryState } from '../use-query-state';

import api from '@/lib/axios';

export const useTeacherClassroomsQuery = () => {
  return useQuery({
    queryKey: ['teacher-classrooms'],
    queryFn: () => api.get(`/dashboard/teacher-classrooms`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};

interface ClassroomQueryProps {
  search?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}
export const useClassroomQuery = (props?: ClassroomQueryProps) => {
  const { query } = useQueryState();
  const { pagination, search } = props || {};

  let reqQuery = {
    ...query,
  };

  if (pagination) {
    reqQuery.pagination = {
      page: pagination.page || query.pagination?.page || 1,
      pageSize: pagination.pageSize || query.pagination?.pageSize || 20,
    };
  }

  if (search) {
    reqQuery.filters = {
      classroomName: { $containsi: search },
    };
  }

  const queryString = qs.stringify(reqQuery, {
    skipNulls: true,
  });

  return useQuery({
    queryKey: ['classrooms', reqQuery],
    queryFn: () => api.get(`/dashboard/classroom?${queryString}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
