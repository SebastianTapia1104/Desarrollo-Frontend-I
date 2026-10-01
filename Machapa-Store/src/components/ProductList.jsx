import ProductCard from "./ProductCard.jsx";

/**
 * Lista reutilizable de cards. Cambia de grilla a filas según la vista activa.
 */
const ProductList = ({
  productos,
  onAgregar,
  onDetalle,
  vacioTexto,
  idsEnCarrito,
  vista = "grilla"
}) => {
  if (productos.length === 0) {
    return <p className="texto-suave mt-3">{vacioTexto}</p>;
  }

  const compacto = vista === "lista";

  return (
    <div className={`row g-4${compacto ? " catalogo-lista" : ""}`}>
      {productos.map((producto) => (
        <div className={compacto ? "col-12" : "col-12 col-md-6 col-lg-4"} key={producto.id}>
          <ProductCard
            producto={producto}
            onAgregar={onAgregar}
            onDetalle={onDetalle}
            enCarrito={idsEnCarrito.has(producto.id)}
            compacto={compacto}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
