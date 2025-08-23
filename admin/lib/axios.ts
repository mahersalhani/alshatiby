import axios from 'axios';

import { getJwt } from './jwt';

import { BACKEND_URL } from '@/constants/env';

// const api = axios.create({
//   baseURL: BACKEND_URL,
// });

// export const configureAxios = async () => {
//   try {
//     const jwt = await getJwt();
//     api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
//   } catch (error) {}
// };

// configureAxios();

// export default api;

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
    });
    // this.setAuthHeader();
  }

  private async setAuthHeader() {
    try {
      const jwt = await getJwt();
      this.api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    } catch (error) {
      console.error('Error setting auth header:', error);
    }
  }

  public getInstance() {
    return this.api;
  }

  public async get<T>(url: string, config = {}) {
    await this.setAuthHeader();
    return this.api.get<T>(url, config);
  }

  public async post<T>(url: string, data: any, config = {}) {
    await this.setAuthHeader();
    return this.api.post<T>(url, data, config);
  }

  public async put<T>(url: string, data: any, config = {}) {
    await this.setAuthHeader();
    return this.api.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config = {}) {
    await this.setAuthHeader();
    return this.api.delete<T>(url, config);
  }
}

const api = new ApiService();
export default api;
