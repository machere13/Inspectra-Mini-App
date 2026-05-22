export interface Title {
  id: number;
  name: string;
  description: string | null;
}

export interface TitlesBundle {
  current: Title | null;
  available: Title[];
}
