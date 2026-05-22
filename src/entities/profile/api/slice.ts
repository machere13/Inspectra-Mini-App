import { ENDPOINTS, baseApi } from '@shared/api';
import type { ApiSuccess } from '@shared/model';
import type { ProfileBundle } from '../model/types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<ProfileBundle, void>({
      query: () => ({ url: ENDPOINTS.profile, method: 'GET' }),
      transformResponse: (res: ApiSuccess<ProfileBundle>) => res.data,
      providesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery } = profileApi;
