import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel, PanelHeader, Group, SimpleCell, Spinner, Footer } from '@vkontakte/vkui';
import { fetchWeeks, unwrapWeeks, type Week } from '@entities/week';

export function WeeksPage() {
  const [weeks, setWeeks] = useState<Week[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    fetchWeeks()
      .then(r => setWeeks(unwrapWeeks(r.data)))
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : 'Ошибка загрузки'));
  }, []);

  if (err)
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <Footer>{err}</Footer>
      </Panel>
    );
  if (!weeks)
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <Spinner />
      </Panel>
    );

  return (
    <Panel>
      <PanelHeader>Недели</PanelHeader>
      <Group>
        {weeks.length === 0 && <Footer>Пока пусто</Footer>}
        {weeks.map(w => (
          <SimpleCell
            key={w.id}
            onClick={() => nav(`/weeks/${w.id}`)}
            subtitle={w.description ?? undefined}
          >
            {`Неделя ${w.number} — ${w.title}`}
          </SimpleCell>
        ))}
      </Group>
    </Panel>
  );
}
