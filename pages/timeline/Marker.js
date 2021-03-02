export default function Marker ({styles, markerPos}) {
	return <div className={styles.marker} style={{transform: `translateX(${markerPos}px)`}}/>;
}