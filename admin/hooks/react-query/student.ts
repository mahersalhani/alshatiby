import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { useQueryState } from '../use-query-state';

import api from '@/lib/axios';
interface StudentQueryProps {
  search?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}
export const useStudentQuery = (props?: StudentQueryProps) => {
  const { query } = useQueryState();
  const { pagination } = props || {};

  let reqQuery = {
    ...query,
  };

  if (pagination) {
    reqQuery.pagination = {
      page: pagination.page || query.pagination?.page || 1,
      pageSize: pagination.pageSize || query.pagination?.pageSize || 20,
    };
  }

  if (props?.search) {
    reqQuery.filters = {
      user: {
        $or: [
          { name: { $containsi: props.search } },
          { phoneNumber: { $containsi: props.search } },
          { email: { $containsi: props.search } },
        ],
      },
    };
  }

  const queryString = qs.stringify(reqQuery, {
    skipNulls: true,
  });

  return useQuery({
    queryKey: ['students', reqQuery],
    queryFn: () => api.get(`/dashboard/student?${queryString}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
