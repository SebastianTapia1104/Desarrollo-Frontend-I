# Machapa Games — PFY2201 Semana 6

Tienda de videojuegos (e-commerce) hecha con **Bootstrap 5.3** y **JavaScript**.

Actividad sumativa: *Optimizando la lógica y rendimiento de una página web con JavaScript*.

- **Alumno:** Sebastián Tapia
- **Curso:** Desarrollo Frontend I (PFY2201)
- Repositorio: https://github.com/SebastianTapia1104/Desarrollo-Frontend-I
- Sitio en GitHub Pages: https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/

## Cómo abrir el sitio

No abras `index.html` con doble clic (`file://`). El `fetch` de los JSON no funciona así.

1. Abre esta carpeta en Cursor o VS Code.
2. Usa **Live Server**, o en una terminal:

```bash
npx --yes http-server -p 5500 -c-1
```

3. Entra a `http://localhost:5500`.

## Estructura del proyecto

```
index.html
assets/css/estilos.css
assets/js/app.js
assets/img/                  portadas, accesorios y logo
assets/data/catalogo.json    6 destacados + 30 juegos
assets/data/accesorios.json  6 periféricos
evidencias/                  capturas de la entrega
README.md
```

ZIP para AVA: `Sebastian_Tapia_PFY2201_Optimizacion_Semana6.zip`.

## Cómo está distribuida la página

| Sección | Qué hace |
|---|---|
| **Navbar** | Inicio, Destacados, Productos, Categorías (Juegos y Accesorios), Accesorios, Contacto. En móvil se colapsa. El carrito queda a la derecha, con el número de unidades. |
| **Inicio** | Logo y presentación de la tienda. |
| **Destacados** | Carrusel Bootstrap con 6 juegos. Las diapositivas se arman con `createElement` cuando llega el JSON. |
| **Productos** | 30 juegos desde `catalogo.json`: imagen, nombre, precio y stock. Búsqueda, filtros, orden y 12 por página. |
| **Accesorios** | 6 periféricos desde `accesorios.json`, con el mismo tipo de card, detalle y carrito. |
| **Contacto** | Datos de la tienda y formulario validado. |
| **Footer** | Dirección, correo, teléfono e Instagram / Facebook / X. |
| **Carrito** | Panel lateral. Al añadir un producto se actualizan la lista, el subtotal, el total y el badge. Se puede cambiar cantidad o quitar. |
| **Modal** | «Ver detalle» abre una ficha Bootstrap (imagen, texto, stock, precio y añadir al carrito). |

Marca: fondo `#1a1a2e`, morado `#6c5ce7`, cian `#00cec9`. Precios en pesos chilenos.

## Interactividad y datos

- **click:** añadir al carrito, filtros, ver detalle, abrir/cerrar carrito.
- **submit:** formulario de búsqueda de productos y formulario de contacto.
- **mouseover:** resalta las cards.
- **Fetch del catálogo:** `async/await` (código más plano, según la retroalimentación de Semana 5).
- **Fetch de accesorios:** promesas encadenadas con `.then()`, para comparar ambas formas.
- Si un JSON no carga, se muestra un mensaje amigable y el botón **Reintentar carga**.

## Evidencias

Capturas en `evidencias/`, tomadas el 19-09-2026 en Chrome sobre `http://localhost:5500`.

Cómo se probaron:

1. Servidor local HTTP (no `file://`), para que `fetch` funcione.
2. Escritorio 1366×860: se esperó a que catálogo y accesorios pintaran cards en el DOM.
3. Se envió la búsqueda «Elden» (`submit`).
4. Se pulsó «Añadir al carrito» (`click`) y se comprobó el resumen (cantidad y total).
5. Se abrió «Ver detalle» (modal Bootstrap).
6. Móvil 390×844: menú hamburguesa abierto.
7. Se simuló un HTTP 404 en `catalogo.json` para ver el mensaje de error.

| Archivo | Qué demuestra |
|---|---|
| `evidencias/01-estructura-escritorio.png` | Página completa: navbar, inicio, carrusel, productos, accesorios, contacto y pie. |
| `evidencias/02-fetch-catalogo-productos.png` | Fetch del JSON: cards con imagen, nombre y precio. |
| `evidencias/03-busqueda-submit.png` | Búsqueda «Elden»: queda solo Elden Ring. |
| `evidencias/04-carrito-agregar.png` | Carrito con línea, subtotal y total. |
| `evidencias/05-modal-detalle.png` | Modal Bootstrap con la ficha del producto. |
| `evidencias/06-fetch-accesorios.png` | Segundo Fetch: periféricos. |
| `evidencias/07-footer-contacto.png` | Pie con dirección, correo, teléfono y redes. |
| `evidencias/08-navbar-categorias.png` | Navbar con Juegos y Accesorios. |
| `evidencias/09-navbar-movil.png` | Menú hamburguesa en celular. |
| `evidencias/10-fetch-error-amigable.png` | Error de carga (HTTP 404) y botón Reintentar. |

## Entrega

1. **AVA:** el ZIP de la raíz (HTML, `assets/` y evidencias).
2. **GitHub:** mismos archivos en `main` y rama `gh-pages` para el sitio público.
3. En AVA, el enlace del repositorio y el del despliegue.
