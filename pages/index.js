import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TimeTree from './core/TimeTree';

export default function Home() {
  const time = new TimeTree();

  return (
    <div className={styles.container}>
      <Head>
        <title>Lore of Computing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.space}>
        {time.all()}
      </div>
      <div className={styles.top}></div>
      <div className={styles.bottom}></div>
    </div>
  )
}
