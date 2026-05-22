import { ENDPOINTS, http } from '@shared/api';
import type { ProfileBundle } from '../model/types';

export const fetchProfile = () => http.get<ProfileBundle>(ENDPOINTS.profile);
