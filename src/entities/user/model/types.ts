import type { ThemeKey } from '@entities/theme/@x/user';

export type GameRole = 'mage' | 'warrior' | 'priest' | 'hunter' | null;

export interface UserShort {
  id: number;
  email: string | null;
  game_role: GameRole;
  game_role_required: boolean;
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
  theme: ThemeKey;
  notifications_email: boolean;
  experience_points: number;
}
