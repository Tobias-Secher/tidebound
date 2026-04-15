import styles from './Header.module.css';
import { Links } from './components/Links';
import { MobileNav } from './components/MobileNav';
import { ToastBar } from './components/ToastBar';
import { getHeader } from '@repo/services';
import { resolveNavItems, resolveToast } from './types';

export async function Header() {
  const headerData = await getHeader();
  const navItems = resolveNavItems(headerData?.navItems);
  const toast = resolveToast(headerData?.toast);

  return (
    <header className={styles.container}>
      {toast && (
        <ToastBar
          message={toast.message}
          linkUrl={toast.linkUrl}
          linkText={toast.linkText}
        />
      )}
      <nav className={styles.nav}>
        <div className={styles.desktopNav}>
          <Links items={navItems} />
        </div>
        <h1 className={styles.logo}>TIDEBOUND</h1>
        <div className={styles.rightSlot}>
          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  );
}
