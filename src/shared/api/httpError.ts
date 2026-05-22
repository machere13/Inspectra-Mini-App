import type { ApiError } from '@shared/model';

export class HttpError extends Error {
  status: number;
  body: ApiError | null;

  constructor(message: string, status: number, body: ApiError | null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}
