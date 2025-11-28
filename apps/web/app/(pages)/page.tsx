import Image, { type ImageProps } from "next/image";
import { ClientComponent } from "../clientComponent";
import styles from "./page.module.css";
import {isMswEnabled} from '@repo/utils';

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
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

export default async function Home() {

  const user = await fetch('https://api.github.com/users/tobias-secher').then(res => res.json());

  const mswStatus = isMswEnabled ? 'MSW is enabled' : 'MSW is disabled';

  return (
    <div className={styles.page}>
      <pre>{user['name']}</pre>
      <pre>{mswStatus}</pre>
      <ClientComponent />
    </div>
  );
}
