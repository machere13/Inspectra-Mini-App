import { ENDPOINTS, http, injectDynamicSegments } from '@shared/api';
import type { Week } from '../model/types';

type WeeksPayload = { weeks: Week[] } | Week[];
type WeekPayload = { week: Week } | Week;

export const fetchWeeks = () => http.get<WeeksPayload>(ENDPOINTS.weeks);

export const fetchWeek = (id: number | string) =>
  http.get<WeekPayload>(injectDynamicSegments(ENDPOINTS.week, { id }));

export function unwrapWeeks(payload: WeeksPayload): Week[] {
  return Array.isArray(payload) ? payload : payload.weeks;
}

export function unwrapWeek(payload: WeekPayload): Week {
  return 'week' in payload ? payload.week : payload;
}
