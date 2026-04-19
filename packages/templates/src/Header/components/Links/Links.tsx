'use client';
import styles from './Links.module.css';
import Link from 'next/link';
import type { ResolvedNavItem } from '../../types';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

type LinksProps = {
  items: ResolvedNavItem[];
};

const localeRegex = /^\/[a-zA-Z]{2}(?=\/)/;

export function Links({ items }: LinksProps) {
  const pathname = usePathname();
  return (
    <ul className={styles.container}>
      {items.map((item, index) => {
        const key = item.id ?? `menu-item-${index}`;
        const hasChildren = item.children && item.children.length > 0;
        const isActive = pathname.replace(localeRegex, '') === item.href;

        if (!hasChildren) {
          return (
            <li key={key}>
              <Link
                href={item.href}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                className={clsx(styles.link, isActive && styles.active)}
              >
                {item.label}
              </Link>
            </li>
          );
        }

        const popoverId = `header-popover-${item.id ?? index}`;

        return (
          <li key={key}>
            <button
              className={clsx(styles.dropdownTrigger, styles.link)}
              type="button"
              popoverTarget={popoverId}
            >
              {item.label}
            </button>
            <div id={popoverId} popover="auto" className={styles.popover}>
              <ul className={styles.popoverList}>
                {item.children!.map((child, childIndex) => (
                  <li key={child.id ?? `${key}-child-${childIndex}`}>
                    <Link
                      href={child.href}
                      target={child.openInNewTab ? '_blank' : undefined}
                      rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                      className={clsx(styles.link, styles.sub, isActive && styles.active)}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
