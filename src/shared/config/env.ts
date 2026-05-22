export const env = {
  apiBase: (import.meta.env.VITE_API_BASE as string | undefined) ?? 'http://localhost:3000/api/v1',
  devMockAuth: (import.meta.env.VITE_DEV_MOCK_AUTH as string | undefined) === 'true',
  publicUrl: import.meta.env.VITE_PUBLIC_URL as string | undefined,
} as const;
