import { useAuth } from '@app/providers';
import { AuthErrorPanel, DevLoginForm } from '@features/auth';

export function AuthErrorPage() {
  const { devMockEnabled } = useAuth();
  return devMockEnabled ? <DevLoginForm /> : <AuthErrorPanel />;
}
