# Machapa Games

Sitio de e-commerce para una tienda de videojuegos, desarrollado con **Bootstrap 5.3** y **JavaScript**.

Proyecto del curso **Desarrollo Frontend I (PFY2201)** — actividad sumativa *Optimizando la lógica y rendimiento de una página web con JavaScript*.

**Autor:** Sebastián Tapia

**Sitio publicado:** [sebastiantapia1104.github.io/Desarrollo-Frontend-I](https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/)

## Visualización

La versión pública está en **GitHub Pages** (enlace de arriba). El catálogo y los accesorios se cargan con la Fetch API desde archivos JSON, por lo que el sitio requiere un origen HTTP o HTTPS.

En local se replica el mismo comportamiento con un servidor estático (por ejemplo Live Server en el editor, o `npx http-server -p 5500`). La dirección habitual es `http://localhost:5500`.

Abrir `index.html` con doble clic usa el protocolo `file://`. En ese modo el navegador bloquea la lectura de `assets/data/` y la página muestra el aviso de error de carga, con la opción de reintentar. Eso no indica un fallo del JSON: es la restricción de seguridad del navegador. El mismo archivo, servido por HTTP, pinta el catálogo con normalidad.

## Estructura

```
index.html
assets/css/estilos.css
assets/js/app.js
assets/img/
assets/data/catalogo.json      destacados y 30 juegos
assets/data/accesorios.json    6 periféricos
evidencias/
```

## Contenido del sitio

| Sección | Descripción |
|---|---|
| **Navegación** | Barra Bootstrap con Inicio, Destacados, Productos, Categorías (Juegos y Accesorios), Accesorios y Contacto. En pantallas pequeñas el menú se colapsa. El carrito permanece a la derecha, con el recuento de unidades. |
| **Inicio** | Logo y presentación de la tienda. |
| **Destacados** | Carrusel Bootstrap de seis títulos. Las diapositivas se construyen en el DOM (`createElement`) tras obtener el JSON. |
| **Productos** | Treinta juegos con imagen, nombre, precio y stock. Incluye búsqueda, filtros por categoría, orden y paginación (12 por página). |
| **Accesorios** | Seis periféricos (un modelo por tipo), con la misma lógica de ficha y carrito. |
| **Contacto y pie** | Datos de la tienda, formulario validado, dirección, correo, teléfono y redes. |
| **Carrito** | Panel lateral. Al añadir un producto se actualizan lista, subtotal, total y badge. Permite cambiar cantidad o quitar líneas. |
| **Modal** | «Ver detalle» abre una ficha Bootstrap (imagen, descripción, stock, precio y añadir al carrito). |

Identidad visual: fondo `#1a1a2e`, morado `#6c5ce7`, cian `#00cec9`. Precios en pesos chilenos.

## Interactividad y datos

- **click:** carrito, filtros, ficha de producto y apertura o cierre del panel.
- **submit:** búsqueda de productos y envío del formulario de contacto.
- **mouseover:** resaltado de las cards.
- **Catálogo:** Fetch con `async/await` hacia `assets/data/catalogo.json`.
- **Accesorios:** Fetch con promesas encadenadas (`.then()`) hacia `assets/data/accesorios.json`, en paralelo al catálogo, para dejar visibles ambas formas de asincronía.
- Si un JSON no responde, la interfaz muestra un mensaje de error y el botón **Reintentar carga**.

## Pruebas realizadas

Las capturas de `evidencias/` se tomaron el 19 de septiembre de 2026 en Chrome, con el sitio servido en `http://localhost:5500`.

- Escritorio (1366×860): carga del catálogo y de los accesorios en el DOM.
- Búsqueda con el término «Elden» (evento `submit`): el listado queda reducido a Elden Ring.
- «Añadir al carrito» (evento `click`): el panel muestra línea, cantidad y total.
- «Ver detalle»: modal Bootstrap con la ficha del producto.
- Vista móvil (390×844): menú hamburguesa desplegado.
- Navbar: menú de categorías Juegos y Accesorios.
- Pie de página: dirección, correo, teléfono y redes.
- Error de Fetch: se forzó un HTTP 404 sobre `catalogo.json`. La página mostró el aviso amigable y el botón de reintento, en lugar de quedar en blanco.
- Protocolo `file://`: al abrir el HTML sin servidor, el Fetch no obtiene los JSON y aparece el mismo tipo de mensaje de error; con Live Server o GitHub Pages la carga es correcta.

| Captura | Contenido |
|---|---|
| `evidencias/01-estructura-escritorio.png` | Página completa. |
| `evidencias/02-fetch-catalogo-productos.png` | Productos obtenidos por Fetch. |
| `evidencias/03-busqueda-submit.png` | Resultado de la búsqueda «Elden». |
| `evidencias/04-carrito-agregar.png` | Resumen del carrito. |
| `evidencias/05-modal-detalle.png` | Modal de ficha. |
| `evidencias/06-fetch-accesorios.png` | Accesorios cargados desde JSON. |
| `evidencias/07-footer-contacto.png` | Contacto y pie. |
| `evidencias/08-navbar-categorias.png` | Categorías de la barra. |
| `evidencias/09-navbar-movil.png` | Navegación en celular. |
| `evidencias/10-fetch-error-amigable.png` | Mensaje de error de carga y reintento. |
