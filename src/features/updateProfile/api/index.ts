import { ENDPOINTS, http } from '@shared/api';
import type { ThemeKey } from '@entities/theme';

export const updatePreferences = (attrs: { theme?: ThemeKey; notifications_email?: boolean }) =>
  http.patch<{ theme: ThemeKey; notifications_email: boolean }>(ENDPOINTS.profilePreferences, {
    body: attrs,
  });

export const selectTitle = (titleId: number) =>
  http.patch<{ current_title: { id: number; name: string } }>(ENDPOINTS.profileTitle, {
    body: { title_id: titleId },
  });

export const updateName = (name: string) =>
  http.patch<{ name: string }>(ENDPOINTS.profileName, { body: { name } });
