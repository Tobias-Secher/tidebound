// import Link from 'next/link';
import styles from './Header.module.css';
import { Links } from './components/Links';
import { MobileNav } from './components/MobileNav';
import { ToastBar } from './components/ToastBar';
import { getHeader } from '@repo/services';
import { resolveNavItems, resolveToast } from './types';
import type { Locale } from '@/i18n';
import { Link } from '@/i18n/navigation';

type HeaderProps = {
  locale: Locale;
};

export async function Header({ locale }: HeaderProps) {
  const headerData = await getHeader();
  const navItems = resolveNavItems(headerData?.navItems, locale);
  const toast = resolveToast(headerData?.toast);

  return (
    <header className={styles.container}>
      {toast && (
        <ToastBar message={toast.message} linkUrl={toast.linkUrl} linkText={toast.linkText} />
      )}
      <nav className={styles.nav} aria-label="Main">
        <div className={styles.desktopNav}>
          <Links items={navItems} />
        </div>
        <Link href={`/`} className={styles.logo} aria-label="Tidebound home">
          TIDEBOUND
        </Link>
        <div className={styles.rightSlot}>
          <MobileNav items={navItems} />
        </div>
      </nav>
    </header>
  );
}
