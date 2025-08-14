import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { useQueryState } from '../use-query-state';

import api from '@/lib/axios';
interface EmployeeQueryProps {
  search?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}
export const useEmployeeQuery = (props?: EmployeeQueryProps) => {
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
      user: {
        $or: [
          { name: { $containsi: search } },
          { phoneNumber: { $containsi: search } },
          { email: { $containsi: search } },
        ],
      },
    };
  }

  const queryString = qs.stringify(reqQuery, {
    skipNulls: true,
  });

  return useQuery({
    queryKey: ['employees', reqQuery],
    queryFn: () => api.get(`/dashboard/employee?${queryString}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
