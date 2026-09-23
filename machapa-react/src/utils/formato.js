/**
 * Etiquetas, descuentos de la campaña y helpers de catálogo.
 * Acción 30% e Indie 20%, como anuncia el cartel de ofertas.
 */
export const ETIQUETAS = {
  accion: "Acción y aventura",
  deportes: "Deportes y carreras",
  rpg: "Rol (RPG)",
  estrategia: "Estrategia",
  indie: "Indie y novedades"
};

export const DESCUENTOS = {
  accion: 0.3,
  indie: 0.2
};

export const CATEGORIAS_JUEGO = Object.keys(ETIQUETAS);

export const formatearPesos = (valor) =>
  "$" + Number(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const redondearOferta = (normal, porcentaje) =>
  Math.max(990, Math.round((normal * (1 - porcentaje)) / 1000) * 1000 - 10);

export const aplicarOfertas = (productos) =>
  productos.map((producto) => {
    const porcentaje = DESCUENTOS[producto.categoria];
    const stock = producto.stock ?? 10;
    if (!porcentaje) {
      return { ...producto, precioOferta: null, stock };
    }
    return {
      ...producto,
      precioOferta: redondearOferta(producto.precioNormal, porcentaje),
      stock
    };
  });

export const precioVigente = (producto) =>
  producto.precioOferta != null ? producto.precioOferta : producto.precioNormal;

export const tieneOferta = (producto) =>
  producto.precioOferta != null && producto.precioOferta < producto.precioNormal;

export const etiquetaDe = (producto) =>
  ETIQUETAS[producto.categoria] || producto.categoria;

export const coincideBusqueda = (producto, texto) => {
  const q = texto.trim().toLowerCase();
  if (!q) return true;
  return (
    producto.nombre.toLowerCase().includes(q) ||
    producto.descripcion.toLowerCase().includes(q)
  );
};

export const filtrarLista = (lista, { texto, categorias }) =>
  lista.filter((producto) => {
    const textoOk = coincideBusqueda(producto, texto);
    const categoriaOk = categorias.length === 0 || categorias.includes(producto.categoria);
    return textoOk && categoriaOk;
  });

export const ordenarLista = (lista, modo) => {
  const copia = [...lista];
  if (modo === "nombre-asc") {
    copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  } else if (modo === "nombre-desc") {
    copia.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
  } else if (modo === "precio-asc") {
    copia.sort((a, b) => precioVigente(a) - precioVigente(b));
  } else if (modo === "precio-desc") {
    copia.sort((a, b) => precioVigente(b) - precioVigente(a));
  }
  return copia;
};

export const textoStock = (cantidad) => {
  if (cantidad <= 0) return "Sin stock";
  return "Stock: " + cantidad + (cantidad === 1 ? " unidad" : " unidades");
};
