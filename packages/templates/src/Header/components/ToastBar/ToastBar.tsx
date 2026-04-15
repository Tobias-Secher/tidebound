'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './ToastBar.module.css';

const STORAGE_KEY = 'toast-dismissed';

type ToastBarProps = {
  message: string;
  linkUrl?: string;
  linkText?: string;
};

export function ToastBar({ message, linkUrl, linkText }: ToastBarProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setDismissed(true);
    }
  }, []);

  function handleDismiss() {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.message}>
          {message}
          {linkUrl && linkText && (
            <>
              {' '}
              <Link href={linkUrl} className={styles.link}>
                {linkText} &rarr;
              </Link>
            </>
          )}
        </span>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        &times;
      </button>
    </div>
  );
}
