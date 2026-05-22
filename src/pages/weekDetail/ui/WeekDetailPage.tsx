import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  SimpleCell,
  Spinner,
  Footer,
  Header,
} from '@vkontakte/vkui';
import { fetchWeek, unwrapWeek, type Week } from '@entities/week';
import { fetchArticles, unwrapArticles, type Article } from '@entities/article';

export function WeekDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [week, setWeek] = useState<Week | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([fetchWeek(id), fetchArticles(id)])
      .then(([w, a]) => {
        setWeek(unwrapWeek(w.data));
        setArticles(unwrapArticles(a.data));
      })
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : 'Ошибка загрузки'));
  }, [id]);

  const Back = <PanelHeaderBack onClick={() => nav(-1)} />;

  if (err)
    return (
      <Panel>
        <PanelHeader before={Back}>Неделя</PanelHeader>
        <Footer>{err}</Footer>
      </Panel>
    );
  if (!week)
    return (
      <Panel>
        <PanelHeader before={Back}>Неделя</PanelHeader>
        <Spinner />
      </Panel>
    );

  return (
    <Panel>
      <PanelHeader before={Back}>{`Неделя ${week.number}`}</PanelHeader>
      <Group>
        <SimpleCell disabled multiline>
          <div style={{ fontWeight: 600 }}>{week.title}</div>
          {week.description && <div style={{ opacity: 0.7, marginTop: 4 }}>{week.description}</div>}
        </SimpleCell>
      </Group>
      <Group header={<Header>Статьи</Header>}>
        {articles.length === 0 && <Footer>Пока пусто</Footer>}
        {articles.map(a => (
          <SimpleCell key={a.id} subtitle={a.summary ?? undefined} disabled>
            {a.title}
          </SimpleCell>
        ))}
      </Group>
    </Panel>
  );
}
