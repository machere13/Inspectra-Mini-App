import { Icon24CheckCircleOn, Icon24LockOutline } from '@vkontakte/icons';
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
import { getThemeColor, getThemeLabel, type ThemeKey } from '@entities/theme';
import styles from './SettingsPage.module.css';

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

  const renderThemeIndicator = (isCurrent: boolean, isUnlocked: boolean) => {
    if (isCurrent) {
      return (
        <span className={`${styles.themeIndicator} ${styles.themeIndicatorActive}`}>
          <Icon24CheckCircleOn />
        </span>
      );
    }
    if (!isUnlocked) {
      return (
        <span className={styles.themeIndicator}>
          <Icon24LockOutline />
        </span>
      );
    }
    return null;
  };

  return (
    <Panel>
      <PanelHeader>Настройки</PanelHeader>

      {localError && <Footer className={styles.errorFooter}>{localError}</Footer>}

      <Group header={<Header>Аккаунт</Header>}>
        <SimpleCell disabled>
          E-mail
          <div className={styles.emailValue}>{user.email ?? '—'}</div>
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
          <div className={styles.emailValue}>{user.game_role_label ?? '—'}</div>
        </SimpleCell>
      </Group>

      <Group header={<Header>Тема</Header>}>
        {themes.catalog.map(t => {
          const isCurrent = themes.current === t.key;
          return (
            <Cell
              key={t.key}
              before={
                <span className={styles.themeSwatch} style={{ background: getThemeColor(t.key) }} />
              }
              disabled={!t.unlocked || busy}
              onClick={t.unlocked ? () => onSelectTheme(t.key) : undefined}
              indicator={renderThemeIndicator(isCurrent, t.unlocked)}
              subtitle={
                !t.unlocked && t.unlock_via ? `Открой: ${t.unlock_via.achievement_name}` : undefined
              }
            >
              {getThemeLabel(t.key)}
            </Cell>
          );
        })}
      </Group>

      <Group header={<Header>Титулы</Header>}>
        {titles.available.length === 0 && <Footer>Пока нет открытых титулов</Footer>}
        {titles.available.map(t => (
          <Cell
            key={t.id}
            onClick={() => onSelectTitle(t.id)}
            disabled={busy}
            indicator={
              titles.current?.id === t.id ? (
                <span className={`${styles.themeIndicator} ${styles.themeIndicatorActive}`}>
                  <Icon24CheckCircleOn />
                </span>
              ) : null
            }
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
