import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import api from '@/lib/axios';
import type { PaginatedResponse, Program } from '@/lib/type';

export function usePrograms() {
  const { searchText } = useSearchState();
  const { pageParams } = usePaginationState();

  const queryString = qs.stringify({
    pagination: pageParams,
    filters: searchText
      ? {
          name: { $containsi: searchText },
        }
      : null,
  }, { skipNulls: true });

  return useQuery({
    queryKey: ['programs', queryString],
    queryFn: () => api.get<PaginatedResponse<Program>>(`/dashboard/program?${queryString}`).then((res) => res.data),
  });
}
