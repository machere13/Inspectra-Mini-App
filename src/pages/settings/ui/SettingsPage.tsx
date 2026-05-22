import {
  Button,
  Cell,
  FormItem,
  Footer,
  Group,
  Header,
  Input,
  Panel,
  PanelHeader,
  SimpleCell,
  Spinner,
  Switch,
} from '@vkontakte/vkui';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@features/auth';
import {
  useSelectTitleMutation,
  useUpdateNameMutation,
  useUpdatePreferencesMutation,
} from '@features/updateProfile';
import { useGetProfileQuery } from '@entities/profile';
import type { ThemeKey } from '@entities/theme';

export function SettingsPage() {
  const { logout } = useAuth();
  const { data, isLoading, error } = useGetProfileQuery();

  const [updatePreferences, prefsM] = useUpdatePreferencesMutation();
  const [selectTitle, titleM] = useSelectTitleMutation();
  const [updateName, nameM] = useUpdateNameMutation();

  const [localError, setLocalError] = useState<string | null>(null);

  const busy = prefsM.isLoading || titleM.isLoading || nameM.isLoading;

  if (isLoading) {
    return (
      <Panel>
        <PanelHeader>Настройки</PanelHeader>
        <Spinner />
      </Panel>
    );
  }
  if (error || !data) {
    return (
      <Panel>
        <PanelHeader>Настройки</PanelHeader>
        <Footer>{localError ?? (error ? 'Ошибка загрузки' : 'Нет данных')}</Footer>
      </Panel>
    );
  }

  const { user, themes, titles } = data;

  const handle = (p: Promise<unknown>) => {
    p.catch((e: unknown) => {
      setLocalError(e instanceof Error ? e.message : 'Ошибка');
    });
  };

  const onSelectTheme = (k: ThemeKey) => handle(updatePreferences({ theme: k }).unwrap());
  const onToggleNotify = () =>
    handle(updatePreferences({ notifications_email: !user.notifications_email }).unwrap());
  const onSelectTitle = (id: number) => handle(selectTitle(id).unwrap());

  const onUpdateName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (new FormData(e.currentTarget).get('name') as string | null) ?? '';
    handle(updateName(name).unwrap());
  };

  return (
    <Panel>
      <PanelHeader>Настройки</PanelHeader>

      {localError && (
        <Footer style={{ color: 'var(--vkui--color_text_negative)' }}>{localError}</Footer>
      )}

      <Group header={<Header>Аккаунт</Header>}>
        <SimpleCell disabled>
          E-mail
          <div style={{ marginLeft: 'auto', opacity: 0.7 }}>{user.email ?? '—'}</div>
        </SimpleCell>
        <form onSubmit={onUpdateName}>
          <FormItem top="Имя">
            <Input name="name" defaultValue={user.name ?? ''} placeholder="Введите имя" />
          </FormItem>
          <FormItem>
            <Button type="submit" disabled={busy}>
              Сохранить имя
            </Button>
          </FormItem>
        </form>
        <SimpleCell disabled>
          Игровая роль
          <div style={{ marginLeft: 'auto', opacity: 0.7 }}>{user.game_role_label ?? '—'}</div>
        </SimpleCell>
      </Group>

      <Group header={<Header>Тема</Header>}>
        {themes.catalog.map(t => (
          <Cell
            key={t.key}
            disabled={!t.unlocked || busy}
            onClick={t.unlocked ? () => onSelectTheme(t.key) : undefined}
            indicator={themes.current === t.key ? '✓' : t.unlocked ? '' : '🔒'}
            subtitle={
              !t.unlocked && t.unlock_via ? `Открой: ${t.unlock_via.achievement_name}` : undefined
            }
          >
            {t.key}
          </Cell>
        ))}
      </Group>

      <Group header={<Header>Титулы</Header>}>
        {titles.available.length === 0 && <Footer>Пока нет открытых титулов</Footer>}
        {titles.available.map(t => (
          <Cell
            key={t.id}
            onClick={() => onSelectTitle(t.id)}
            disabled={busy}
            indicator={titles.current?.id === t.id ? '✓' : ''}
            subtitle={t.description ?? undefined}
          >
            {t.name}
          </Cell>
        ))}
      </Group>

      <Group header={<Header>Уведомления</Header>}>
        <SimpleCell
          after={
            <Switch checked={user.notifications_email} onChange={onToggleNotify} disabled={busy} />
          }
        >
          E-mail уведомления
        </SimpleCell>
      </Group>

      <Group header={<Header>Сессия</Header>}>
        <FormItem>
          <Button mode="secondary" appearance="negative" onClick={logout}>
            Выйти из аккаунта
          </Button>
        </FormItem>
      </Group>
    </Panel>
  );
}
