'use client';

import { ReactNode } from 'react';
import styles from './Header.module.css';

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

export function Header({ children, className }: HeaderProps) {
  return <div className={styles.container}>Header works</div>;
}
