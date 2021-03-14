import { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import TimeTree from '../core/TimeTree';

import Top from './timeline/Top';
import Marker from './timeline/Marker';


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const time = new TimeTree();

for (let i = 0; i < 100; i++) {
  const d = randomDate(new Date(1980), new Date());
  time.addEvent(d, `event-${d}`);
}


export default function Home() {
  const [markerPos, setMarkerPos] = useState(0);
  const bucket = time.bucket(new Date(1980), new Date(), 20);

  return (
    <div className={styles.container}>
      <Head>
        <title>Lore of Computing</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className={styles.space}>
        [{bucket.toString()}]
      </div>
      <div className={styles['top-container']}>
        <Top mouseMove={(x) => setMarkerPos(x)} />
        <Marker markerPos={markerPos}/>
      </div>
      <div className={styles.bottom}></div>
    </div>
  )
}
