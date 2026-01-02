'use client';

import { ReactNode } from 'react';
import styles from './Header.module.css';

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

export const Header = ({ children, className }: HeaderProps) => {
  return <div className={styles.container}>{children}</div>;
};
