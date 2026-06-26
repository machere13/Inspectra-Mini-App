import { z } from 'zod';
import { ENDPOINTS, baseApi, injectDynamicSegments } from '@shared/api';
import { apiSuccessSchema } from '@shared/model';
import { weekSchema, type Week } from '../model/types';

const weeksListPayloadSchema = z.union([
  z.object({ weeks: z.array(weekSchema) }),
  z.array(weekSchema),
]);

const weekPayloadSchema = z.union([z.object({ week: weekSchema }), weekSchema]);

const weeksResponseSchema = apiSuccessSchema(weeksListPayloadSchema);
const weekResponseSchema = apiSuccessSchema(weekPayloadSchema);

const unwrapWeeks = (p: z.infer<typeof weeksListPayloadSchema>): Week[] =>
  Array.isArray(p) ? p : p.weeks;

const unwrapWeek = (p: z.infer<typeof weekPayloadSchema>): Week => ('week' in p ? p.week : p);

export const weekApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getWeeks: build.query<Week[], void>({
      query: () => ({ url: ENDPOINTS.weeks, method: 'GET' }),
      transformResponse: (res: unknown) => unwrapWeeks(weeksResponseSchema.parse(res).data),
      providesTags: result =>
        result
          ? [
              ...result.map(w => ({ type: 'Weeks' as const, id: w.id })),
              { type: 'Weeks' as const, id: 'LIST' },
            ]
          : [{ type: 'Weeks' as const, id: 'LIST' }],
    }),
    getWeek: build.query<Week, number | string>({
      query: id => ({
        url: injectDynamicSegments(ENDPOINTS.week, { id }),
        method: 'GET',
      }),
      transformResponse: (res: unknown) => unwrapWeek(weekResponseSchema.parse(res).data),
      providesTags: (_r, _e, id) => [{ type: 'Weeks', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeeksQuery, useGetWeekQuery } = weekApi;
