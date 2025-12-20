import Image, { type ImageProps } from "next/image";
import { ClientComponent } from "../../clientComponent";
import styles from "./page.module.css";
import { isMswEnabled } from "@repo/utils";
import { getTranslations, setRequestLocale } from "@repo/i18n";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
  params: Promise<{ locale: string }>;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default async function Home({ params }: Readonly<Props>) {
  const user = await fetch("https://api.github.com/users/tobias-secher").then(
    (res) => res.json()
  );

  const mswStatus = isMswEnabled ? "MSW is enabled" : "MSW is disabled";

  const { locale } = await params;
  setRequestLocale(locale as any);

  const t = await getTranslations("HomePage");

  return (
    <div className={styles.page}>
      <pre>{user["name"]}</pre>
      <pre>{t("title")}</pre>
      <pre>{t("description")}</pre>
      <pre>{mswStatus}</pre>
      <ClientComponent />
    </div>
  );
}
