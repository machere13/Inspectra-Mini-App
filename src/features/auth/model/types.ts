import type { UserShort } from '@entities/user';

export interface VkAuthResponse {
  token: string;
  new_user: boolean;
  user: UserShort;
}

export interface DevLoginOpts {
  email?: string;
  vk_user_id?: number;
}
