import { ENDPOINTS, baseApi, injectDynamicSegments } from '@shared/api';
import type { ApiSuccess } from '@shared/model';
import type { Week } from '../model/types';

type WeeksPayload = { weeks: Week[] } | Week[];
type WeekPayload = { week: Week } | Week;

const unwrapWeeks = (p: WeeksPayload): Week[] => (Array.isArray(p) ? p : p.weeks);
const unwrapWeek = (p: WeekPayload): Week => ('week' in p ? p.week : p);

export const weekApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getWeeks: build.query<Week[], void>({
      query: () => ({ url: ENDPOINTS.weeks, method: 'GET' }),
      transformResponse: (res: ApiSuccess<WeeksPayload>) => unwrapWeeks(res.data),
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
      transformResponse: (res: ApiSuccess<WeekPayload>) => unwrapWeek(res.data),
      providesTags: (_r, _e, id) => [{ type: 'Weeks', id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeeksQuery, useGetWeekQuery } = weekApi;
