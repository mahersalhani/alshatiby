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
    console.log('loginUser:', process.env.NEXT_PUBLIC_BACKEND_URL);

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

    console.log('Login failed:', process.env.NEXT_PUBLIC_BACKEND_URL);

    throw new Error('Invalid credentials');
  } catch (error) {
    throw new Error(error as string);
  }
};
