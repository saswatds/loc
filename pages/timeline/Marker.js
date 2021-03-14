import styles from '../../styles/Home.module.css';

export default function Marker ({markerPos}) {
	return <div className={styles.marker} style={{transform: `translateX(${markerPos}px)`}}/>;
}