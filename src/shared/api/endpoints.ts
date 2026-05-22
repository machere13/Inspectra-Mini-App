export const ENDPOINTS = {
  authVk: '/auth/vk',
  authDev: '/auth/dev',

  profile: '/profile',
  profilePreferences: '/profile/preferences',
  profileTitle: '/profile/title',
  profileName: '/profile/name',

  weeks: '/weeks',
  week: '/weeks/{id}',
  weekArticles: '/weeks/{id}/articles',
} as const;

export type EndpointTemplate = (typeof ENDPOINTS)[keyof typeof ENDPOINTS];

export function injectDynamicSegments(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = params[key];
    if (v == null) throw new Error(`Missing param '${key}' for ${template}`);
    return String(v);
  });
}
