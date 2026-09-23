# Machapa Games

E-commerce de videojuegos en **React** (Vite) con componentes funcionales, `useState`, `useEffect` y renderizado condicional.

Proyecto del curso **Desarrollo Frontend I (PFY2201)** — actividad formativa *Construyendo componentes funcionales en React para un eCommerce interactivo*.

**Autor:** Sebastián Tapia

**Repositorio:** [github.com/SebastianTapia1104/Desarrollo-Frontend-I](https://github.com/SebastianTapia1104/Desarrollo-Frontend-I)

**Sitio publicado:** [sebastiantapia1104.github.io/Desarrollo-Frontend-I](https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/)

## Cómo ver la tienda

```bash
npm install
npm run dev
```

La URL local es `http://127.0.0.1:5173`. El catálogo se carga con Fetch desde `public/data/productos.json`, así que hace falta Vite o un servidor HTTP.

En GitHub Pages, `main` debe publicar la carpeta **`docs/`** (el resultado de `npm run build`), no la raíz. La raíz es el código de desarrollo y el navegador no puede ejecutar los `.jsx`.

## Estructura

```
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
