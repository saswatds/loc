export default function Top({styles}) {

  const handleWheel = (e) => {
    console.log('scroll', e);
  }

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left + 1; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    console.log("Left? : " + x + " ; Top? : " + y + ".");
  }

  return (
    <div
      className={styles.top} 
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
    />
  )
}