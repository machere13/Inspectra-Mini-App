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
