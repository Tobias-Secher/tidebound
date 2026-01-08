import { ReactNode } from 'react';
import styles from './Header.module.css';
import { Links } from './components/Links';

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
};

export function Header({ children, className }: HeaderProps) {
  return (
    <div className={styles.container}>
      <Links />
      <h1>TIDEBOUND</h1>
      <div>User</div>
    </div>
  );
}
