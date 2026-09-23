import MarcoImagen from "./MarcoImagen.jsx";
import { formatearPesos, tieneOferta, etiquetaDe, textoStock } from "../utils/formato.js";

/**
 * Card reutilizable: imagen completa, precios, stock, detalle y carrito.
 */
const ProductCard = ({ producto, onAgregar, onDetalle }) => {
  const enOferta = tieneOferta(producto);
  const sinStock = producto.stock <= 0;
  const src = `${import.meta.env.BASE_URL}img/${producto.imagen}`;

  return (
    <article className="card card-machapa h-100">
      <div className="position-relative">
        <MarcoImagen src={src} alt={producto.nombre} />
        {enOferta ? <span className="badge-oferta">Oferta</span> : null}
      </div>
      <div className="card-body d-flex flex-column">
        <p className="small text-info mb-1">{etiquetaDe(producto)}</p>
        <h3 className="card-title h5">{producto.nombre}</h3>
        <p className="card-text">{producto.descripcion}</p>
        <p className={`stock${sinStock ? " agotado" : ""}`}>{textoStock(producto.stock)}</p>
        <div className="mt-auto">
          {enOferta ? (
            <>
              <p className="precio-normal mb-0">Normal: {formatearPesos(producto.precioNormal)}</p>
              <p className="precio">Oferta: {formatearPesos(producto.precioOferta)}</p>
            </>
          ) : (
            <p className="precio">Precio: {formatearPesos(producto.precioNormal)}</p>
          )}
        </div>
        <button type="button" className="btn btn-secundario mt-2" onClick={() => onDetalle(producto)}>
          Ver detalle
        </button>
        <button
          type="button"
          className="btn btn-acento mt-2"
          disabled={sinStock}
          onClick={() => onAgregar(producto)}
        >
          {sinStock ? "Sin stock" : "Añadir al carrito"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
