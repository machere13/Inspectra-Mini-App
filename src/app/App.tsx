import { ScreenSpinner, Panel, View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useAuth } from '@app/providers';
import { Router } from '@app/navigation';
import { AuthErrorPage } from '@pages/authError';
import { BottomNav } from '@widgets/bottomNav';

export function App() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <SplitLayout>
        <SplitCol>
          <View activePanel="loading">
            <Panel id="loading">
              <ScreenSpinner state="loading" />
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    );
  }

  if (status === 'error' || status === 'dev_login') {
    return <AuthErrorPage />;
  }

  return (
    <div className="App">
      <Router />
      <BottomNav />
    </div>
  );
}
