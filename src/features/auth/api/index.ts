import { ENDPOINTS, http } from '@shared/api';
import type { VkLaunchParams, VkUserProfile } from '@entities/user';
import type { VkAuthResponse, DevLoginOpts } from '../model/types';

export const vkLogin = (launch_params: VkLaunchParams, profile: VkUserProfile) =>
  http.post<VkAuthResponse>(ENDPOINTS.authVk, { body: { launch_params, profile } });

export const devLogin = (overrides: DevLoginOpts = {}) =>
  http.post<VkAuthResponse>(ENDPOINTS.authDev, { body: overrides });
