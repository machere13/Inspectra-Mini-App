import { ENDPOINTS, http, injectDynamicSegments } from '@shared/api';
import type { Article } from '../model/types';

type ArticlesPayload = { articles: Article[] } | Article[];

export const fetchArticles = (weekId: number | string) =>
  http.get<ArticlesPayload>(injectDynamicSegments(ENDPOINTS.weekArticles, { id: weekId }));

export function unwrapArticles(payload: ArticlesPayload): Article[] {
  return Array.isArray(payload) ? payload : payload.articles;
}
