import type { ThemeKey } from '@entities/theme';
import { ENDPOINTS, baseApi } from '@shared/api';
import type { ApiSuccess } from '@shared/model';

interface PreferencesPatch {
  theme?: ThemeKey;
  notifications_email?: boolean;
}

interface PreferencesResponse {
  theme: ThemeKey;
  notifications_email: boolean;
}

interface SelectTitleResponse {
  current_title: { id: number; name: string };
}

interface UpdateNameResponse {
  name: string;
}

export const updateProfileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updatePreferences: build.mutation<PreferencesResponse, PreferencesPatch>({
      query: body => ({ url: ENDPOINTS.profilePreferences, method: 'PATCH', body }),
      transformResponse: (res: ApiSuccess<PreferencesResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
    selectTitle: build.mutation<SelectTitleResponse, number>({
      query: titleId => ({
        url: ENDPOINTS.profileTitle,
        method: 'PATCH',
        body: { title_id: titleId },
      }),
      transformResponse: (res: ApiSuccess<SelectTitleResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
    updateName: build.mutation<UpdateNameResponse, string>({
      query: name => ({ url: ENDPOINTS.profileName, method: 'PATCH', body: { name } }),
      transformResponse: (res: ApiSuccess<UpdateNameResponse>) => res.data,
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdatePreferencesMutation, useSelectTitleMutation, useUpdateNameMutation } =
  updateProfileApi;
