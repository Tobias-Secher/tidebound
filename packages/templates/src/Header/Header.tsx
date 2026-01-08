import styles from './Header.module.css';
import { Links } from './components/Links';

export type HeaderProps = {};

export function Header(props: HeaderProps) {
  return (
    <div className={styles.container}>
      <Links />
      <h1>TIDEBOUND</h1>
      <div>User</div>
    </div>
  );
}
