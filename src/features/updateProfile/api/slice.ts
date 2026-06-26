import { z } from 'zod';
import { themeKeySchema } from '@entities/theme';
import { ENDPOINTS, baseApi } from '@shared/api';
import { apiSuccessSchema } from '@shared/model';

const preferencesResponseSchema = z.object({
  theme: themeKeySchema,
  notifications_email: z.boolean(),
});

const selectTitleResponseSchema = z.object({
  current_title: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

const updateNameResponseSchema = z.object({
  name: z.string(),
});

const preferencesFull = apiSuccessSchema(preferencesResponseSchema);
const selectTitleFull = apiSuccessSchema(selectTitleResponseSchema);
const updateNameFull = apiSuccessSchema(updateNameResponseSchema);

interface PreferencesPatch {
  theme?: z.infer<typeof themeKeySchema>;
  notifications_email?: boolean;
}
type PreferencesResponse = z.infer<typeof preferencesResponseSchema>;
type SelectTitleResponse = z.infer<typeof selectTitleResponseSchema>;
type UpdateNameResponse = z.infer<typeof updateNameResponseSchema>;

export const updateProfileApi = baseApi.injectEndpoints({
  endpoints: build => ({
    updatePreferences: build.mutation<PreferencesResponse, PreferencesPatch>({
      query: body => ({ url: ENDPOINTS.profilePreferences, method: 'PATCH', body }),
      transformResponse: (res: unknown) => preferencesFull.parse(res).data,
      invalidatesTags: ['Profile'],
    }),
    selectTitle: build.mutation<SelectTitleResponse, number>({
      query: titleId => ({
        url: ENDPOINTS.profileTitle,
        method: 'PATCH',
        body: { title_id: titleId },
      }),
      transformResponse: (res: unknown) => selectTitleFull.parse(res).data,
      invalidatesTags: ['Profile'],
    }),
    updateName: build.mutation<UpdateNameResponse, string>({
      query: name => ({ url: ENDPOINTS.profileName, method: 'PATCH', body: { name } }),
      transformResponse: (res: unknown) => updateNameFull.parse(res).data,
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const { useUpdatePreferencesMutation, useSelectTitleMutation, useUpdateNameMutation } =
  updateProfileApi;
