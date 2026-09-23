# Machapa Games

E-commerce de videojuegos en **React** (Vite) con componentes funcionales, `useState`, `useEffect` y renderizado condicional.

Proyecto del curso **Desarrollo Frontend I (PFY2201)** — actividad formativa *Construyendo componentes funcionales en React para un eCommerce interactivo*.

**Autor:** Sebastián Tapia

**Repositorio:** [github.com/SebastianTapia1104/Desarrollo-Frontend-I](https://github.com/SebastianTapia1104/Desarrollo-Frontend-I)

**Sitio publicado:** [sebastiantapia1104.github.io/Desarrollo-Frontend-I](https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/)

## Cómo ver la tienda

```bash
cd machapa-react
npm install
npm run dev
```

La URL local es `http://127.0.0.1:5173`. El catálogo se carga con Fetch desde `public/data/productos.json`, así que hace falta Vite o un servidor HTTP. En GitHub Pages se publica el resultado de `npm run build` (carpeta `dist`) en la rama `gh-pages`.

## Estructura

```
machapa-react/
  index.html
  vite.config.js
  public/img/
  public/data/productos.json
  public/data/destacados.json
  src/App.jsx
  src/main.jsx
  src/index.css
  src/components/Navbar.jsx
  src/components/Presentacion.jsx
  src/components/CarruselDestacados.jsx
  src/components/AvisoOfertas.jsx
  src/components/PanelFiltros.jsx
  src/components/ProductList.jsx
  src/components/ProductCard.jsx
  src/components/MarcoImagen.jsx
  src/components/ModalDetalle.jsx
  src/components/ShoppingCart.jsx
  src/components/CartTotal.jsx
  src/components/Footer.jsx
  src/hooks/useCarrito.js
  src/utils/formato.js
evidencias-semana7/
```

## Contenido

Cada producto muestra nombre, imagen completa (contain + fondo difuminado), descripción, stock, **precio normal** y **precio oferta** cuando hay campaña. Acción y aventura va con 30% e Indie con 20%. El carrito permite agregar, cambiar cantidad y quitar, con el total al precio vigente.

| Pieza | Rol |
|---|---|
| **Navbar** | Inicio, Destacados y Productos (despliega Juegos / Accesorios). Badge del carrito. |
| **Inicio** | Presentación de la tienda. |
| **Destacados** | Carrusel Bootstrap con seis títulos. |
| **Juegos** | Listado con búsqueda, categorías y orden. |
| **Accesorios** | Periféricos con la misma card reutilizada. |
| **AvisoOfertas** | Cartel de la campaña: Acción 30% e Indie 20%. |
| **ModalDetalle** | Ficha con stock y añadir al carrito. |
| **ShoppingCart + CartTotal** | Panel, unidades y total. |
| **useCarrito** | Estado del carrito con `const`/`let`. |
| **useEffect** | Carga del JSON, mensajes de carga o error y reintento. |

Identidad visual: fondo `#1a1a2e`, morado `#6c5ce7`, cian `#00cec9`. Precios en pesos chilenos.

## Pruebas realizadas

Capturas en `evidencias-semana7/`, tomadas el 23 de septiembre de 2026 en Chrome sobre `http://127.0.0.1:5173`.

- Listado completo con imagen, nombre, descripción, precio normal y oferta.
- Búsqueda «Elden» (`onChange`): queda Elden Ring.
- Añadir al carrito (`onClick`): línea, 1 producto y total con precio oferta.
- Quitar del carrito: mensaje condicional de carrito vacío.
- Accesorios con la misma card reutilizada.
- Navbar colapsada en 390×844.

| Captura | Contenido |
|---|---|
| `evidencias-semana7/01-listado-productos.png` | Página y listado. |
| `evidencias-semana7/02-precio-normal-y-oferta.png` | Precio de lista y oferta. |
| `evidencias-semana7/03-busqueda-onchange.png` | Filtro por texto. |
| `evidencias-semana7/04-carrito-agregar-total.png` | Agregar, contador y total. |
| `evidencias-semana7/05-carrito-vacio-condicional.png` | Carrito vacío tras quitar. |
| `evidencias-semana7/06-accesorios.png` | Periféricos. |
| `evidencias-semana7/07-navbar-movil.png` | Menú en celular. |
