export default function Top({styles, mouseMove}) {
  const handleWheel = (e) => {
    console.log('scroll', e);
  }

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();

    // Note: Adding a 1px offset because for some reason the browser is acting weird
    // Future: Some day in future the brower will fix it and it might break
    const x = e.clientX - rect.left + 1;

    mouseMove(x);
  };

  return (
    <div
      className={styles.top} 
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
    />
  )
}