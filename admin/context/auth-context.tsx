'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

interface State {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with your user type
  session: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
  user: any; // Replace 'any' with your user type
  session: string | null;
}

const initialState: State = {
  user: null,
  isAuthenticated: false,
  session: null,
};

export const AuthContext = createContext<State>({
  ...initialState,
});

export function AuthProvider(props: AuthProviderProps) {
  const { children, user, session } = props;

  // TODO get the current channels and assign the permissions
  // const userAuthority = user?.channels[0].permissions || [];

  const value: State = {
    user: user,
    session,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): State => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
};
