import { useCallback, useState, type ReactNode } from 'react';
import { AuthCtx, type AuthStatus } from '@features/auth';
import type { UserShort } from '@entities/user';
import { tokenStore } from '@shared/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialStatus: AuthStatus = tokenStore.get() ? 'ok' : 'unauthenticated';
  const [user, setUser] = useState<UserShort | null>(null);
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  const loginSuccess = useCallback((token: string, u: UserShort) => {
    tokenStore.set(token);
    setUser(u);
    setStatus('ok');
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  return (
    <AuthCtx.Provider value={{ user, status, loginSuccess, logout }}>{children}</AuthCtx.Provider>
  );
}
