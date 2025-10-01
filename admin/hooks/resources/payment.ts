import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { usePaginationState, useSearchState } from '@/hooks/use-query-state';
import api from '@/lib/axios';
import type { PaginatedResponse } from '@/lib/type';
import type { Payment } from '@/lib/schemas/payment';

export function usePayments() {
  const { searchText } = useSearchState();
  const { pageParams } = usePaginationState();

  const queryString = qs.stringify({
    pagination: pageParams,
  }, { skipNulls: true });  

  return useQuery({
    queryKey: ['payments', queryString],
    queryFn: () => api.get<PaginatedResponse<Payment>>(`/dashboard/payment?${queryString}`).then((res) => res.data),
  });
}
