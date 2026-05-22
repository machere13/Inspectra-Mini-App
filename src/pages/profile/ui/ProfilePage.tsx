import {
  Avatar,
  Card,
  CardGrid,
  Counter,
  Footer,
  Group,
  Header,
  Panel,
  PanelHeader,
  Progress,
  RichCell,
  SimpleCell,
  Spacing,
  Spinner,
} from '@vkontakte/vkui';
import { useGetProfileQuery } from '@entities/profile';
import { PageContent } from '@shared/ui';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { data, error, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return (
      <Panel>
        <PanelHeader>Профиль</PanelHeader>
        <PageContent>
          <Spinner />
        </PageContent>
      </Panel>
    );
  }
  if (error || !data) {
    return (
      <Panel>
        <PanelHeader>Профиль</PanelHeader>
        <PageContent>
          <Footer>{error ? 'Ошибка загрузки' : 'Нет данных'}</Footer>
        </PageContent>
      </Panel>
    );
  }

  const { user, progress, skill_chart, achievements, badges } = data;

  return (
    <Panel>
      <PanelHeader>Профиль</PanelHeader>
      <PageContent>
        <Group>
          <RichCell
            before={<Avatar size={72} src={user.vk_avatar_url ?? user.avatar_url ?? undefined} />}
            subtitle={user.email ?? undefined}
            extraSubtitle={user.game_role_label ?? 'Роль не выбрана'}
          >
            {user.name ?? 'Без имени'}
            {badges.length > 0 && (
              <div className={styles.badges}>
                {badges.map((b, i) => (
                  <span key={`${b.label}-${i}`} title={b.achievement_name} className={styles.badge}>
                    {b.label}
                  </span>
                ))}
              </div>
            )}
          </RichCell>
        </Group>

        <Group header={<Header>Прогресс</Header>}>
          <SimpleCell disabled>
            Уровень <b className={styles.levelLabel}>{progress.level?.number ?? '—'}</b>
            {progress.level?.name && (
              <span className={styles.levelName}>· {progress.level.name}</span>
            )}
          </SimpleCell>
          <div className={styles.progressWrap}>
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
                <div className={styles.achievementCard}>
                  <div className={styles.achievementTitle}>{a.name}</div>
                  <div className={styles.achievementDescription}>{a.description}</div>
                  <Spacing size={8} />
                  <div className={styles.achievementStats}>
                    {a.all_completed ? '✓ Выполнено' : `${a.progress} / ${a.target}`}
                    {a.tiers_total > 1 &&
                      ` · Ступень ${a.tiers_completed + (a.all_completed ? 0 : 1)}/${a.tiers_total}`}
                  </div>
                </div>
              </Card>
            ))}
          </CardGrid>
        </Group>
      </PageContent>
    </Panel>
  );
}
