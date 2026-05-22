export interface Article {
  id: number;
  week_id?: number;
  title: string;
  description: string | null;
  body: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}
