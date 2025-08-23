import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import api from '@/lib/axios';
import type { PaginatedResponse, Classroom } from '@/lib/type';

export function useClassrooms() {
  const { searchText } = useSearchState();
  const { pageParams } = usePaginationState();

  const queryString = qs.stringify({
    pagination: pageParams,
    filters: searchText
      ? {
          classroomName: { $containsi: searchText },
        }
      : null,
  }, { skipNulls: true });

  return useQuery({
    queryKey: ['classrooms', queryString],
    queryFn: () => api.get<PaginatedResponse<Classroom>>(`/dashboard/classroom?${queryString}`).then((res) => res.data),
  });
}

export function useTeacherClassrooms() {
  return useQuery({
    queryKey: ['teacher-classrooms'],
    queryFn: () => api.get(`/dashboard/teacher-classrooms`).then((res) => res.data),
  });
}
