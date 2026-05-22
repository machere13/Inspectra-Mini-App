// Базовые обёртки API-ответов (одинаковые для всех слоёв).

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: { code: string; message: string; details?: string[] };
}
