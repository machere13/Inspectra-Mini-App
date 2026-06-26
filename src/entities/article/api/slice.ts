import { z } from 'zod';
import { ENDPOINTS, baseApi, injectDynamicSegments } from '@shared/api';
import { apiSuccessSchema } from '@shared/model';
import { articleSchema, type Article } from '../model/types';

const articlesListPayloadSchema = z.union([
  z.object({ articles: z.array(articleSchema) }),
  z.array(articleSchema),
]);

const articlePayloadSchema = z.union([z.object({ article: articleSchema }), articleSchema]);

const articlesResponseSchema = apiSuccessSchema(articlesListPayloadSchema);
const articleResponseSchema = apiSuccessSchema(articlePayloadSchema);

const unwrapList = (p: z.infer<typeof articlesListPayloadSchema>): Article[] =>
  Array.isArray(p) ? p : p.articles;

const unwrapOne = (p: z.infer<typeof articlePayloadSchema>): Article =>
  'article' in p ? p.article : p;

export const articleApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getWeekArticles: build.query<Article[], number | string>({
      query: weekId => ({
        url: injectDynamicSegments(ENDPOINTS.weekArticles, { weekId }),
        method: 'GET',
      }),
      transformResponse: (res: unknown) => unwrapList(articlesResponseSchema.parse(res).data),
      providesTags: (_r, _e, weekId) => [{ type: 'Articles', id: weekId }],
    }),
    getArticle: build.query<Article, { weekId: number | string; id: number | string }>({
      query: ({ weekId, id }) => ({
        url: injectDynamicSegments(ENDPOINTS.article, { weekId, id }),
        method: 'GET',
      }),
      transformResponse: (res: unknown) => unwrapOne(articleResponseSchema.parse(res).data),
      providesTags: (_r, _e, { weekId, id }) => [{ type: 'Articles', id: `${weekId}/${id}` }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeekArticlesQuery, useGetArticleQuery } = articleApi;
