import axios from 'axios';

import { BACKEND_URL } from '@/constants/env';

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default api;
