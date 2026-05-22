export const ROUTES = {
  root: '/',
  profile: '/profile',
  weeks: '/weeks',
  weekDetail: '/weeks/:id',
  articleDetail: '/weeks/:weekId/articles/:articleId',
  settings: '/settings',
} as const;

export const articlePath = (weekId: number | string, articleId: number | string) =>
  `/weeks/${weekId}/articles/${articleId}`;
