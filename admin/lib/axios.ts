import axios from 'axios';

import { getJwt } from './jwt';

import { BACKEND_URL } from '@/constants/env';

const api = axios.create({
  baseURL: BACKEND_URL,
});

export const configureAxios = async () => {
  try {
    const jwt = await getJwt();
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  } catch (error) {}
};

configureAxios();

export default api;
