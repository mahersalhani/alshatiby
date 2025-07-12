'use server';
import { cookies } from 'next/headers';

export const getJwt = async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('auth_token')?.value;

  if (!jwt) throw new Error('JWT not found');

  return jwt;
};
