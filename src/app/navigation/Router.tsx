import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfilePage } from '@pages/profile';
import { SettingsPage } from '@pages/settings';
import { WeekDetailPage } from '@pages/weekDetail';
import { WeeksPage } from '@pages/weeks';
import { ROUTES } from './routes';

export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.profile} replace />} />
      <Route path={ROUTES.profile} element={<ProfilePage />} />
      <Route path={ROUTES.weeks} element={<WeeksPage />} />
      <Route path={ROUTES.weekDetail} element={<WeekDetailPage />} />
      <Route path={ROUTES.settings} element={<SettingsPage />} />
      <Route path="*" element={<Navigate to={ROUTES.profile} replace />} />
    </Routes>
  );
}
