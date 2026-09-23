import { useEffect, useRef, useState } from "react";

/**
 * Barra de navegación. El menú móvil y Productos se abren y cierran con React.
 */
const Navbar = ({ totalProductos, onAbrirCarrito }) => {
  const [menuMovil, setMenuMovil] = useState(false);
  const [menuProductos, setMenuProductos] = useState(false);
  const refNav = useRef(null);

  const cerrarMenus = () => {
    setMenuMovil(false);
    setMenuProductos(false);
  };

  useEffect(() => {
    const clicFuera = (evento) => {
      if (!refNav.current?.contains(evento.target)) {
        cerrarMenus();
      }
    };
    const tecla = (evento) => {
      if (evento.key === "Escape") cerrarMenus();
    };
    const alRedimensionar = () => {
      if (window.innerWidth >= 992) cerrarMenus();
    };
    document.addEventListener("click", clicFuera);
    document.addEventListener("keydown", tecla);
    window.addEventListener("resize", alRedimensionar);
    return () => {
      document.removeEventListener("click", clicFuera);
      document.removeEventListener("keydown", tecla);
      window.removeEventListener("resize", alRedimensionar);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-machapa sticky-top" aria-label="Menú principal" ref={refNav}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 me-auto me-lg-3" href="#inicio" onClick={cerrarMenus}>
          <img src={`${import.meta.env.BASE_URL}img/logo.jpg`} alt="Logotipo de Machapa Games" />
          Machapa Games
        </a>
        <div className={`collapse navbar-collapse flex-lg-grow-1${menuMovil ? " show" : ""}`} id="menuPrincipal">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#inicio" onClick={cerrarMenus}>Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#destacados" onClick={cerrarMenus}>Destacados</a>
            </li>
            <li className="nav-item dropdown">
              <button
                type="button"
                className={`nav-link dropdown-toggle btn-productos${menuProductos ? " show" : ""}`}
                id="menuProductos"
                aria-expanded={menuProductos}
                aria-haspopup="true"
                onClick={(evento) => {
                  evento.stopPropagation();
                  setMenuProductos((abierto) => !abierto);
                }}
              >
                Productos
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-dark dropdown-menu-machapa${menuProductos ? " show" : ""}`}
                aria-labelledby="menuProductos"
              >
                <li>
                  <a className="dropdown-item" href="#juegos" onClick={cerrarMenus}>Juegos</a>
                </li>
                <li>
                  <a className="dropdown-item" href="#accesorios" onClick={cerrarMenus}>Accesorios</a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contacto" onClick={cerrarMenus}>Contacto</a>
            </li>
          </ul>
        </div>
        <button
          className="navbar-toggler ms-2"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={menuMovil}
          aria-label={menuMovil ? "Cerrar el menú" : "Abrir el menú"}
          onClick={(evento) => {
            evento.stopPropagation();
            setMenuMovil((abierto) => !abierto);
            setMenuProductos(false);
          }}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <button type="button" className="btn-icono-carrito" onClick={onAbrirCarrito} aria-label="Abrir carrito">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          <span className="contador-carrito">{totalProductos}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
