import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import api from '@/lib/axios';
import type { PaginatedResponse, Employee } from '@/lib/type';

export function useEmployees() {
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
    queryKey: ['employees', queryString],
    queryFn: () => api.get<PaginatedResponse<Employee>>(`/dashboard/employee?${queryString}`).then((res) => res.data),
  });
}
