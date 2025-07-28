'use server';
import { cookies } from 'next/headers';

import api from '@/lib/axios';

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
  domain: process.env.HOST ?? 'localhost',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

export const loginUser = async (data: any) => {
  try {
    const user = await api.post('/auth/local', {
      identifier: data.email,
      password: data.password,
    });

    if (user.status === 200) {
      const userData = user.data;

      const cookieStore = await cookies();
      cookieStore.set('auth_token', user.data.jwt, config);

      return userData;
    }

    throw new Error('Invalid credentials');
  } catch (error: any) {
    throw new Error(error as string);
  }
};
