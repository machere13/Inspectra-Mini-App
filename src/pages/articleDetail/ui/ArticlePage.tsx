import {
  Footer,
  Group,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  SimpleCell,
  Spinner,
} from '@vkontakte/vkui';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetArticleQuery } from '@entities/article';
import { Markdown } from '@shared/ui';

export function ArticlePage() {
  const { weekId, articleId } = useParams<{ weekId: string; articleId: string }>();
  const nav = useNavigate();

  const { data, error, isLoading } = useGetArticleQuery(
    { weekId: weekId ?? '', id: articleId ?? '' },
    { skip: !weekId || !articleId },
  );

  const Back = <PanelHeaderBack onClick={() => nav(-1)} />;

  if (isLoading) {
    return (
      <Panel>
        <PanelHeader before={Back}>Статья</PanelHeader>
        <Spinner />
      </Panel>
    );
  }
  if (error || !data) {
    return (
      <Panel>
        <PanelHeader before={Back}>Статья</PanelHeader>
        <Footer>{error ? 'Ошибка загрузки' : 'Статья не найдена'}</Footer>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader before={Back}>{data.title}</PanelHeader>
      <Group>
        <SimpleCell disabled multiline>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{data.title}</div>
          {data.description && (
            <div style={{ opacity: 0.7, marginTop: 6, fontSize: 14 }}>{data.description}</div>
          )}
          {data.tags && data.tags.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {data.tags.map(t => (
                <span
                  key={t}
                  style={{
                    padding: '2px 8px',
                    background: 'var(--vkui--color_background_secondary)',
                    color: 'var(--vkui--color_text_secondary)',
                    borderRadius: 12,
                    fontSize: 11,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </SimpleCell>
      </Group>
      <Group>
        <div style={{ padding: 16 }}>
          <Markdown>{data.body}</Markdown>
        </div>
      </Group>
    </Panel>
  );
}
