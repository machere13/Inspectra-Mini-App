import { ENDPOINTS, baseApi } from '@shared/api';
import { apiSuccessSchema } from '@shared/model';
import { profileBundleSchema, type ProfileBundle } from '../model/types';

const profileResponseSchema = apiSuccessSchema(profileBundleSchema);

export const profileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getProfile: build.query<ProfileBundle, void>({
      query: () => ({ url: ENDPOINTS.profile, method: 'GET' }),
      transformResponse: (res: unknown) => profileResponseSchema.parse(res).data,
      providesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProfileQuery } = profileApi;
