import { useAuth, AuthErrorPanel, DevLoginForm } from '@features/auth';

export function AuthErrorPage() {
  const { devMockEnabled } = useAuth();
  return devMockEnabled ? <DevLoginForm /> : <AuthErrorPanel />;
}
