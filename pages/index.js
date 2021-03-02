import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TimeTree from './core/TimeTree';
import Top from './timeline/Top';

export default function Home() {
  const time = new TimeTree();
  return (
    <div className={styles.container}>
      <Head>
        <title>Lore of Computing</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.space}>
        {time.all()}
      </div>
      <div className={styles['top-container']}>
        <Top styles={styles} />
      </div>
      <div className={styles.bottom}></div>
    </div>
  )
}
