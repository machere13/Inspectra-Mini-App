import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={`${styles.root}${className ? ` ${className}` : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: props => <a {...props} target="_blank" rel="noopener noreferrer" />,
          code: ({ className: cls, children: code, ...rest }) => {
            const isBlock = /\n/.test(String(code));
            if (isBlock) {
              return (
                <pre className={styles.pre}>
                  <code className={cls} {...rest}>
                    {code}
                  </code>
                </pre>
              );
            }
            return (
              <code className={`${styles.codeInline}${cls ? ` ${cls}` : ''}`} {...rest}>
                {code}
              </code>
            );
          },
          blockquote: props => <blockquote {...props} className={styles.blockquote} />,
          table: props => (
            <div className={styles.tableWrap}>
              <table {...props} className={styles.table} />
            </div>
          ),
          th: props => <th {...props} className={styles.th} />,
          td: props => <td {...props} className={styles.td} />,
          img: props => <img {...props} className={styles.img} alt={props.alt ?? ''} />,
          hr: () => <hr className={styles.hr} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
