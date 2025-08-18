import { useQuery } from '@tanstack/react-query';
import qs from 'qs';

import { useQueryState } from '../use-query-state';

import api from '@/lib/axios';

interface ProgramQueryProps {
  search?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}

export const useProgramQuery = (props?: ProgramQueryProps) => {
  const { query } = useQueryState();
  const { pagination, search } = props || {};

  let reqQuery: any = {
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
      name: { $containsi: search },
    };
  }

  const queryString = qs.stringify(reqQuery, {
    skipNulls: true,
  });

  return useQuery({
    queryKey: ['programs', reqQuery],
    queryFn: () => api.get(`/dashboard/program?${queryString}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}; 
