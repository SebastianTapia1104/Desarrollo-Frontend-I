import { useState } from "react";
import { precioVigente } from "../utils/formato.js";

/**
 * Carrito compartido: agregar, quitar, cambiar cantidad y totales.
 */
export const useCarrito = () => {
  const [items, setItems] = useState([]);

  const agregar = (producto) => {
    setItems((actual) => {
      const indice = actual.findIndex((linea) => linea.id === producto.id);
      if (indice === -1) {
        return [...actual, { ...producto, cantidad: 1 }];
      }
      return actual.map((linea, i) => (
        i === indice ? { ...linea, cantidad: linea.cantidad + 1 } : linea
      ));
    });
  };

  const eliminar = (id) => {
    setItems((actual) => actual.filter((linea) => linea.id !== id));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setItems((actual) =>
      actual.map((linea) => (
        linea.id === id ? { ...linea, cantidad: nuevaCantidad } : linea
      ))
    );
  };

  const totalProductos = items.reduce((suma, linea) => suma + linea.cantidad, 0);
  const totalPrecio = items.reduce(
    (suma, linea) => suma + precioVigente(linea) * linea.cantidad,
    0
  );

  return {
    items,
    agregar,
    eliminar,
    cambiarCantidad,
    totalProductos,
    totalPrecio,
    vacio: items.length === 0
  };
};
