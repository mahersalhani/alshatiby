import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import api from '@/lib/axios';
import type { PaginatedResponse, Student } from '@/lib/type';

export function useStudents() {
  const { searchText } = useSearchState();
  const { pageParams } = usePaginationState();

  const queryString = qs.stringify({
    pagination: pageParams,
    filters: searchText
      ? {
        user: {
          $or: [
            { name: { $containsi: searchText } },
            { phoneNumber: { $containsi: searchText } },
            { email: { $containsi: searchText } },
          ],
        },
      }
      : null,
  }, { skipNulls: true });

  return useQuery({
    queryKey: ['students', queryString],
    queryFn: () => api.get<PaginatedResponse<Student>>(`/dashboard/student?${queryString}`).then((res) => res.data),
  });
}
