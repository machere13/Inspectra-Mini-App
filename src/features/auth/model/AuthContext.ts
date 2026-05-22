import { createContext, useContext } from 'react';
import type { UserShort } from '@entities/user';
import type { DevLoginOpts } from './types';

export type AuthStatus = 'loading' | 'ok' | 'error' | 'dev_login';

export interface AuthContextValue {
  user: UserShort | null;
  status: AuthStatus;
  error: string | null;
  retry: () => Promise<void>;
  logout: () => void;
  devMockEnabled: boolean;
  devLogin: (opts?: DevLoginOpts) => Promise<void>;
}

export const AuthCtx = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
