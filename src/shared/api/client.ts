import { env } from '@shared/config';
import type { ApiSuccess, ApiError } from '@shared/model';
import { HttpError } from './httpError';
import { tokenStore } from './tokenStore';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
}

async function request<T>(
  method: Method,
  path: string,
  opts: RequestOptions = {},
): Promise<ApiSuccess<T>> {
  const url = new URL(env.apiBase + path);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v != null) url.searchParams.append(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    credentials: 'omit',
  });

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const body = json && typeof json === 'object' && 'success' in json ? (json as ApiError) : null;
    throw new HttpError(body?.error?.message ?? `HTTP ${res.status}`, res.status, body);
  }

  return json as ApiSuccess<T>;
}

export const http = {
  get: <T>(p: string, o?: RequestOptions): Promise<ApiSuccess<T>> => request<T>('GET', p, o),
  post: <T>(p: string, o?: RequestOptions): Promise<ApiSuccess<T>> => request<T>('POST', p, o),
  patch: <T>(p: string, o?: RequestOptions): Promise<ApiSuccess<T>> => request<T>('PATCH', p, o),
  put: <T>(p: string, o?: RequestOptions): Promise<ApiSuccess<T>> => request<T>('PUT', p, o),
  delete: <T>(p: string, o?: RequestOptions): Promise<ApiSuccess<T>> => request<T>('DELETE', p, o),
};
