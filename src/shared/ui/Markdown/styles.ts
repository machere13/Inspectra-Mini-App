import type { CSSProperties } from 'react';

export const mdStyles: Record<string, CSSProperties> = {
  root: {
    lineHeight: 1.55,
    fontSize: 15,
    color: 'var(--vkui--color_text_primary)',
    wordBreak: 'break-word',
  },
  pre: {
    background: 'var(--vkui--color_background_secondary)',
    padding: 12,
    borderRadius: 8,
    overflowX: 'auto',
    fontSize: 13,
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
  },
  codeInline: {
    background: 'var(--vkui--color_background_secondary)',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
  },
  blockquote: {
    borderLeft: '3px solid var(--vkui--color_separator_primary)',
    margin: '8px 0',
    padding: '4px 12px',
    color: 'var(--vkui--color_text_secondary)',
  },
  tableWrap: {
    overflowX: 'auto',
    margin: '8px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    borderBottom: '1px solid var(--vkui--color_separator_primary)',
    padding: '8px 10px',
    fontWeight: 600,
  },
  td: {
    borderBottom: '1px solid var(--vkui--color_separator_primary)',
    padding: '8px 10px',
  },
  img: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: 6,
  },
  hr: {
    border: 'none',
    borderTop: '1px solid var(--vkui--color_separator_primary)',
    margin: '16px 0',
  },
};
