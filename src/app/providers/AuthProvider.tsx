import bridge from '@vkontakte/vk-bridge';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  AuthCtx,
  useDevLoginMutation,
  useVkLoginMutation,
  type AuthStatus,
  type DevLoginOpts,
} from '@features/auth';
import type { UserShort } from '@entities/user';
import { tokenStore } from '@shared/api';
import { env } from '@shared/config';
import { parseLaunchParams, type VkUserProfile } from '@shared/lib';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserShort | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  const [triggerVkLogin] = useVkLoginMutation();
  const [triggerDevLogin] = useDevLoginMutation();

  const devMockEnabled = env.devMockAuth;

  const runDevLogin = useCallback(
    async (opts: DevLoginOpts = {}) => {
      setStatus('loading');
      setError(null);
      try {
        const data = await triggerDevLogin(opts).unwrap();
        tokenStore.set(data.token);
        setUser(data.user);
        setStatus('ok');
      } catch (e: unknown) {
        const message =
          (typeof e === 'object' && e !== null && 'data' in e
            ? ((e as { data?: { error?: { message?: string } } }).data?.error?.message ?? null)
            : null) ?? (e instanceof Error ? e.message : 'Dev login failed');
        setStatus('dev_login');
        setError(message);
      }
    },
    [triggerDevLogin],
  );

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
      } catch {}

      try {
        const data = await triggerVkLogin({ launch_params: launchParams, profile }).unwrap();
        tokenStore.set(data.token);
        setUser(data.user);
        setStatus('ok');
      } catch (e: unknown) {
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
  }, [devMockEnabled, triggerVkLogin]);

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
