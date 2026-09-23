import { formatearPesos } from "../utils/formato.js";

/**
 * Suma de unidades y monto del carrito.
 */
const CartTotal = ({ totalProductos, totalPrecio }) => (
  <div className="resumen-carrito">
    <p className="texto-suave mb-1">
      {totalProductos === 1 ? "1 producto" : `${totalProductos} productos`}
    </p>
    <p className="precio mb-3">Total: {formatearPesos(totalPrecio)}</p>
  </div>
);

export default CartTotal;
