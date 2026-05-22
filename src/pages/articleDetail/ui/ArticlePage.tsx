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
import { Markdown, PageContent } from '@shared/ui';
import styles from './ArticlePage.module.css';

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
        <PageContent>
          <Spinner />
        </PageContent>
      </Panel>
    );
  }
  if (error || !data) {
    return (
      <Panel>
        <PanelHeader before={Back}>Статья</PanelHeader>
        <PageContent>
          <Footer>{error ? 'Ошибка загрузки' : 'Статья не найдена'}</Footer>
        </PageContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader before={Back}>{data.title}</PanelHeader>
      <PageContent>
        <Group>
          <SimpleCell disabled multiline>
            <div className={styles.title}>{data.title}</div>
            {data.description && <div className={styles.description}>{data.description}</div>}
            {data.tags && data.tags.length > 0 && (
              <div className={styles.tags}>
                {data.tags.map(t => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </SimpleCell>
        </Group>
        <Group>
          <div className={styles.body}>
            <Markdown>{data.body}</Markdown>
          </div>
        </Group>
      </PageContent>
    </Panel>
  );
}
