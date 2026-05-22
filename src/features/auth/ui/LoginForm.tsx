import {
  Button,
  FormItem,
  Footer,
  Group,
  Header,
  Input,
  Panel,
  PanelHeader,
} from '@vkontakte/vkui';
import { useState, type FormEvent } from 'react';
import {
  useLoginOrRegisterMutation,
  useResendCodeMutation,
  useVerifyEmailMutation,
} from '../api/slice';
import { useAuth } from '../model/AuthContext';

type Step = 'credentials' | 'code';

interface RtkErrorShape {
  data?: { error?: { message?: string }; message?: string };
}

function extractErrorMessage(e: unknown, fallback: string): string {
  if (typeof e === 'object' && e !== null && 'data' in e) {
    const err = e as RtkErrorShape;
    return err.data?.error?.message ?? err.data?.message ?? fallback;
  }
  return e instanceof Error ? e.message : fallback;
}

export function LoginForm() {
  const { loginSuccess } = useAuth();

  const [step, setStep] = useState<Step>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [loginOrRegister, loginM] = useLoginOrRegisterMutation();
  const [verifyEmail, verifyM] = useVerifyEmailMutation();
  const [resendCode, resendM] = useResendCodeMutation();

  const onSubmitCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;
    try {
      const res = await loginOrRegister({ email: trimmedEmail, password }).unwrap();
      setEmail(res.email);
      setStep('code');
      setInfo('Код отправлен на email. Проверь почту (и спам).');
    } catch (e) {
      setError(extractErrorMessage(e, 'Не удалось войти'));
    }
  };

  const onSubmitCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmedCode = code.trim();
    if (!trimmedCode) return;
    try {
      const res = await verifyEmail({ email, code: trimmedCode }).unwrap();
      loginSuccess(res.token, res.user);
    } catch (e) {
      setError(extractErrorMessage(e, 'Неверный код'));
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    try {
      await resendCode({ email }).unwrap();
      setInfo('Код отправлен повторно.');
    } catch (e) {
      setError(extractErrorMessage(e, 'Не удалось отправить код'));
    }
  };

  const back = () => {
    setStep('credentials');
    setCode('');
    setError(null);
    setInfo(null);
  };

  if (step === 'credentials') {
    return (
      <Panel>
        <PanelHeader>Inspectra · Вход</PanelHeader>
        <Group header={<Header>Email и пароль</Header>}>
          <form onSubmit={onSubmitCredentials}>
            <FormItem top="Email">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoFocus
              />
            </FormItem>
            <FormItem top="Пароль">
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormItem>
            <FormItem>
              <Button
                type="submit"
                size="l"
                stretched
                disabled={loginM.isLoading || !email.trim() || !password}
              >
                Продолжить
              </Button>
            </FormItem>
          </form>
          <Footer>Если аккаунта нет — он создастся автоматически. Пароль придумай новый.</Footer>
          {error && <Footer style={{ color: 'var(--vkui--color_text_negative)' }}>{error}</Footer>}
        </Group>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader>Inspectra · Подтверждение</PanelHeader>
      <Group header={<Header>Код из письма</Header>}>
        <form onSubmit={onSubmitCode}>
          <FormItem top={`Код отправлен на ${email}`}>
            <Input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="123456"
              autoFocus
            />
          </FormItem>
          <FormItem>
            <Button type="submit" size="l" stretched disabled={verifyM.isLoading || !code.trim()}>
              Войти
            </Button>
          </FormItem>
        </form>
        <FormItem>
          <Button
            mode="secondary"
            size="m"
            stretched
            onClick={() => void onResend()}
            disabled={resendM.isLoading}
          >
            Отправить код ещё раз
          </Button>
        </FormItem>
        <FormItem>
          <Button mode="tertiary" size="m" stretched onClick={back}>
            Назад
          </Button>
        </FormItem>
        {info && <Footer>{info}</Footer>}
        {error && <Footer style={{ color: 'var(--vkui--color_text_negative)' }}>{error}</Footer>}
      </Group>
    </Panel>
  );
}
