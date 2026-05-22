import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mdStyles } from './styles';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={className} style={mdStyles.root}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: props => <a {...props} target="_blank" rel="noopener noreferrer" />,
          code: ({ className: cls, children: code, ...rest }) => {
            const isBlock = /\n/.test(String(code));
            if (isBlock) {
              return (
                <pre style={mdStyles.pre}>
                  <code className={cls} {...rest}>
                    {code}
                  </code>
                </pre>
              );
            }
            return (
              <code style={mdStyles.codeInline} className={cls} {...rest}>
                {code}
              </code>
            );
          },
          blockquote: props => <blockquote {...props} style={mdStyles.blockquote} />,
          table: props => (
            <div style={mdStyles.tableWrap}>
              <table {...props} style={mdStyles.table} />
            </div>
          ),
          th: props => <th {...props} style={mdStyles.th} />,
          td: props => <td {...props} style={mdStyles.td} />,
          img: props => <img {...props} style={mdStyles.img} alt={props.alt ?? ''} />,
          hr: () => <hr style={mdStyles.hr} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
