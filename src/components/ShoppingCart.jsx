import { formatearPesos, precioVigente } from "../utils/formato.js";
import CartTotal from "./CartTotal.jsx";

/**
 * Panel del carrito: líneas, cantidad, quitar y total.
 */
const ShoppingCart = ({
  abierto,
  items,
  totalProductos,
  totalPrecio,
  stocks,
  onCerrar,
  onEliminar,
  onCambiarCantidad
}) => (
  <>
    <div
      id="fondo-carrito"
      className={abierto ? "fondo-carrito abierto" : "fondo-carrito"}
      onClick={onCerrar}
    />
    <aside
      id="carrito"
      className={abierto ? "panel-carrito abierto" : "panel-carrito"}
      aria-labelledby="titulo-carrito"
      aria-hidden={abierto ? "false" : "true"}
    >
      <div className="panel-carrito-cabecera">
        <h2 id="titulo-carrito" className="h4 mb-0">Carrito de compras</h2>
        <button type="button" className="btn-cerrar-carrito" onClick={onCerrar} aria-label="Cerrar carrito">
          &times;
        </button>
      </div>

      {items.length === 0 ? (
        <p className="texto-suave">El carrito está vacío. Agrega un producto desde el catálogo.</p>
      ) : (
        <>
          <ul className="lista-carrito">
            {items.map((linea) => {
              const unitario = precioVigente(linea);
              const max = linea.cantidad + (stocks[linea.id] ?? 0);
              return (
                <li className="item-carrito" key={linea.id}>
                  <div className="item-carrito-info">
                    <p className="mb-1 fw-semibold">{linea.nombre}</p>
                    <p className="mb-0 small texto-suave">
                      {linea.cantidad} × {formatearPesos(unitario)} = {formatearPesos(unitario * linea.cantidad)}
                    </p>
                    <div className="control-cantidad">
                      <button
                        type="button"
                        className="btn-cant"
                        disabled={linea.cantidad <= 1}
                        onClick={() => onCambiarCantidad(linea.id, linea.cantidad - 1)}
                      >
                        −
                      </button>
                      <span className="input-cant d-inline-flex align-items-center justify-content-center">
                        {linea.cantidad}
                      </span>
                      <button
                        type="button"
                        className="btn-cant"
                        disabled={linea.cantidad >= max}
                        onClick={() => onCambiarCantidad(linea.id, linea.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onEliminar(linea.id, linea.cantidad)}
                  >
                    Quitar
                  </button>
                </li>
              );
            })}
          </ul>
          <CartTotal totalProductos={totalProductos} totalPrecio={totalPrecio} />
        </>
      )}
    </aside>
  </>
);

export default ShoppingCart;
