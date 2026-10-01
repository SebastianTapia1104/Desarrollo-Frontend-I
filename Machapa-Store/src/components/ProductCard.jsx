import MarcoImagen from "./MarcoImagen.jsx";
import { formatearPesos, tieneOferta, etiquetaDe, textoStock, textoBotonCarrito } from "../utils/formato.js";

/**
 * Card reutilizable: imagen, precios, stock, detalle y botón de carrito.
 * El texto y el estilo del botón cambian si el producto ya está en el carrito.
 * En ese caso el clic solo abre el panel; no suma otra unidad.
 */
const ProductCard = ({ producto, onAgregar, onDetalle, enCarrito = false, compacto = false }) => {
  const enOferta = tieneOferta(producto);
  const sinStock = producto.stock <= 0;
  const src = `${import.meta.env.BASE_URL}img/${producto.imagen}`;
  const clasesCard = [
    "card",
    "card-machapa",
    "h-100",
    enCarrito ? "resaltada" : "",
    compacto ? "card-lista" : ""
  ].filter(Boolean).join(" ");

  return (
    <article className={clasesCard}>
      <div className="position-relative card-machapa-media">
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
          className={`btn mt-2${enCarrito && !sinStock ? " btn-en-carrito" : " btn-acento"}`}
          disabled={sinStock}
          onClick={() => onAgregar(producto)}
        >
          {textoBotonCarrito(producto, enCarrito)}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
