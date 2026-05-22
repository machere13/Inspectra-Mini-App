export type GameRole = 'mage' | 'warrior' | 'priest' | 'hunter' | null;

export interface VkLaunchParams {
  vk_user_id?: string;
  vk_app_id?: string;
  vk_is_app_user?: string;
  vk_are_notifications_enabled?: string;
  vk_language?: string;
  vk_ref?: string;
  vk_access_token_settings?: string;
  vk_group_id?: string;
  vk_viewer_group_role?: string;
  vk_platform?: string;
  vk_ts?: string;
  sign?: string;
  [key: string]: string | undefined;
}

export interface VkUserProfile {
  first_name?: string;
  last_name?: string;
  photo_200?: string;
}

export interface UserShort {
  id: number;
  email: string | null;
  name: string | null;
  vk_user_id: number | null;
  vk_avatar_url: string | null;
  game_role: GameRole;
  game_role_required: boolean;
  theme: import('@entities/theme').ThemeKey | null;
  experience_points: number;
}

export interface User {
  id: number;
  email: string | null;
  name: string | null;
  vk_user_id: number | null;
  vk_avatar_url: string | null;
  avatar_url: string | null;
  game_role: GameRole;
  game_role_label: string | null;
  game_role_required: boolean;
  theme: import('@entities/theme').ThemeKey;
  notifications_email: boolean;
  experience_points: number;
}
