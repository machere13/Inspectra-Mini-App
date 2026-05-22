import type { User } from '@entities/user';
import type { ThemesBundle } from '@entities/theme';
import type { TitlesBundle } from '@entities/title';
import type { AchievementGroup, Badge } from '@entities/achievement';

export interface LevelInfo {
  number: number;
  name: string;
  required_xp: number;
}

export interface ProgressBundle {
  level: LevelInfo | null;
  next_level: LevelInfo | null;
  level_progress_percent: number;
}

export interface SkillChartRow {
  key: string;
  label: string;
  percent: number;
  done: number;
  total: number;
}

export interface ProfileBundle {
  user: User;
  progress: ProgressBundle;
  skill_chart: SkillChartRow[];
  achievements: AchievementGroup[];
  titles: TitlesBundle;
  themes: ThemesBundle;
  badges: Badge[];
}
