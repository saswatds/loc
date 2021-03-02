import Head from 'next/head'
import styles from '../styles/Home.module.css'
import TimeTree from './core/TimeTree';
import Top from './timeline/Top';
import { useState } from 'react';
import Marker from './timeline/Marker';

export default function Home() {
  const time = new TimeTree();

  const [markerPos, setMarkerPos] = useState(0)

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
        <Top styles={styles} mouseMove={(x) => setMarkerPos(x)} />
        <Marker styles={styles} markerPos={markerPos}/>
      </div>
      <div className={styles.bottom}></div>
    </div>
  )
}
