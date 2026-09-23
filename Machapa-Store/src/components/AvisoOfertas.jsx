/**
 * Cartel de ofertas abajo a la izquierda: no bloquea la navegación.
 */
const AvisoOfertas = ({ visible, onCerrar, onVerCategoria }) => {
  if (!visible) return null;

  const irA = (categoria) => {
    onVerCategoria(categoria);
  };

  return (
    <aside className="aviso-ofertas" aria-labelledby="aviso-titulo">
      <p className="aviso-ofertas-sello mb-2">Ofertas de la semana</p>
      <h2 id="aviso-titulo" className="h5 mb-3">¡Hay juegos con descuento!</h2>
      <ul className="list-unstyled mb-3">
        <li className="mb-2"><strong>Acción y aventura:</strong> 30% de descuento</li>
        <li><strong>Indie y novedades:</strong> 20% de descuento</li>
      </ul>
      <div className="aviso-ofertas-acciones">
        <button type="button" className="btn btn-acento" onClick={() => irA("accion")}>
          Acción y aventura
        </button>
        <button type="button" className="btn btn-acento" onClick={() => irA("indie")}>
          Indie y novedades
        </button>
        <button type="button" className="btn btn-secundario" onClick={onCerrar}>
          Cerrar
        </button>
      </div>
    </aside>
  );
};

export default AvisoOfertas;
