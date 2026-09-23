/**
 * Pie de página con datos de contacto y redes.
 */
const Footer = () => (
  <footer id="contacto" className="text-white text-center py-4 mt-auto">
    <div className="container">
      <h2 className="h4">Machapa Games</h2>
      <p className="mb-2">Dirección: Av. Mapache 1234, Santiago, Chile.</p>
      <p className="mb-1">
        Correo: <a className="link-light" href="mailto:contacto@machapagames.cl">contacto@machapagames.cl</a>
      </p>
      <p className="mb-2">
        Teléfono: <a className="link-light" href="tel:+56223456789">+56 2 2345 6789</a>
      </p>
      <p className="mb-2">Síguenos en redes sociales:</p>
      <ul className="list-inline mb-3">
        <li className="list-inline-item">
          <a className="link-light" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </li>
        <li className="list-inline-item">
          <a className="link-light" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
        </li>
        <li className="list-inline-item">
          <a className="link-light" href="https://x.com/" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
        </li>
      </ul>
      <p className="small mb-0">
        &copy; 2026 Machapa Games. Componentes funcionales en React — PFY2201 Semana 7.
      </p>
    </div>
  </footer>
);

export default Footer;
