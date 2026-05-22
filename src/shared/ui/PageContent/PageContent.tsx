import type { ReactNode } from 'react';
import styles from './PageContent.module.css';

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={`${styles.root}${className ? ` ${className}` : ''}`}>{children}</div>;
}
