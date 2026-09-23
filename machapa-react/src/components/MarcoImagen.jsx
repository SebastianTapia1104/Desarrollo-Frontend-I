/**
 * Marco de imagen: foto completa (contain) y fondo difuminado, como el carrusel.
 */
const MarcoImagen = ({ src, alt, className = "card-frame" }) => (
  <div className={className}>
    <img className="marco-fondo" src={src} alt="" aria-hidden="true" />
    <img className="marco-foto" src={src} alt={alt} />
  </div>
);

export default MarcoImagen;
