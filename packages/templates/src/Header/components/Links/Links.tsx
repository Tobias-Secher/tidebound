'use client';

import styles from './Links.module.css';
import Link from 'next/link';

type LinksProps = {};

export function Links(props: LinksProps) {
  return (
    <ul className={styles.container}>
      <li>
        <Link href="/link1">Link 1</Link>
      </li>
      <li>Link 2</li>
      <li>Link 3</li>
      <li>Link 4</li>
    </ul>
  );
}
