import { ETIQUETAS } from "../utils/formato.js";

/**
 * Búsqueda, chips de categoría y orden. onChange filtra en vivo.
 */
const PanelFiltros = ({
  busqueda,
  onBusqueda,
  categorias,
  seleccionadas,
  onToggleCategoria,
  orden,
  onOrden
}) => {
  const enviar = (evento) => {
    evento.preventDefault();
  };

  return (
    <div className="filtros-panel mb-4">
      <form className="mb-4" role="search" onSubmit={enviar}>
        <label htmlFor="buscar" className="h6 text-uppercase mb-2 d-block etiqueta-filtro">
          Buscar
        </label>
        <div className="input-group busqueda-grupo">
          <input
            className="form-control campo-oscuro"
            type="search"
            id="buscar"
            name="buscar"
            placeholder="Nombre o descripción..."
            value={busqueda}
            onChange={(evento) => onBusqueda(evento.target.value)}
            autoComplete="off"
          />
          <button className="btn btn-acento" type="submit">Buscar</button>
        </div>
      </form>

      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
        <div>
          <h3 className="h6 text-uppercase mb-2 etiqueta-filtro">Categoría</h3>
          <div className="d-flex flex-wrap gap-2" role="group" aria-label="Filtros de categoría">
            <button
              type="button"
              className={`btn filtro-cat${seleccionadas.length === 0 ? " active" : ""}`}
              aria-pressed={seleccionadas.length === 0}
              onClick={() => onToggleCategoria("todos")}
            >
              Todos
            </button>
            {categorias.map((clave) => {
              const activa = seleccionadas.includes(clave);
              return (
                <button
                  key={clave}
                  type="button"
                  className={`btn filtro-cat${activa ? " active" : ""}`}
                  aria-pressed={activa}
                  onClick={() => onToggleCategoria(clave)}
                >
                  {ETIQUETAS[clave] || clave}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="ordenar" className="h6 text-uppercase mb-2 d-block etiqueta-filtro">Ordenar</label>
          <select
            id="ordenar"
            className="form-select orden-select"
            value={orden}
            onChange={(evento) => onOrden(evento.target.value)}
          >
            <option value="default">Por defecto</option>
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PanelFiltros;
