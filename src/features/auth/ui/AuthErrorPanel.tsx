import { Panel, PanelHeader, Group, Placeholder, Button } from '@vkontakte/vkui';
import { useAuth } from '../model/AuthContext';

export function AuthErrorPanel() {
  const { error, retry } = useAuth();
  return (
    <Panel>
      <PanelHeader>Inspectra</PanelHeader>
      <Group>
        <Placeholder
          title="Не удалось войти"
          action={
            <Button size="m" onClick={() => void retry()}>
              Повторить
            </Button>
          }
        >
          {error ?? 'Запусти Mini App из VK, чтобы авторизоваться'}
        </Placeholder>
      </Group>
    </Panel>
  );
}
