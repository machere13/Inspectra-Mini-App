import { createContext, useContext } from 'react';
import type { UserShort } from '@entities/user';

export type AuthStatus = 'loading' | 'ok' | 'unauthenticated';

export interface AuthContextValue {
  user: UserShort | null;
  status: AuthStatus;
  loginSuccess: (token: string, user: UserShort) => void;
  logout: () => void;
}

export const AuthCtx = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
