import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Presentacion from "./components/Presentacion.jsx";
import CarruselDestacados from "./components/CarruselDestacados.jsx";
import PanelFiltros from "./components/PanelFiltros.jsx";
import ProductList from "./components/ProductList.jsx";
import ShoppingCart from "./components/ShoppingCart.jsx";
import ModalDetalle from "./components/ModalDetalle.jsx";
import AvisoOfertas from "./components/AvisoOfertas.jsx";
import Footer from "./components/Footer.jsx";
import { useCarrito } from "./hooks/useCarrito.js";
import {
  aplicarOfertas,
  CATEGORIAS_JUEGO,
  filtrarLista,
  ordenarLista
} from "./utils/formato.js";

/**
 * App: carga el catálogo, aplica ofertas, filtra y coordina el carrito.
 */
const App = () => {
  const [productos, setProductos] = useState([]);
  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [ordenJuegos, setOrdenJuegos] = useState("default");
  const [ordenAccesorios, setOrdenAccesorios] = useState("default");
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [avisoVisible, setAvisoVisible] = useState(true);
  const carrito = useCarrito();

  const cargarProductos = () => {
    setCargando(true);
    setError("");
    const base = import.meta.env.BASE_URL;

    Promise.all([
      fetch(`${base}data/productos.json`).then((respuesta) => {
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        return respuesta.json();
      }),
      fetch(`${base}data/destacados.json`).then((respuesta) => {
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        return respuesta.json();
      })
    ])
      .then(([lista, slides]) => {
        setProductos(aplicarOfertas(lista));
        setDestacados(slides);
      })
      .catch(() => {
        setError("No se pudo cargar el catálogo. Revisa la conexión o vuelve a intentarlo.");
      })
      .finally(() => {
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const moverStock = (id, delta) => {
    setProductos((actual) =>
      actual.map((producto) =>
        producto.id === id ? { ...producto, stock: Math.max(0, producto.stock + delta) } : producto
      )
    );
    setDetalle((actual) =>
      actual && actual.id === id ? { ...actual, stock: Math.max(0, actual.stock + delta) } : actual
    );
  };

  const agregarYAbrir = (producto) => {
    if (producto.stock < 1) return;
    carrito.agregar(producto);
    moverStock(producto.id, -1);
    setCarritoAbierto(true);
    setDetalle(null);
  };

  const quitarDelCarrito = (id, cantidad) => {
    carrito.eliminar(id);
    moverStock(id, cantidad);
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    const linea = carrito.items.find((item) => item.id === id);
    if (!linea) return;
    const disponible = productos.find((item) => item.id === id)?.stock ?? 0;
    const max = linea.cantidad + disponible;
    const segura = Math.min(Math.max(1, nuevaCantidad), max);
    const delta = linea.cantidad - segura;
    if (delta === 0) return;
    carrito.cambiarCantidad(id, segura);
    moverStock(id, delta);
  };

  const toggleCategoria = (clave) => {
    if (clave === "todos") {
      setCategorias([]);
      return;
    }
    setCategorias((actual) =>
      actual.includes(clave) ? actual.filter((item) => item !== clave) : [...actual, clave]
    );
  };

  const juegos = useMemo(() => {
    const filtrados = filtrarLista(
      productos.filter((item) => item.tipo === "juego"),
      { texto: busqueda, categorias }
    );
    return ordenarLista(filtrados, ordenJuegos);
  }, [productos, busqueda, categorias, ordenJuegos]);

  const accesorios = useMemo(() => {
    const filtrados = filtrarLista(
      productos.filter((item) => item.tipo === "accesorio"),
      { texto: busqueda, categorias: [] }
    );
    return ordenarLista(filtrados, ordenAccesorios);
  }, [productos, busqueda, ordenAccesorios]);

  const stocks = useMemo(
    () => Object.fromEntries(productos.map((item) => [item.id, item.stock])),
    [productos]
  );

  return (
    <>
      <AvisoOfertas
        visible={avisoVisible}
        onCerrar={() => setAvisoVisible(false)}
        onVerCategoria={(clave) => {
          setCategorias([clave]);
          setAvisoVisible(false);
          document.getElementById("juegos")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <Navbar
        totalProductos={carrito.totalProductos}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />
      <Presentacion />
      <CarruselDestacados destacados={destacados} />

      <main className="container py-5">
        <section id="juegos" className="mb-5">
          <h2 className="seccion-titulo mb-3">Juegos</h2>
          <p className="texto-suave mb-4">
            Acción e indie van con descuento de la semana. Filtra, ordena o abre el detalle.
          </p>
          <PanelFiltros
            busqueda={busqueda}
            onBusqueda={setBusqueda}
            categorias={CATEGORIAS_JUEGO}
            seleccionadas={categorias}
            onToggleCategoria={toggleCategoria}
            orden={ordenJuegos}
            onOrden={setOrdenJuegos}
          />

          {cargando ? (
            <p className="mensaje-ui info">Cargando catálogo...</p>
          ) : error ? (
            <div>
              <p className="mensaje-ui error">{error}</p>
              <button type="button" className="btn btn-secundario mt-2" onClick={cargarProductos}>
                Reintentar carga
              </button>
            </div>
          ) : (
            <ProductList
              productos={juegos}
              onAgregar={agregarYAbrir}
              onDetalle={setDetalle}
              vacioTexto="No hay juegos que coincidan con la búsqueda o las categorías."
            />
          )}
        </section>

        <section id="accesorios" className="mb-5">
          <h2 className="seccion-titulo mb-3">Accesorios y periféricos</h2>
          <p className="texto-suave mb-4">Un modelo por tipo. Ordena la lista o revisa el stock.</p>
          <div className="filtros-panel mb-4">
            <label htmlFor="ordenar-acc" className="h6 text-uppercase mb-2 d-block etiqueta-filtro">Ordenar</label>
            <select
              id="ordenar-acc"
              className="form-select orden-select"
              value={ordenAccesorios}
              onChange={(evento) => setOrdenAccesorios(evento.target.value)}
            >
              <option value="default">Por defecto</option>
              <option value="nombre-asc">Nombre A-Z</option>
              <option value="nombre-desc">Nombre Z-A</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
          {!cargando && !error ? (
            <ProductList
              productos={accesorios}
              onAgregar={agregarYAbrir}
              onDetalle={setDetalle}
              vacioTexto="No hay accesorios que coincidan con la búsqueda."
            />
          ) : null}
        </section>
      </main>

      <Footer />
      <ModalDetalle producto={detalle} onCerrar={() => setDetalle(null)} onAgregar={agregarYAbrir} />
      <ShoppingCart
        abierto={carritoAbierto}
        items={carrito.items}
        totalProductos={carrito.totalProductos}
        totalPrecio={carrito.totalPrecio}
        stocks={stocks}
        onCerrar={() => setCarritoAbierto(false)}
        onEliminar={quitarDelCarrito}
        onCambiarCantidad={cambiarCantidad}
      />
    </>
  );
};

export default App;
