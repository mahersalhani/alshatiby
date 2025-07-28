'use server';

import api from '@/lib/axios';

const createEmployee = async (data: any) => {
  try {
    const response = await api.post('/admin/employee', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating employee:', error.response?.data?.error?.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to create employee');
  }
};

export { createEmployee };
