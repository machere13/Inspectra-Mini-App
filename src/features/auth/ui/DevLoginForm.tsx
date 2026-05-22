import { useState, type FormEvent } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  FormItem,
  Input,
  Button,
  Footer,
  Spacing,
} from '@vkontakte/vkui';
import { useAuth } from '@app/providers';

const LAST_EMAIL_KEY = 'inspectra_dev_last_email';

export function DevLoginForm() {
  const { error, devLogin, status } = useAuth();
  const [email, setEmail] = useState<string>(() => localStorage.getItem(LAST_EMAIL_KEY) ?? '');
  const busy = status === 'loading';

  const onSubmitEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    localStorage.setItem(LAST_EMAIL_KEY, trimmed);
    void devLogin({ email: trimmed });
  };

  const onQuickDev = () => {
    void devLogin();
  };

  return (
    <Panel>
      <PanelHeader>Inspectra · Dev login</PanelHeader>

      <Group header={<Header>Войти по email</Header>}>
        <form onSubmit={onSubmitEmail}>
          <FormItem top="Email из основного фронта">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
          </FormItem>
          <FormItem>
            <Button type="submit" size="l" stretched disabled={busy || !email.trim()}>
              Войти
            </Button>
          </FormItem>
        </form>
        <Footer>
          Пароль не нужен — это dev-режим. Endpoint /auth/dev доступен только когда Rails крутится в
          development.
        </Footer>
      </Group>

      <Group header={<Header>Или быстрый Dev User</Header>}>
        <FormItem>
          <Button mode="secondary" size="l" stretched onClick={onQuickDev} disabled={busy}>
            Войти как Dev User (vk_user_id=1)
          </Button>
        </FormItem>
        <Footer>Создаст тестового юзера при первом заходе.</Footer>
      </Group>

      {error && (
        <>
          <Spacing size={8} />
          <Footer style={{ color: 'var(--vkui--color_text_negative)' }}>{error}</Footer>
        </>
      )}
    </Panel>
  );
}
