import { ENDPOINTS, baseApi } from '@shared/api';
import type { VkLaunchParams, VkUserProfile } from '@shared/lib';
import type { ApiSuccess } from '@shared/model';
import type { DevLoginOpts, VkAuthResponse } from '../model/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: build => ({
    vkLogin: build.mutation<
      VkAuthResponse,
      { launch_params: VkLaunchParams; profile: VkUserProfile }
    >({
      query: body => ({ url: ENDPOINTS.authVk, method: 'POST', body }),
      transformResponse: (res: ApiSuccess<VkAuthResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
    devLogin: build.mutation<VkAuthResponse, DevLoginOpts | void>({
      query: opts => ({ url: ENDPOINTS.authDev, method: 'POST', body: opts ?? {} }),
      transformResponse: (res: ApiSuccess<VkAuthResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const { useVkLoginMutation, useDevLoginMutation } = authApi;
