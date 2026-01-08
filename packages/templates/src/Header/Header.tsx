'use server';

import { ReactNode } from 'react';
import styles from './Header.module.css';

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

export function Header({ children, className }: HeaderProps) {
  return (
    <div className={styles.container}>
      <ul>
        <li>Link 1</li>
        <li>Link 2</li>
        <li>Link 3</li>
        <li>Link 4</li>
      </ul>
      <h1>TIDEBOUND</h1>
      <div>User</div>
    </div>
  );
}
