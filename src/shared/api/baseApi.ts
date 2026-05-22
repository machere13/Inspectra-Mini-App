import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { env } from '@shared/config';
import { tokenStore } from './tokenStore';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBase,
  prepareHeaders: headers => {
    const token = tokenStore.get();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401 && tokenStore.get()) {
    tokenStore.clear();
    window.location.reload();
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Profile', 'Weeks', 'Articles'],
  endpoints: () => ({}),
});
