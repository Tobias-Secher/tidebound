import styles from './Header.module.css';
import { Links } from './components/Links';
import { getHeader } from '@repo/services';
import { resolveNavItems } from './types';

export type HeaderProps = {};

export async function Header(props: HeaderProps) {
  const headerData = await getHeader();
  const navItems = resolveNavItems(headerData?.navItems);

  return (
    <div className={styles.container}>
      <Links items={navItems} />
      <h1>TIDEBOUND</h1>
      <div>User</div>
    </div>
  );
}
