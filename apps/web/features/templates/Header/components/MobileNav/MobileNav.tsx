'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './MobileNav.module.css';
import type { ResolvedNavItem } from '../../types';

type MobileNavProps = {
  items: ResolvedNavItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setExpandedId(null);
    }
  }

  function closeMenu() {
    setIsOpen(false);
    setExpandedId(null);
  }

  function toggleAccordion(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={styles.mobileNav}>
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        type="button"
      >
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerOpen : ''}`} />
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerOpen : ''}`} />
        <span className={`${styles.hamburgerLine} ${isOpen ? styles.hamburgerOpen : ''}`} />
      </button>

      {isOpen && <div className={styles.backdrop} onClick={closeMenu} />}

      <nav className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <ul className={styles.navList}>
          {items.map((item) => {
            const itemId = item.id || item.label;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedId === itemId;

            if (hasChildren) {
              return (
                <li key={itemId} className={styles.navItem}>
                  <button
                    className={styles.accordionTrigger}
                    onClick={() => toggleAccordion(itemId)}
                    aria-expanded={isExpanded}
                    type="button"
                  >
                    {item.label}
                    <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`} />
                  </button>
                  <ul
                    className={styles.accordionContent}
                    style={{
                      gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    }}
                  >
                    <div className={styles.accordionInner}>
                      {item.children!.map((child) => (
                        <li key={child.id || child.label}>
                          <Link
                            href={child.href}
                            target={child.openInNewTab ? '_blank' : undefined}
                            rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                            className={styles.childLink}
                            onClick={closeMenu}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </div>
                  </ul>
                </li>
              );
            }

            return (
              <li key={itemId} className={styles.navItem}>
                <Link
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={styles.navLink}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
