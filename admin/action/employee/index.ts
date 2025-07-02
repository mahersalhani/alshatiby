'use server';

import api from '@/lib/axios';

const createEmployee = async (data: any) => {
  const response = await api.post('/admin/employee', data);
  return response.data;
};

export { createEmployee };
