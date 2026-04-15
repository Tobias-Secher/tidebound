'use client';

import styles from './Links.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ResolvedNavItem } from '../../types';

type LinksProps = {
  items: ResolvedNavItem[];
};

const localeRegex = /^\/[a-zA-Z]{2}(?=\/)/;

export function Links({ items }: LinksProps) {
  const pathname = usePathname();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function toggleDropdown(id: string) {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }

  return (
    <ul className={styles.container} ref={navRef}>
      {items.map((item) => {
        const itemId = item.id || item.label;
        const hasChildren = item.children && item.children.length > 0;
        const isActive = pathname.replace(localeRegex, '') === item.href;
        const isOpen = openDropdownId === itemId;

        if (hasChildren) {
          return (
            <li key={itemId} className={styles.hasDropdown}>
              <button
                className={`${styles.dropdownTrigger} ${isOpen ? styles.active : ''}`}
                onClick={() => toggleDropdown(itemId)}
                aria-expanded={isOpen}
                type="button"
              >
                {item.label}
              </button>
              {isOpen && (
                <ul className={styles.dropdown}>
                  {item.children!.map((child) => (
                    <li key={child.id || child.label}>
                      <Link
                        href={child.href}
                        target={child.openInNewTab ? '_blank' : undefined}
                        rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpenDropdownId(null)}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        }

        return (
          <li key={itemId}>
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
