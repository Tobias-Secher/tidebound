import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getPage } from '@repo/services';
import { Modules } from '@/app/(frontend)/_components/modules';
import type { Locale } from '@/i18n';
import styles from './page.module.css';

type PageProps = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const page = await getPage({ slug: slug.join('/') });
  if (!page) return {};

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as Locale);

  const page = await getPage({ slug: slug.join('/') });

  if (!page) {
    return (
      <div className={styles.container}>
        <h1 className={styles.emptyTitle}>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{page.title}</h1>
      <Modules modules={page.modules} />
    </div>
  );
}
