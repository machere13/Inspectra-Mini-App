import { ENDPOINTS, baseApi, injectDynamicSegments } from '@shared/api';
import type { ApiSuccess } from '@shared/model';
import type { Article } from '../model/types';

type ArticlesPayload = { articles: Article[] } | Article[];
type ArticlePayload = { article: Article } | Article;

const unwrapList = (p: ArticlesPayload): Article[] => (Array.isArray(p) ? p : p.articles);
const unwrapOne = (p: ArticlePayload): Article => ('article' in p ? p.article : p);

export const articleApi = baseApi.injectEndpoints({
  endpoints: build => ({
    getWeekArticles: build.query<Article[], number | string>({
      query: weekId => ({
        url: injectDynamicSegments(ENDPOINTS.weekArticles, { weekId }),
        method: 'GET',
      }),
      transformResponse: (res: ApiSuccess<ArticlesPayload>) => unwrapList(res.data),
      providesTags: (_r, _e, weekId) => [{ type: 'Articles', id: weekId }],
    }),
    getArticle: build.query<Article, { weekId: number | string; id: number | string }>({
      query: ({ weekId, id }) => ({
        url: injectDynamicSegments(ENDPOINTS.article, { weekId, id }),
        method: 'GET',
      }),
      transformResponse: (res: ApiSuccess<ArticlePayload>) => unwrapOne(res.data),
      providesTags: (_r, _e, { weekId, id }) => [{ type: 'Articles', id: `${weekId}/${id}` }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetWeekArticlesQuery, useGetArticleQuery } = articleApi;
