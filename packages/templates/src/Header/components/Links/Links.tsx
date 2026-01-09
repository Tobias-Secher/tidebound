'use client';

import styles from './Links.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ResolvedNavItem } from '../../types';

type LinksProps = {
  items: ResolvedNavItem[];
};

const localeRegex = RegExp(`^\/[a-zA-Z]{2}(?=\/)`);
export function Links({ items }: LinksProps) {
  console.log('Links items:', items);

  const pathname = usePathname();
  console.log('Current pathname:', pathname.replace(localeRegex, ''));

  return (
    <ul className={styles.container}>
      {items.map((item) => {
        const isActive = pathname.replace(localeRegex, '') === item.href;

        return (
          <li key={item.id || item.label}>
            <Link
              href={item.href}
              target={item.openInNewTab ? '_blank' : undefined}
              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
              className={isActive ? styles.active : ''}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
