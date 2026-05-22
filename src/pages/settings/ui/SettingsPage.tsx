import { useEffect, useState, type FormEvent } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  Cell,
  Spinner,
  Switch,
  Footer,
  Button,
  SimpleCell,
  FormItem,
  Input,
} from '@vkontakte/vkui';
import { useAuth } from '@app/providers';
import { fetchProfile, type ProfileBundle } from '@entities/profile';
import type { ThemeKey } from '@entities/theme';
import { updatePreferences, selectTitle, updateName } from '@features/updateProfile';

export function SettingsPage() {
  const { logout } = useAuth();
  const [data, setData] = useState<ProfileBundle | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    try {
      const res = await fetchProfile();
      setData(res.data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка загрузки');
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const handle = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  if (err)
    return (
      <Panel>
        <PanelHeader>Настройки</PanelHeader>
        <Footer>{err}</Footer>
      </Panel>
    );
  if (!data)
    return (
      <Panel>
        <PanelHeader>Настройки</PanelHeader>
        <Spinner />
      </Panel>
    );

  const { user, themes, titles } = data;

  const onSelectTheme = (k: ThemeKey) => handle(() => updatePreferences({ theme: k }));
  const onToggleNotify = () =>
    handle(() => updatePreferences({ notifications_email: !user.notifications_email }));
  const onSelectTitle = (id: number) => handle(() => selectTitle(id));

  const onUpdateName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (new FormData(e.currentTarget).get('name') as string | null) ?? '';
    void handle(() => updateName(name));
  };

  return (
    <Panel>
      <PanelHeader>Настройки</PanelHeader>

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
