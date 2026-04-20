import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getPage } from '@repo/services';
import { Modules } from '@/app/(frontend)/_components/modules';
import type { Locale } from '@/i18n';
import styles from './page.module.css';

const HOME_SLUG = '/';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const page = await getPage({ slug: HOME_SLUG });
  if (!page) return {};

  return {
    title: page.meta?.title ?? page.title,
    description: page.meta?.description ?? undefined,
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const page = await getPage({ slug: HOME_SLUG });

  if (!page) {
    return (
      <div className={styles.container}>
        <h1 className={styles.emptyTitle}>Page Not Found</h1>
        <p>The home page has not been configured yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Modules modules={page.modules} />
    </div>
  );
}
