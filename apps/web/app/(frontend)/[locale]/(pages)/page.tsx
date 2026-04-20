import Image, { type ImageProps } from 'next/image';
import { ClientComponent } from '../../clientComponent';
import styles from './page.module.css';
import { isMswEnabled } from '@repo/utils';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type ThemeImageProps = Omit<ImageProps, 'src'> & {
  srcLight: string;
  srcDark: string;
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

const ThemeImage = (props: ThemeImageProps) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home({ params }: PageProps) {
  const user = await fetch('https://api.github.com/users/tobias-secher').then((res) => res.json());

  const mswStatus = isMswEnabled ? 'MSW is enabled' : 'MSW is disabled';

  const { locale } = await params;
  setRequestLocale(locale as any);

  const t = await getTranslations('HomePage');

  return (
    <div className={styles.page}>
      <pre>{user['name']}</pre>
      <pre>{t('title')}</pre>
      <pre>{t('subtitle')}</pre>
      <pre>{mswStatus}</pre>
      <ClientComponent />
    </div>
  );
}
