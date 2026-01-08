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
      <li>
        <Link href={'#'}>Link 2</Link>
      </li>
      <li>
        <Link href={'#'}>Link 3</Link>
      </li>
      <li>
        <Link href={'#'}>Link 4</Link>
      </li>
    </ul>
  );
}
