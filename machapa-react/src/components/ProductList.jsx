import ProductCard from "./ProductCard.jsx";

/**
 * Grilla reutilizable de cards (juegos o accesorios).
 */
const ProductList = ({ productos, onAgregar, onDetalle, vacioTexto }) => {
  if (productos.length === 0) {
    return <p className="texto-suave mt-3">{vacioTexto}</p>;
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
          <ProductCard producto={producto} onAgregar={onAgregar} onDetalle={onDetalle} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
