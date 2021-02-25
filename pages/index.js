import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lore of Computing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.space}>Space</div>
      <div className={styles.timeline}>Timeline</div>
    </div>
  )
}
