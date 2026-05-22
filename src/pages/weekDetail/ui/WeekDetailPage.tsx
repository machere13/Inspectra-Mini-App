import {
  Footer,
  Group,
  Header,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  SimpleCell,
  Spinner,
} from '@vkontakte/vkui';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetWeekArticlesQuery } from '@entities/article';
import { useGetWeekQuery } from '@entities/week';

export function WeekDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const week = useGetWeekQuery(id ?? '', { skip: !id });
  const articles = useGetWeekArticlesQuery(id ?? '', { skip: !id });

  const Back = <PanelHeaderBack onClick={() => nav(-1)} />;

  if (week.isLoading || articles.isLoading) {
    return (
      <Panel>
        <PanelHeader before={Back}>Неделя</PanelHeader>
        <Spinner />
      </Panel>
    );
  }
  if (week.error || !week.data) {
    return (
      <Panel>
        <PanelHeader before={Back}>Неделя</PanelHeader>
        <Footer>{week.error ? 'Ошибка загрузки' : 'Нет данных'}</Footer>
      </Panel>
    );
  }

  const w = week.data;
  const list = articles.data ?? [];

  return (
    <Panel>
      <PanelHeader before={Back}>{`Неделя ${w.number}`}</PanelHeader>
      <Group>
        <SimpleCell disabled multiline>
          <div style={{ fontWeight: 600 }}>{w.title}</div>
          {w.description && <div style={{ opacity: 0.7, marginTop: 4 }}>{w.description}</div>}
        </SimpleCell>
      </Group>
      <Group header={<Header>Статьи</Header>}>
        {list.length === 0 && <Footer>Пока пусто</Footer>}
        {list.map(a => (
          <SimpleCell
            key={a.id}
            subtitle={a.description ?? undefined}
            onClick={() => id && nav(`/weeks/${id}/articles/${a.id}`)}
          >
            {a.title}
          </SimpleCell>
        ))}
      </Group>
    </Panel>
  );
}
