import { useEffect, useState } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  Header,
  Avatar,
  RichCell,
  Card,
  CardGrid,
  Progress,
  Spinner,
  Footer,
  SimpleCell,
  Counter,
  Spacing,
} from '@vkontakte/vkui';
import { fetchProfile, type ProfileBundle } from '@entities/profile';

export function ProfilePage() {
  const [data, setData] = useState<ProfileBundle | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile()
      .then(res => setData(res.data))
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : 'Ошибка загрузки'));
  }, []);

  if (err)
    return (
      <Panel>
        <PanelHeader>Профиль</PanelHeader>
        <Footer>{err}</Footer>
      </Panel>
    );
  if (!data)
    return (
      <Panel>
        <PanelHeader>Профиль</PanelHeader>
        <Spinner />
      </Panel>
    );

  const { user, progress, skill_chart, achievements, badges } = data;

  return (
    <Panel>
      <PanelHeader>Профиль</PanelHeader>

      <Group>
        <RichCell
          before={<Avatar size={72} src={user.vk_avatar_url ?? user.avatar_url ?? undefined} />}
          subtitle={user.email ?? undefined}
          extraSubtitle={user.game_role_label ?? 'Роль не выбрана'}
        >
          {user.name ?? 'Без имени'}
          {badges.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {badges.map((b, i) => (
                <span
                  key={`${b.label}-${i}`}
                  title={b.achievement_name}
                  style={{
                    padding: '2px 6px',
                    background: 'var(--vkui--color_text_primary)',
                    color: 'var(--vkui--color_background_content)',
                    borderRadius: 4,
                    fontSize: 10,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </RichCell>
      </Group>

      <Group header={<Header>Прогресс</Header>}>
        <SimpleCell disabled>
          Уровень <b style={{ marginLeft: 8 }}>{progress.level?.number ?? '—'}</b>
          {progress.level?.name && (
            <span style={{ marginLeft: 8, opacity: 0.7 }}>· {progress.level.name}</span>
          )}
        </SimpleCell>
        <div style={{ padding: '0 16px 16px' }}>
          <Progress value={progress.level_progress_percent ?? 0} />
          <Footer>
            {user.experience_points} XP
            {progress.next_level &&
              ` / ${progress.next_level.required_xp} XP до «${progress.next_level.name}»`}
          </Footer>
        </div>
      </Group>

      <Group header={<Header>Карта навыков</Header>}>
        {skill_chart.map(row => (
          <SimpleCell key={row.key} after={<Counter>{`${row.percent}%`}</Counter>} disabled>
            {row.label}
          </SimpleCell>
        ))}
      </Group>

      <Group header={<Header>Достижения</Header>}>
        <CardGrid size="l">
          {achievements.slice(0, 8).map(a => (
            <Card key={a.key}>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{a.name}</div>
                <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>{a.description}</div>
                <Spacing size={8} />
                <div style={{ fontSize: 12 }}>
                  {a.all_completed ? '✓ Выполнено' : `${a.progress} / ${a.target}`}
                  {a.tiers_total > 1 &&
                    ` · Ступень ${a.tiers_completed + (a.all_completed ? 0 : 1)}/${a.tiers_total}`}
                </div>
              </div>
            </Card>
          ))}
        </CardGrid>
      </Group>
    </Panel>
  );
}
