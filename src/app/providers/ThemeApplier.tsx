import { useEffect } from 'react';
import { useGetProfileQuery } from '@entities/profile';

export function ThemeApplier() {
  const { data } = useGetProfileQuery();
  const theme = data?.themes.current;

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    root.dataset.theme = theme;
    const timer = window.setTimeout(() => root.classList.remove('theme-transitioning'), 600);
    return () => window.clearTimeout(timer);
  }, [theme]);

  return null;
}
