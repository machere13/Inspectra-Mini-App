import { Footer, Group, Panel, PanelHeader, SimpleCell, Spinner } from '@vkontakte/vkui';
import { useNavigate } from 'react-router-dom';
import { useGetWeeksQuery } from '@entities/week';

export function WeeksPage() {
  const { data: weeks, isLoading, error } = useGetWeeksQuery();
  const nav = useNavigate();

  if (isLoading) {
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <Spinner />
      </Panel>
    );
  }
  if (error || !weeks) {
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <Footer>{error ? 'Ошибка загрузки' : 'Нет данных'}</Footer>
      </Panel>
    );
  }

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
