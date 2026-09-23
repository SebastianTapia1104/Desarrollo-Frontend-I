import { useEffect, useRef } from "react";
import { Carousel } from "bootstrap";

/**
 * Carrusel de destacados. Las diapositivas se arman al cargar el JSON.
 */
const CarruselDestacados = ({ destacados }) => {
  const nodoRef = useRef(null);

  useEffect(() => {
    if (!destacados.length || !nodoRef.current) return undefined;
    const carrusel = Carousel.getOrCreateInstance(nodoRef.current, {
      interval: 3000,
      ride: "carousel"
    });
    return () => carrusel.dispose();
  }, [destacados]);

  if (!destacados.length) return null;

  const base = import.meta.env.BASE_URL;

  return (
    <section id="destacados" aria-labelledby="titulo-destacados">
      <div className="container pt-3 pb-1">
        <h2 id="titulo-destacados" className="seccion-titulo-centro mb-2">Juegos destacados</h2>
      </div>
      <div id="carruselDestacados" className="carousel slide" ref={nodoRef}>
        <div className="carousel-indicators">
          {destacados.map((item, indice) => (
            <button
              key={item.img}
              type="button"
              data-bs-target="#carruselDestacados"
              data-bs-slide-to={String(indice)}
              className={indice === 0 ? "active" : ""}
              aria-current={indice === 0 ? "true" : undefined}
              aria-label={`Diapositiva ${indice + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {destacados.map((item, indice) => (
            <div className={`carousel-item${indice === 0 ? " active" : ""}`} key={item.img}>
              <div className="carousel-frame">
                <img className="carousel-fondo" src={`${base}img/${item.img}`} alt="" aria-hidden="true" />
                <img className="carousel-foto" src={`${base}img/${item.img}`} alt={`Portada de ${item.titulo}`} />
                <div className="carousel-caption d-none d-md-block">
                  <h2 className="h3 mb-1">{item.titulo}</h2>
                  <p className="mb-0">{item.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carruselDestacados" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carruselDestacados" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </section>
  );
};

export default CarruselDestacados;
