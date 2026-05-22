import { Router } from '@app/navigation';
import { ThemeApplier } from '@app/providers';
import { AuthErrorPage } from '@pages/authError';
import { BottomNav } from '@widgets/bottomNav';
import { useAuth } from '@features/auth';
import styles from './App.module.css';

export function App() {
  const { status } = useAuth();

  if (status === 'unauthenticated') {
    return <AuthErrorPage />;
  }

  return (
    <div className={styles.app}>
      <ThemeApplier />
      <Router />
      <BottomNav />
    </div>
  );
}
