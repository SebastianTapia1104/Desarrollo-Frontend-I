/**
 * Machapa Games — Semana 6 PFY2201
 * Flujo: iniciarSitio → Fetch JSON (catálogo async/await y accesorios .then)
 * → pintar DOM → eventos click, mouseover y submit (búsqueda y contacto).
 */
(function () {
  var POR_PAGINA = 12;
  var RUTA_IMG = "assets/img/";
  var CATEGORIAS = {
    accion: "Acción y aventura",
    deportes: "Deportes y carreras",
    rpg: "Rol (RPG)",
    estrategia: "Estrategia",
    indie: "Indie y novedades"
  };

  var seleccionadas = [];
  var paginaActual = 1;
  var textoBusqueda = "";
  var productosNodos = [];
  var ordenOriginal = [];
  var carrito = {};
  var stocks = {};
  var nodosStock = {};
  var modalInstancia = null;
  var detalleActual = null;
  var URL_PAGO = "https://www.gofundme.com/discover";

  /* Crea un nodo HTML y evita repetir document.createElement en cada función. */
  function crearElemento(etiqueta, clase, texto) {
    var nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto) nodo.textContent = texto;
    return nodo;
  }

  /* Inserta o reemplaza un mensaje de estado (carga, error o éxito) en el DOM. */
  function mostrarMensaje(contenedor, texto, tipo) {
    contenedor.textContent = "";
    if (!texto) return;
    var aviso = crearElemento("p", "mensaje-ui " + (tipo || "info"), texto);
    contenedor.appendChild(aviso);
  }

  /* Convierte un número a pesos chilenos con punto de miles. */
  function formatearPesos(valor) {
    return "$" + Number(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /* Extrae el valor numérico de un precio escrito como $49.990. */
  function numeroPrecio(texto) {
    return parseInt(String(texto).replace(/\D/g, ""), 10) || 0;
  }

  /* Texto de stock para las cards y el modal. */
  function textoStock(cantidad) {
    if (cantidad <= 0) return "Sin stock";
    return "Stock: " + cantidad + (cantidad === 1 ? " unidad" : " unidades");
  }

  /* Actualiza el párrafo de stock y el máximo del selector de cantidad. */
  function pintarStock(titulo, cantidad) {
    var nodo = nodosStock[titulo];
    if (nodo) {
      nodo.textContent = textoStock(cantidad);
      nodo.classList.toggle("agotado", cantidad <= 0);
    }
    if (detalleActual && detalleActual.titulo === titulo) {
      var modalStock = document.getElementById("modal-stock");
      modalStock.textContent = textoStock(cantidad);
      modalStock.classList.toggle("agotado", cantidad <= 0);
      document.getElementById("modal-agregar").disabled = cantidad <= 0;
    }
  }

  /* Selector − / número / + limitado por el stock disponible. */
  function crearControlCantidad(maxInicial, alCambiar) {
    var caja = crearElemento("div", "control-cantidad");
    var menos = crearElemento("button", "btn-cant", "−");
    var mas = crearElemento("button", "btn-cant", "+");
    var input = document.createElement("input");
    menos.type = "button";
    mas.type = "button";
    input.type = "number";
    input.className = "input-cant";
    input.min = "1";
    input.step = "1";

    function tope() {
      return parseInt(input.max, 10) || 0;
    }

    function leer() {
      return parseInt(input.value, 10) || 0;
    }

    function setValor(n) {
      var max = tope();
      if (max <= 0) {
        input.value = "0";
        return;
      }
      if (isNaN(n) || n < 1) n = 1;
      if (n > max) n = max;
      input.value = String(n);
    }

    function setMax(max) {
      var disponible = Math.max(0, max);
      input.max = String(disponible);
      input.disabled = disponible <= 0;
      menos.disabled = disponible <= 0;
      mas.disabled = disponible <= 0;
      if (disponible <= 0) input.value = "0";
      else setValor(leer() || 1);
    }

    function onUserChange() {
      if (alCambiar) alCambiar(leer());
    }

    menos.addEventListener("click", function () { setValor(leer() - 1); onUserChange(); });
    mas.addEventListener("click", function () { setValor(leer() + 1); onUserChange(); });
    input.addEventListener("change", function () { setValor(leer()); onUserChange(); });

    setMax(maxInicial);
    caja.appendChild(menos);
    caja.appendChild(input);
    caja.appendChild(mas);
    return { caja: caja, leer: leer, setMax: setMax, setValor: setValor };
  }

  /* Miniatura que cubre todo el recuadro de la card. */
  function crearMarcoImagen(src, alt) {
    var marco = crearElemento("div", "card-frame");
    var foto = crearElemento("img", "card-foto");
    foto.src = src;
    foto.alt = alt;
    marco.appendChild(foto);
    return marco;
  }

  /* Arma una diapositiva del carrusel con createElement y la agrega al DOM. */
  function crearSlide(destacado, indice) {
    var item = crearElemento("div", "carousel-item" + (indice === 0 ? " active" : ""));
    var marco = crearElemento("div", "carousel-frame");

    var fondo = crearElemento("img", "carousel-fondo");
    fondo.src = RUTA_IMG + destacado.img;
    fondo.alt = "";
    fondo.setAttribute("aria-hidden", "true");

    var foto = crearElemento("img", "carousel-foto");
    foto.src = RUTA_IMG + destacado.img;
    foto.alt = "Portada de " + destacado.titulo;

    var caption = crearElemento("div", "carousel-caption d-none d-md-block");
    caption.appendChild(crearElemento("h2", "h3 mb-1", destacado.titulo));
    caption.appendChild(crearElemento("p", "mb-0", destacado.texto));

    marco.appendChild(fondo);
    marco.appendChild(foto);
    marco.appendChild(caption);
    item.appendChild(marco);
    return item;
  }

  /* Pinta indicadores y slides del carrusel y lo inicia cada 3 segundos. */
  function pintarCarrusel(destacados) {
    var carrusel = document.getElementById("carruselDestacados");
    var indicadores = carrusel.querySelector(".carousel-indicators");
    var slides = carrusel.querySelector(".carousel-inner");
    indicadores.textContent = "";
    slides.textContent = "";

    destacados.forEach(function (item, i) {
      var boton = crearElemento("button");
      boton.type = "button";
      boton.setAttribute("data-bs-target", "#carruselDestacados");
      boton.setAttribute("data-bs-slide-to", String(i));
      boton.setAttribute("aria-label", "Diapositiva " + (i + 1));
      if (i === 0) {
        boton.className = "active";
        boton.setAttribute("aria-current", "true");
      }
      indicadores.appendChild(boton);
      slides.appendChild(crearSlide(item, i));
    });

    new bootstrap.Carousel(carrusel, { interval: 3000, ride: "carousel" });
  }

  /* Genera los botones de categoría y los inserta en el panel de filtros. */
  function pintarFiltros() {
    var grupo = document.getElementById("grupo-filtros");
    grupo.textContent = "";
    var opciones = [["todos", "Todos"]].concat(Object.keys(CATEGORIAS).map(function (clave) {
      return [clave, CATEGORIAS[clave]];
    }));

    opciones.forEach(function (par, i) {
      var btn = crearElemento("button", "btn filtro-cat" + (i === 0 ? " active" : ""), par[1]);
      btn.type = "button";
      btn.setAttribute("data-filtro", par[0]);
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      grupo.appendChild(btn);
    });
  }

  /* Abre el modal Bootstrap con la ficha del producto o accesorio. */
  function abrirDetalle(item) {
    detalleActual = item;
    var disponible = stocks[item.titulo] || 0;
    document.getElementById("modal-titulo").textContent = item.titulo;
    document.getElementById("modal-tipo").textContent = item.tipo || CATEGORIAS[item.categoria] || "";
    document.getElementById("modal-texto").textContent = item.texto;
    document.getElementById("modal-precio").textContent = item.precio;
    var foto = document.getElementById("modal-foto");
    foto.src = RUTA_IMG + item.img;
    foto.alt = item.titulo;
    pintarStock(item.titulo, disponible);
    document.getElementById("modal-agregar").disabled = disponible <= 0;
    if (!modalInstancia) {
      modalInstancia = new bootstrap.Modal(document.getElementById("modalProducto"));
    }
    modalInstancia.show();
  }

  /* Construye una card de juego con createElement, detalle y botón de carrito. */
  function crearCardProducto(producto) {
    var col = crearElemento("div", "col-12 col-md-6 col-lg-4 producto-item");
    col.setAttribute("data-categoria", producto.categoria);
    col.setAttribute("data-nombre", producto.titulo.toLowerCase());
    col.setAttribute("data-texto", (producto.texto || "").toLowerCase());
    stocks[producto.titulo] = producto.stock || 10;

    var article = crearElemento("article", "card card-machapa h-100");
    var body = crearElemento("div", "card-body d-flex flex-column");
    body.appendChild(crearElemento("p", "small text-info mb-1", CATEGORIAS[producto.categoria]));
    body.appendChild(crearElemento("h3", "card-title h5", producto.titulo));
    body.appendChild(crearElemento("p", "card-text", producto.texto));

    var stockNodo = crearElemento("p", "stock", textoStock(stocks[producto.titulo]));
    nodosStock[producto.titulo] = stockNodo;
    body.appendChild(stockNodo);
    body.appendChild(crearElemento("p", "precio mt-auto", producto.precio));

    var verDetalle = crearElemento("button", "btn btn-secundario mt-2", "Ver detalle");
    verDetalle.type = "button";
    verDetalle.addEventListener("click", function () {
      abrirDetalle(producto);
    });

    var alCarrito = crearElemento("button", "btn btn-acento mt-2", "Añadir al carrito");
    alCarrito.type = "button";
    alCarrito.addEventListener("click", function () {
      agregarAlCarrito(producto.titulo, producto.precio, 1);
    });

    body.appendChild(verDetalle);
    body.appendChild(alCarrito);
    article.appendChild(crearMarcoImagen(RUTA_IMG + producto.img, "Portada de " + producto.titulo));
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  /* Recorre el catálogo y agrega cada card a la grilla de productos. */
  function pintarProductos(productos) {
    var lista = document.getElementById("lista-productos");
    lista.textContent = "";
    productos.forEach(function (producto) {
      lista.appendChild(crearCardProducto(producto));
    });
    productosNodos = Array.prototype.slice.call(lista.children);
    ordenOriginal = productosNodos.slice();
  }

  /* Card de un periférico del catálogo local (un modelo real por tipo). */
  function crearCardAccesorio(item) {
    var col = crearElemento("div", "col-12 col-md-6 col-lg-4");
    stocks[item.titulo] = item.stock || 10;

    var article = crearElemento("article", "card card-machapa h-100");
    var body = crearElemento("div", "card-body d-flex flex-column");
    body.appendChild(crearElemento("p", "small text-info mb-1", item.tipo));
    body.appendChild(crearElemento("h3", "card-title h5", item.titulo));
    body.appendChild(crearElemento("p", "card-text", item.texto));

    var stockNodo = crearElemento("p", "stock", textoStock(stocks[item.titulo]));
    nodosStock[item.titulo] = stockNodo;

    var verDetalle = crearElemento("button", "btn btn-secundario mt-2", "Ver detalle");
    verDetalle.type = "button";
    verDetalle.addEventListener("click", function () {
      abrirDetalle(item);
    });

    var alCarrito = crearElemento("button", "btn btn-acento mt-2", "Añadir al carrito");
    alCarrito.type = "button";
    alCarrito.addEventListener("click", function () {
      agregarAlCarrito(item.titulo, item.precio, 1);
    });

    body.appendChild(stockNodo);
    body.appendChild(crearElemento("p", "precio mt-auto", item.precio));
    body.appendChild(verDetalle);
    body.appendChild(alCarrito);
    article.appendChild(crearMarcoImagen(RUTA_IMG + item.img, item.titulo));
    article.appendChild(body);
    col.appendChild(article);
    return col;
  }

  /* Pinta en la grilla los accesorios cargados con Fetch. */
  function pintarAccesorios(items) {
    var lista = document.getElementById("lista-accesorios");
    lista.textContent = "";
    items.forEach(function (item) {
      lista.appendChild(crearCardAccesorio(item));
    });
  }

  /* Suma las unidades de todas las líneas del carrito. */
  function unidadesEnCarrito() {
    var total = 0;
    Object.keys(carrito).forEach(function (clave) {
      total += carrito[clave].cantidad;
    });
    return total;
  }

  /* Refresca texto, subtotal y controles de una línea del carrito. */
  function pintarLineaCarrito(titulo) {
    var linea = carrito[titulo];
    if (!linea) return;
    var unitario = numeroPrecio(linea.precio);
    linea.texto.textContent = titulo;
    linea.detalle.textContent = linea.cantidad + " × " + linea.precio + " = " + formatearPesos(unitario * linea.cantidad);
    linea.control.setMax(stocks[titulo] + linea.cantidad);
    linea.control.setValor(linea.cantidad);
  }

  /* Muestra el total y el botón de pago solo si el carrito tiene productos. */
  function actualizarResumenCarrito() {
    var vacio = document.getElementById("carrito-vacio");
    var resumen = document.getElementById("resumen-carrito");
    var totalNodo = document.getElementById("carrito-total");
    var claves = Object.keys(carrito);
    var vacioAhora = claves.length === 0;

    vacio.classList.toggle("d-none", !vacioAhora);
    resumen.classList.toggle("d-none", vacioAhora);

    var total = 0;
    claves.forEach(function (clave) {
      total += numeroPrecio(carrito[clave].precio) * carrito[clave].cantidad;
    });
    totalNodo.textContent = "Total: " + formatearPesos(total);
    var unidades = unidadesEnCarrito();
    document.getElementById("contador-carrito").textContent = String(unidades);
    document.getElementById("contador-pestana").textContent = String(unidades);
  }

  /* Cambia la cantidad de una línea sin pasar el stock total. */
  function cambiarCantidadCarrito(titulo, nuevaCantidad) {
    var linea = carrito[titulo];
    if (!linea) return;
    var max = stocks[titulo] + linea.cantidad;
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > max) nuevaCantidad = max;
    if (nuevaCantidad === linea.cantidad) return;
    stocks[titulo] += linea.cantidad - nuevaCantidad;
    linea.cantidad = nuevaCantidad;
    pintarStock(titulo, stocks[titulo]);
    pintarLineaCarrito(titulo);
    actualizarResumenCarrito();
  }

  /* Abre o cierra el panel lateral del carrito. */
  function alternarCarrito(abrir) {
    var panel = document.getElementById("carrito");
    var fondo = document.getElementById("fondo-carrito");
    var pestana = document.getElementById("pestana-carrito");
    var botonNav = document.getElementById("abrir-carrito");
    var visible = abrir === undefined ? !panel.classList.contains("abierto") : abrir;

    panel.classList.toggle("abierto", visible);
    fondo.classList.toggle("abierto", visible);
    pestana.classList.toggle("oculta", visible);
    document.body.classList.toggle("carrito-abierto", visible);
    panel.setAttribute("aria-hidden", visible ? "false" : "true");
    botonNav.setAttribute("aria-expanded", visible ? "true" : "false");
    pestana.setAttribute("aria-expanded", visible ? "true" : "false");
  }

  /* Conecta los clics para expandir, contraer y pagar el carrito. */
  function configurarCarrito() {
    document.getElementById("abrir-carrito").addEventListener("click", function () {
      var menu = document.getElementById("menuPrincipal");
      if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
      alternarCarrito(true);
    });
    document.getElementById("pestana-carrito").addEventListener("click", function () {
      alternarCarrito(true);
    });
    document.getElementById("cerrar-carrito").addEventListener("click", function () {
      alternarCarrito(false);
    });
    document.getElementById("fondo-carrito").addEventListener("click", function () {
      alternarCarrito(false);
    });
    document.getElementById("btn-pagar").addEventListener("click", irAPagar);
    document.getElementById("modal-agregar").addEventListener("click", function () {
      if (!detalleActual) return;
      agregarAlCarrito(detalleActual.titulo, detalleActual.precio, 1);
      if (modalInstancia) modalInstancia.hide();
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") alternarCarrito(false);
    });
  }

  /* Agrega X unidades al carrito, sin superar el stock disponible. */
  function agregarAlCarrito(titulo, precio, cantidadPedida) {
    var lista = document.getElementById("lista-carrito");
    var disponible = stocks[titulo] || 0;
    var cantidad = Math.min(parseInt(cantidadPedida, 10) || 0, disponible);
    if (cantidad < 1) return;

    stocks[titulo] -= cantidad;
    pintarStock(titulo, stocks[titulo]);

    if (carrito[titulo]) {
      carrito[titulo].cantidad += cantidad;
      pintarLineaCarrito(titulo);
      actualizarResumenCarrito();
      alternarCarrito(true);
      return;
    }

    var item = crearElemento("li", "item-carrito");
    var info = crearElemento("div", "item-carrito-info");
    var texto = crearElemento("p", "mb-1 fw-semibold", titulo);
    var detalle = crearElemento("p", "mb-0 small texto-suave", "");
    info.appendChild(texto);
    info.appendChild(detalle);

    var control = crearControlCantidad(cantidad + (stocks[titulo] || 0), function (valor) {
      cambiarCantidadCarrito(titulo, valor);
    });

    var quitar = crearElemento("button", "btn btn-sm btn-outline-danger", "Quitar");
    quitar.type = "button";
    quitar.addEventListener("click", function () {
      stocks[titulo] += carrito[titulo].cantidad;
      lista.removeChild(item);
      delete carrito[titulo];
      pintarStock(titulo, stocks[titulo]);
      actualizarResumenCarrito();
    });

    item.appendChild(info);
    item.appendChild(control.caja);
    item.appendChild(quitar);
    lista.appendChild(item);

    carrito[titulo] = {
      precio: precio,
      cantidad: cantidad,
      texto: texto,
      detalle: detalle,
      control: control
    };
    pintarLineaCarrito(titulo);
    actualizarResumenCarrito();
    alternarCarrito(true);
  }

  /* Aviso de pago en desarrollo y redirección a GoFundMe. */
  function irAPagar() {
    alert("Función en desarrollo");
    window.location.href = URL_PAGO;
  }

  /* Devuelve el nombre del juego en minúsculas para ordenar. */
  function nombreProducto(item) {
    return item.querySelector(".card-title").textContent.trim().toLowerCase();
  }

  /* Extrae el precio numérico de una card para ordenar de menor a mayor. */
  function precioProducto(item) {
    return numeroPrecio(item.querySelector(".precio").textContent);
  }

  /* Reordena las cards según la opción del select de ordenamiento. */
  function aplicarOrden() {
    var lista = document.getElementById("lista-productos");
    var modo = document.getElementById("ordenar").value;
    var items = productosNodos.slice();
    if (modo === "nombre-asc") items.sort(function (a, b) { return nombreProducto(a).localeCompare(nombreProducto(b), "es"); });
    else if (modo === "nombre-desc") items.sort(function (a, b) { return nombreProducto(b).localeCompare(nombreProducto(a), "es"); });
    else if (modo === "precio-asc") items.sort(function (a, b) { return precioProducto(a) - precioProducto(b); });
    else if (modo === "precio-desc") items.sort(function (a, b) { return precioProducto(b) - precioProducto(a); });
    else items = ordenOriginal.slice();
    items.forEach(function (item) { lista.appendChild(item); });
  }

  /* Filtra el catálogo según categorías activas y el texto del formulario de búsqueda. */
  function itemsFiltrados() {
    var lista = document.getElementById("lista-productos");
    return Array.prototype.filter.call(lista.children, function (item) {
      var categoriaOk = seleccionadas.length === 0 || seleccionadas.indexOf(item.getAttribute("data-categoria")) !== -1;
      if (!categoriaOk) return false;
      if (!textoBusqueda) return true;
      var nombre = item.getAttribute("data-nombre") || "";
      var texto = item.getAttribute("data-texto") || "";
      return nombre.indexOf(textoBusqueda) !== -1 || texto.indexOf(textoBusqueda) !== -1;
    });
  }

  /* Dibuja los botones de página y el texto «Mostrando X–Y de Z». */
  function pintarPaginacion(total, totalPaginas) {
    var paginacion = document.querySelector("#paginacion ul");
    var infoPagina = document.getElementById("info-pagina");
    paginacion.textContent = "";

    if (total === 0) {
      infoPagina.textContent = "";
      return;
    }
    if (totalPaginas <= 1) {
      infoPagina.textContent = "Mostrando " + total + (total === 1 ? " juego" : " juegos");
      return;
    }

    function agregarBoton(texto, pagina, deshabilitado, activo) {
      var li = crearElemento("li", "page-item" + (deshabilitado ? " disabled" : "") + (activo ? " active" : ""));
      var btn = crearElemento("button", "page-link", texto);
      btn.type = "button";
      if (!deshabilitado && !activo) {
        btn.addEventListener("click", function () {
          paginaActual = pagina;
          actualizarCatalogo();
          document.getElementById("productos").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      li.appendChild(btn);
      paginacion.appendChild(li);
    }

    agregarBoton("Anterior", paginaActual - 1, paginaActual === 1, false);
    for (var i = 1; i <= totalPaginas; i++) agregarBoton(String(i), i, false, i === paginaActual);
    agregarBoton("Siguiente", paginaActual + 1, paginaActual === totalPaginas, false);

    var desde = (paginaActual - 1) * POR_PAGINA + 1;
    infoPagina.textContent = "Mostrando " + desde + "–" + Math.min(paginaActual * POR_PAGINA, total) + " de " + total + " juegos";
  }

  /* Aplica búsqueda, filtros, 12 juegos por página y actualiza la paginación. */
  function actualizarCatalogo() {
    var botones = document.querySelectorAll("[data-filtro]");
    var lista = document.getElementById("lista-productos");
    var vacio = document.getElementById("mensaje-vacio");

    botones.forEach(function (btn) {
      var filtro = btn.getAttribute("data-filtro");
      var activo = filtro === "todos" ? seleccionadas.length === 0 : seleccionadas.indexOf(filtro) !== -1;
      btn.classList.toggle("active", activo);
      btn.setAttribute("aria-pressed", activo ? "true" : "false");
    });

    var filtrados = itemsFiltrados();
    var totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    Array.prototype.forEach.call(lista.children, function (item) { item.classList.add("d-none"); });
    filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA).forEach(function (item) {
      item.classList.remove("d-none");
    });

    vacio.classList.toggle("d-none", filtrados.length !== 0);
    pintarPaginacion(filtrados.length, totalPaginas);
  }

  /* Evento click: filtra por categoría al pulsar los botones del panel. */
  function configurarFiltros() {
    document.querySelectorAll("[data-filtro]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filtro = btn.getAttribute("data-filtro");
        if (filtro === "todos") {
          seleccionadas = [];
        } else {
          var indice = seleccionadas.indexOf(filtro);
          if (indice === -1) seleccionadas.push(filtro);
          else seleccionadas.splice(indice, 1);
        }
        paginaActual = 1;
        actualizarCatalogo();
      });
    });

    document.getElementById("ordenar").addEventListener("change", function () {
      aplicarOrden();
      paginaActual = 1;
      actualizarCatalogo();
    });
  }

  /* Evento submit: filtra el catálogo con el texto del formulario de búsqueda. */
  function configurarBusqueda() {
    document.getElementById("form-busqueda").addEventListener("submit", function (evento) {
      evento.preventDefault();
      textoBusqueda = document.getElementById("buscar").value.trim().toLowerCase();
      paginaActual = 1;
      actualizarCatalogo();
      document.getElementById("productos").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* Evento mouseover/mouseout: resalta la card al pasar el cursor. */
  function configurarResaltado(contenedorId) {
    var contenedor = document.getElementById(contenedorId);
    contenedor.addEventListener("mouseover", function (evento) {
      var card = evento.target.closest(".card-machapa");
      if (card) card.classList.add("resaltada");
    });
    contenedor.addEventListener("mouseout", function (evento) {
      var card = evento.target.closest(".card-machapa");
      if (!card) return;
      if (card.contains(evento.relatedTarget)) return;
      card.classList.remove("resaltada");
    });
  }

  /* Cierra el menú hamburguesa al elegir un enlace (móvil). */
  function configurarNavegacion() {
    document.querySelectorAll(".navbar-nav .nav-link, .navbar-brand, .dropdown-item").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        if (enlace.id === "abrir-carrito" || enlace.classList.contains("dropdown-toggle")) return;
        var menu = document.getElementById("menuPrincipal");
        if (menu && menu.classList.contains("show")) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  /* Evento submit del contacto: valida nombre, correo y mensaje. */
  function configurarFormulario() {
    var form = document.getElementById("form-contacto");
    var caja = document.getElementById("mensaje-formulario");

    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var nombre = document.getElementById("nombre").value.trim();
      var correo = document.getElementById("correo").value.trim();
      var mensaje = document.getElementById("mensaje").value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

      if (nombre.length < 3) {
        mostrarMensaje(caja, "El nombre debe tener al menos 3 caracteres.", "error");
        return;
      }
      if (!emailOk) {
        mostrarMensaje(caja, "Ingresa un correo electrónico válido.", "error");
        return;
      }
      if (mensaje.length < 10) {
        mostrarMensaje(caja, "El mensaje debe tener al menos 10 caracteres.", "error");
        return;
      }

      mostrarMensaje(caja, "Gracias, " + nombre + ". Tu consulta fue enviada correctamente.", "ok");
      form.reset();
    });
  }

  /* Fetch del catálogo con async/await (más plano que .then, según la retroalimentación). */
  async function cargarCatalogo() {
    var estado = document.getElementById("estado-catalogo");
    mostrarMensaje(estado, "Cargando catálogo...", "info");

    try {
      var respuesta = await fetch("assets/data/catalogo.json");
      if (!respuesta.ok) throw new Error("No se pudo leer el catálogo (HTTP " + respuesta.status + ")");
      var datos = await respuesta.json();
      estado.textContent = "";
      pintarCarrusel(datos.destacados);
      pintarFiltros();
      pintarProductos(datos.productos);
      configurarFiltros();
      actualizarCatalogo();
    } catch (error) {
      mostrarMensaje(
        estado,
        "No pudimos cargar el catálogo de juegos. Revisa tu conexión o recarga la página. Detalle: " + error.message,
        "error"
      );
      var reintentar = crearElemento("button", "btn btn-secundario mt-2", "Reintentar carga");
      reintentar.type = "button";
      reintentar.addEventListener("click", function () { cargarCatalogo(); });
      estado.appendChild(reintentar);
    }
  }

  /* Fetch de accesorios con promesas encadenadas (.then), para comparar con async/await. */
  function cargarAccesorios() {
    var estado = document.getElementById("estado-accesorios");
    var lista = document.getElementById("lista-accesorios");
    lista.textContent = "";
    mostrarMensaje(estado, "Cargando accesorios...", "info");

    return fetch("assets/data/accesorios.json")
      .then(function (respuesta) {
        if (!respuesta.ok) throw new Error("No se pudo leer accesorios.json (HTTP " + respuesta.status + ")");
        return respuesta.json();
      })
      .then(function (items) {
        estado.textContent = "";
        pintarAccesorios(items);
      })
      .catch(function (error) {
        estado.textContent = "";
        mostrarMensaje(
          estado,
          "No pudimos cargar los accesorios. Inténtalo de nuevo en unos segundos. Detalle: " + error.message,
          "error"
        );
        var reintentar = crearElemento("button", "btn btn-secundario mt-2", "Reintentar carga");
        reintentar.type = "button";
        reintentar.addEventListener("click", cargarAccesorios);
        estado.appendChild(reintentar);
      });
  }

  /* Punto de entrada: conecta eventos y dispara las dos peticiones Fetch. */
  function iniciarSitio() {
    configurarNavegacion();
    configurarFormulario();
    configurarBusqueda();
    configurarCarrito();
    configurarResaltado("lista-productos");
    configurarResaltado("lista-accesorios");
    cargarCatalogo();
    cargarAccesorios();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarSitio);
  } else {
    iniciarSitio();
  }
})();
