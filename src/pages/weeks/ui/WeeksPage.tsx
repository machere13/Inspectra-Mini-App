import { Footer, Group, Panel, PanelHeader, SimpleCell, Spinner } from '@vkontakte/vkui';
import { useNavigate } from 'react-router-dom';
import { useGetWeeksQuery } from '@entities/week';
import { PageContent } from '@shared/ui';

export function WeeksPage() {
  const { data: weeks, isLoading, error } = useGetWeeksQuery();
  const nav = useNavigate();

  if (isLoading) {
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <PageContent>
          <Spinner />
        </PageContent>
      </Panel>
    );
  }
  if (error || !weeks) {
    return (
      <Panel>
        <PanelHeader>Недели</PanelHeader>
        <PageContent>
          <Footer>{error ? 'Ошибка загрузки' : 'Нет данных'}</Footer>
        </PageContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader>Недели</PanelHeader>
      <PageContent>
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
      </PageContent>
    </Panel>
  );
}
