import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { env } from '@shared/config';
import { tokenStore } from '@shared/api';
import { parseLaunchParams } from '@shared/lib';
import type { UserShort, VkUserProfile } from '@entities/user';
import { vkLogin, devLogin, type DevLoginOpts } from '@features/auth';

type Status = 'loading' | 'ok' | 'error' | 'dev_login';

interface AuthContextValue {
  user: UserShort | null;
  status: Status;
  error: string | null;
  retry: () => Promise<void>;
  logout: () => void;
  devMockEnabled: boolean;
  devLogin: (opts?: DevLoginOpts) => Promise<void>;
}

const AuthCtx = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserShort | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);

  const devMockEnabled = env.devMockAuth;

  const runDevLogin = useCallback(async (opts: DevLoginOpts = {}) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await devLogin(opts);
      tokenStore.set(res.data.token);
      setUser(res.data.user);
      setStatus('ok');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Dev login failed';
      setStatus('dev_login');
      setError(message);
    }
  }, []);

  const authenticate = useCallback(async () => {
    setStatus('loading');
    setError(null);

    const launchParams = parseLaunchParams();

    if (launchParams.vk_user_id && launchParams.sign) {
      let profile: VkUserProfile = {};
      try {
        const userInfo = await bridge.send('VKWebAppGetUserInfo');
        profile = {
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          photo_200: userInfo.photo_200,
        };
      } catch {
        /* не критично */
      }

      try {
        const res = await vkLogin(launchParams, profile);
        tokenStore.set(res.data.token);
        setUser(res.data.user);
        setStatus('ok');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Ошибка авторизации';
        setStatus('error');
        setError(message);
      }
      return;
    }

    if (tokenStore.get()) {
      setStatus('ok');
      return;
    }

    if (devMockEnabled) {
      setStatus('dev_login');
      return;
    }

    setStatus('error');
    setError('Запусти из VK Mini App');
  }, [devMockEnabled]);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    if (devMockEnabled) {
      setStatus('dev_login');
    } else {
      setStatus('error');
      setError('Logged out');
    }
  }, [devMockEnabled]);

  return (
    <AuthCtx.Provider
      value={{
        user,
        status,
        error,
        retry: authenticate,
        logout,
        devMockEnabled,
        devLogin: runDevLogin,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
