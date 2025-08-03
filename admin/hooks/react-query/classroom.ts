import { useQuery } from '@tanstack/react-query';

import api from '@/lib/axios';

export const useTeacherClassroomsQuery = () => {
  return useQuery({
    queryKey: ['teacher-classrooms'],
    queryFn: () => api.get(`/dashboard/teacher-classrooms`).then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
};
