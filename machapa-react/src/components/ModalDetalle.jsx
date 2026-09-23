import MarcoImagen from "./MarcoImagen.jsx";
import { formatearPesos, precioVigente, tieneOferta, etiquetaDe, textoStock } from "../utils/formato.js";

/**
 * Modal de ficha: detalle, stock y añadir al carrito.
 */
const ModalDetalle = ({ producto, onCerrar, onAgregar }) => {
  if (!producto) return null;

  const enOferta = tieneOferta(producto);
  const sinStock = producto.stock <= 0;
  const base = import.meta.env.BASE_URL;

  return (
    <div className="modal fade show d-block modal-machapa" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      <div className="modal-backdrop fade show" onClick={onCerrar} />
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="modal-titulo">{producto.nombre}</h2>
            <button type="button" className="btn-close btn-close-white" onClick={onCerrar} aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            <MarcoImagen src={`${base}img/${producto.imagen}`} alt={producto.nombre} className="card-frame mb-3" />
            <p className="small text-info mb-2">{etiquetaDe(producto)}</p>
            <p className="texto-suave">{producto.descripcion}</p>
            <p className={`stock${sinStock ? " agotado" : ""}`}>{textoStock(producto.stock)}</p>
            {enOferta ? (
              <>
                <p className="precio-normal mb-0">Normal: {formatearPesos(producto.precioNormal)}</p>
                <p className="precio mb-0">Oferta: {formatearPesos(producto.precioOferta)}</p>
              </>
            ) : (
              <p className="precio mb-0">Precio: {formatearPesos(precioVigente(producto))}</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cerrar</button>
            <button
              type="button"
              className="btn btn-acento"
              disabled={sinStock}
              onClick={() => onAgregar(producto)}
            >
              {sinStock ? "Sin stock" : "Añadir al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalle;
