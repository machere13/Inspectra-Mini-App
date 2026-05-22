import type { VkLaunchParams } from '@entities/user';

export function parseLaunchParams(search: string = window.location.search): VkLaunchParams {
  const params: VkLaunchParams = {};
  const stripped = search.replace(/^\?/, '');
  if (!stripped) return params;
  for (const kv of stripped.split('&')) {
    const [k, v] = kv.split('=');
    if (k) params[decodeURIComponent(k)] = v != null ? decodeURIComponent(v) : '';
  }
  return params;
}
