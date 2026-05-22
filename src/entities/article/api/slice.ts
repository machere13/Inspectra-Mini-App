import { ENDPOINTS, baseApi, injectDynamicSegments } from '@shared/api';
import type { ApiSuccess } from '@shared/model';
import type { Article } from '../model/types';

type ArticlesPayload = { articles: Article[] } | Article[];
const unwrap = (p: ArticlesPayload): Article[] => (Array.isArray(p) ? p : p.articles);

export const articleApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getWeekArticles: build.query<Article[], number | string>({
      query: weekId => ({
        url: injectDynamicSegments(ENDPOINTS.weekArticles, { id: weekId }),
        method: 'GET',
      }),
      transformResponse: (res: ApiSuccess<ArticlesPayload>) => unwrap(res.data),
      providesTags: (_r, _e, weekId) => [{ type: 'Articles', id: weekId }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeekArticlesQuery } = articleApi;
