import { Router } from '@app/navigation';
import { AuthErrorPage } from '@pages/authError';
import { BottomNav } from '@widgets/bottomNav';
import { useAuth } from '@features/auth';

export function App() {
  const { status } = useAuth();

  if (status === 'unauthenticated') {
    return <AuthErrorPage />;
  }

  return (
    <div className="App">
      <Router />
      <BottomNav />
    </div>
  );
}
