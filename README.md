# Machapa Games

E-commerce de videojuegos en **React** (Vite) con componentes funcionales, `useState`, `useEffect` y renderizado condicional.

Proyecto del curso **Desarrollo Frontend I (PFY2201)** — Evaluación Final Transversal (Semana 9).

**Autor:** Sebastián Tapia

**Repositorio:** [github.com/SebastianTapia1104/Desarrollo-Frontend-I](https://github.com/SebastianTapia1104/Desarrollo-Frontend-I)

**Sitio publicado:** [sebastiantapia1104.github.io/Desarrollo-Frontend-I](https://sebastiantapia1104.github.io/Desarrollo-Frontend-I/)

## Cómo ver la tienda

```bash
cd Machapa-Store
npm install
npm run dev
```

La URL local es `http://127.0.0.1:5173`. El catálogo se carga con Fetch desde `public/data/productos.json` y el carrusel desde `public/data/destacados.json`. `node_modules` no forma parte de la entrega: se regenera con `npm install`.

La carpeta **`docs/`** es el sitio ya compilado para GitHub Pages (`main` → `/docs`). El código que se edita está en **`Machapa-Store/`**. Para actualizar Pages:

```bash
cd Machapa-Store
npm run build
```

Ese comando vacía `docs/` y deja `assets/app.js` y `assets/estilos.css` (nombres fijos, sin hash). `npm run preview` sirve esa misma build en local.

Las capturas de la entrega están en **`Evidencias/`**.

## Estructura

El repositorio tiene el README, el sitio publicado, las evidencias de la entrega y el proyecto React.

```
README.md                         Este archivo
docs/                             Sitio compilado para GitHub Pages
  assets/app.js                   JavaScript compilado (sin hash)
  assets/estilos.css              Estilos compilados (sin hash)
Evidencias/                       Capturas de la entrega
  01-catalogo-datos-dinamicos.png Catálogo cargado con Fetch
  02-carrito-vacio.png            Carrito vacío (renderizado condicional)
  03-carrito-con-productos.png    Producto agregado, cantidad y total
  04-boton-en-el-carrito.png      Botón En el carrito
  05-carrito-despues-de-quitar.png Tras quitar, el carrito vuelve a vacío
  06-vista-lista.png              Vista en lista
Machapa-Store/                    Proyecto React (código fuente)
  index.html                      Punto de entrada de Vite
  package.json                    Dependencias y scripts (dev, build, preview)
  vite.config.js                  React, base relativa ./ y build hacia ../docs
  public/
    .nojekyll                     Evita que GitHub Pages procese el sitio con Jekyll
    favicon.svg
    data/
      productos.json              Catálogo: juegos y accesorios (nombre, precio, stock, imagen…)
      destacados.json             Diapositivas del carrusel
    img/                          Portadas, logo y fotos de accesorios
  src/
    main.jsx                      Monta App y carga Bootstrap
    App.jsx                       Estado global: catálogo, filtros, detalle y carrito
    index.css                     Identidad visual de la tienda
    components/
      Navbar.jsx                  Menú, desplegable Productos y acceso al carrito
      Presentacion.jsx            Bloque de inicio (#inicio)
      CarruselDestacados.jsx      Carrusel automático de portadas
      PanelFiltros.jsx            Búsqueda, categorías, orden y vista grilla/lista
      ProductList.jsx             Lista reutilizable de cards (grilla o filas)
      ProductCard.jsx             Card: precios, stock y botón En el carrito
      MarcoImagen.jsx             Imagen completa (contain) sobre fondo difuminado
      ModalDetalle.jsx            Ficha emergente del producto
      FormularioContacto.jsx      Contacto: validación, envío y confirmación
      ShoppingCart.jsx            Panel lateral del carrito
      CartTotal.jsx               Unidades y total a pagar
      AvisoOfertas.jsx            Cartel de la campaña de la semana
      Footer.jsx                  Dirección, correo, teléfono y redes
    hooks/
      useCarrito.js               Agregar, quitar, cantidad y totales
    utils/
      formato.js                  Pesos CLP, ofertas, filtros, orden y stock
```

`App.jsx` coordina la carga del JSON, aplica las ofertas de campaña, filtra y ordena las listas, y mantiene el stock alineado con el carrito. Los componentes reciben datos y callbacks por props; no hay clases.

## Por qué se usa `useMemo`

`juegos`, `accesorios`, `stocks` e `idsEnCarrito` se calculan con `useMemo`. Cada vez que cambia un filtro, una búsqueda o el carrito, hay que recorrer el catálogo completo. Sin memoización React volvería a filtrar y ordenar en cada render (abrir el modal, pulsar el menú, escribir una letra), aunque los datos no hayan cambiado.

`useMemo` guarda el último resultado y solo recalcula cuando cambian sus dependencias (`productos`, `busqueda`, `categorias`, el modo de orden o las líneas del carrito).

No haría falta si el catálogo fuera de pocos ítems fijos, si el cálculo no se reutilizara en el mismo render o si el filtrado viviera en el servidor. En este proyecto el JSON se carga una vez y el usuario combina categorías, orden y búsqueda en el cliente, así que el costo de filtrar 36 productos en cada tecla se nota menos, pero la intención (no repetir trabajo) es la que se espera justificar en la EFT.

## Catálogo y ofertas

Cada producto muestra nombre, categoría, descripción, stock, imagen completa (contain + fondo difuminado), **precio normal** y **precio oferta** cuando hay campaña.

Hay dos tipos de ítem:

- **Juegos:** categorías Acción y aventura, Deportes y carreras, Rol (RPG), Estrategia, Indie y novedades.
- **Accesorios:** un modelo por tipo (audífonos, teclado, mouse, control, monitor y silla).

La campaña de la semana aplica descuento según categoría: **Acción y aventura 30%** e **Indie y novedades 20%**. El resto se vende al precio normal. Los montos van en pesos chilenos. El carrito siempre cobra el precio vigente (oferta si existe).

Identidad visual: fondo `#1a1a2e`, morado `#6c5ce7`, cian `#00cec9`.

## Interacciones

### Aviso de ofertas

Al cargar la página aparece un cartel abajo a la izquierda. No cubre el menú ni impide recorrer la tienda.

- **Acción y aventura:** cierra el aviso, filtra la lista de juegos a esa categoría y baja hasta **Juegos**.
- **Indie y novedades:** igual, con el filtro indie.
- **Cerrar:** oculta el cartel sin cambiar el catálogo.

### Navegación

La barra queda fija arriba.

- **Logo / Inicio:** vuelve al bloque de presentación.
- **Destacados:** baja al carrusel.
- **Productos:** abre un menú con **Juegos** y **Accesorios** (no salta al catálogo hasta elegir una opción).
- **Contacto:** baja al formulario (nombre, correo, tema y mensaje).
- **Ícono del carrito:** abre el panel; el número indica cuántas unidades hay.
- En móvil, el botón hamburguesa abre y cierra el menú. Clic fuera, Escape o pasar a escritorio también lo cierra.

### Carrusel de destacados

Las diapositivas salen de `destacados.json`. Avanzan solas cada 3 segundos. Se puede ir a la anterior, a la siguiente o saltar con los indicadores.

### Catálogo de juegos

- **Buscar:** filtra en vivo por nombre o descripción (también afecta accesorios).
- **Categoría:** chips para Todos o una o más categorías a la vez. Pulsar de nuevo quita el filtro.
- **Ordenar:** por defecto, nombre A–Z / Z–A, o precio menor–mayor / mayor–menor (usa el precio vigente).
- **Cambiar a vista lista / grilla:** el botón cambia de texto y alterna el layout del catálogo.
- Si no hay coincidencias, se muestra un mensaje en lugar de la grilla.
- Si el JSON no carga, aparece un error con **Reintentar carga**.

### Cards de producto

En juegos y accesorios cada card permite:

- Ver la portada completa, la categoría, la descripción y el stock.
- Distinguir oferta (badge y precio tachado vs. precio de campaña).
- **Ver detalle:** abre la ficha en un modal.
- **Añadir al carrito:** suma una unidad, baja el stock y abre el carrito. El botón pasa a **En el carrito** (otro color y la card queda resaltada). Un segundo clic ya no agrega otra unidad: solo abre el carrito y marca esa línea para encontrarla rápido. Si no hay stock, queda **Sin stock**.

### Accesorios

Misma lista de cards, con un selector de orden propio (nombre o precio) y el mismo botón de vista. No usa los chips de categoría de juegos.

### Detalle del producto

El modal muestra imagen, categoría, descripción, stock y precios.

- **Añadir al carrito** funciona igual que en la card y cierra el modal. Si el producto ya está en el carrito, el botón **En el carrito** solo abre el panel y resalta esa línea.
- **Cerrar**, la X o el fondo oscuro cierran sin comprar.

### Carrito

Panel lateral. Se cierra con la X o haciendo clic en el fondo.

- Lista cada línea: nombre, cantidad × precio vigente y subtotal.
- **− / +** cambia la cantidad. El mínimo es 1; el máximo es lo que hay en el carrito más el stock restante. Si solo queda una unidad, **−** se deshabilita.
- **Quitar** saca la línea completa y devuelve esas unidades al stock.
- Abajo se ven el total de unidades y el **total a pagar**.
- Si no hay ítems, se indica que el carrito está vacío.

El stock de la card, del modal y del carrito se mantiene sincronizado: agregar baja unidades; quitar o bajar cantidad las restaura. Al abrir el carrito desde **En el carrito**, esa línea parpadea y queda con borde cian para ubicarla en listas largas.

### Contacto

La sección **Contacto** tiene un formulario con nombre, mail de contacto, tema y mensaje.

- Al enviar, ningún campo puede quedar vacío. El correo debe tener formato válido y el mensaje al menos 10 caracteres.
- El nombre y el tema admiten hasta 40 caracteres y el mensaje 500. El correo no tiene tope.
- En la ventana de confirmación, nombre y tema van en texto simple. El correo se ve en 2 líneas (con scroll solo si no cabe) y el mensaje en 3.
- Si algo falla, el error aparece bajo el campo y el envío no se completa.
- Si todo está bien, se abre una ventana con la confirmación y una copia del mensaje (nombre, correo, tema y texto). Los campos del formulario se vacían en ese momento.
- **Entendido**, la X o el fondo oscuro cierran la ventana.

El pie mantiene dirección, correo (`mailto`), teléfono (`tel`) y enlaces a Instagram, Facebook y X.
