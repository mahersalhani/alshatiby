import { useQuery } from '@tanstack/react-query';

import { useQueryState } from '../use-query-state';

import api from '@/lib/axios';

export const useEmployeeQuery = () => {
  const { query, queryString } = useQueryState();

  return useQuery({
    queryKey: ['employees', query],
    queryFn: () => api.get(`/admin/employee?${queryString}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
