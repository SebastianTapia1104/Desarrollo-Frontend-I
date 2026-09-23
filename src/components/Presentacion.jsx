/**
 * Inicio: presentación de la tienda.
 */
const Presentacion = () => (
  <header id="inicio" className="presentacion">
    <div className="container">
      <div className="presentacion-fila">
        <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Logotipo de Machapa Games" width="110" height="110" />
        <div className="presentacion-texto">
          <h1>Machapa Games</h1>
          <p>
            Somos una tienda especializada en videojuegos físicos y digitales.
            Ofrecemos títulos nuevos, clásicos y ediciones especiales para PC, consolas
            y dispositivos portátiles, con atención cercana y precios competitivos.
          </p>
        </div>
      </div>
    </div>
  </header>
);

export default Presentacion;
