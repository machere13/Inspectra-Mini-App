export type AchievementCategory =
  | 'registration'
  | 'content_viewing'
  | 'dev_diving'
  | 'legacy'
  | 'it_errors'
  | 'it_security'
  | 'general';

export interface AchievementGroup {
  key: string;
  category: AchievementCategory;
  name: string;
  description: string;
  progress: number;
  target: number;
  tiers_total: number;
  tiers_completed: number;
  all_completed: boolean;
}

export interface Badge {
  label: string;
  achievement_name: string;
}
