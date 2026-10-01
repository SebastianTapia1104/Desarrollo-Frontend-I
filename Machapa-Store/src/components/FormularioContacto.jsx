import { useLayoutEffect, useRef, useState } from "react";

const VACIO = { nombre: "", email: "", tema: "", mensaje: "" };

const LIMITE = {
  nombre: 40,
  tema: 40,
  mensaje: 500
};

const correoValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

const validar = (datos) => {
  const errores = {};
  const nombre = datos.nombre.trim();
  const email = datos.email.trim();
  const tema = datos.tema.trim();
  const mensaje = datos.mensaje.trim();

  if (!nombre) {
    errores.nombre = "El nombre no puede quedar vacío.";
  } else if (nombre.length < 2) {
    errores.nombre = "Ingresa al menos 2 caracteres.";
  } else if (nombre.length > LIMITE.nombre) {
    errores.nombre = `El nombre no puede superar los ${LIMITE.nombre} caracteres.`;
  }

  if (!email) {
    errores.email = "El correo no puede quedar vacío.";
  } else if (!correoValido(email)) {
    errores.email = "Ingresa un correo válido, por ejemplo nombre@correo.cl";
  }

  if (!tema) {
    errores.tema = "El tema no puede quedar vacío.";
  } else if (tema.length > LIMITE.tema) {
    errores.tema = `El tema no puede superar los ${LIMITE.tema} caracteres.`;
  }

  if (!mensaje) {
    errores.mensaje = "El mensaje no puede quedar vacío.";
  } else if (mensaje.length < 10) {
    errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  } else if (mensaje.length > LIMITE.mensaje) {
    errores.mensaje = `El mensaje no puede superar los ${LIMITE.mensaje} caracteres.`;
  }

  return errores;
};

/**
 * Formulario de contacto: valida campos, muestra el envío y luego limpia el formulario.
 */
const FormularioContacto = () => {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(null);
  const [mailConScroll, setMailConScroll] = useState(false);
  const refMail = useRef(null);

  useLayoutEffect(() => {
    if (!enviado) {
      setMailConScroll(false);
      return;
    }
    const nodo = refMail.current;
    if (!nodo) return;
    setMailConScroll(nodo.scrollHeight > nodo.clientHeight + 1);
  }, [enviado]);

  const cambiar = (campo) => (evento) => {
    let valor = evento.target.value;
    if (LIMITE[campo]) {
      valor = valor.slice(0, LIMITE[campo]);
    }
    setDatos((actual) => ({ ...actual, [campo]: valor }));
    if (errores[campo]) {
      setErrores((actual) => {
        const siguiente = { ...actual };
        delete siguiente[campo];
        return siguiente;
      });
    }
  };

  const enviar = (evento) => {
    evento.preventDefault();
    const revisados = validar(datos);
    if (Object.keys(revisados).length > 0) {
      setErrores(revisados);
      setEnviado(null);
      return;
    }

    setEnviado({
      nombre: datos.nombre.trim(),
      email: datos.email.trim(),
      tema: datos.tema.trim(),
      mensaje: datos.mensaje.trim()
    });
    setDatos(VACIO);
    setErrores({});
  };

  const cerrarConfirmacion = () => setEnviado(null);

  return (
    <>
      <form className="formulario-contacto" noValidate onSubmit={enviar}>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="contacto-nombre" className="form-label etiqueta-filtro">Nombre</label>
            <input
              id="contacto-nombre"
              name="nombre"
              className={`form-control campo-oscuro${errores.nombre ? " is-invalid" : ""}`}
              type="text"
              autoComplete="name"
              value={datos.nombre}
              maxLength={LIMITE.nombre}
              onChange={cambiar("nombre")}
            />
            {errores.nombre ? <div className="invalid-feedback d-block">{errores.nombre}</div> : (
              <div className="form-text texto-contador">{datos.nombre.length}/{LIMITE.nombre}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="contacto-email" className="form-label etiqueta-filtro">Mail de contacto</label>
            <input
              id="contacto-email"
              name="email"
              className={`form-control campo-oscuro${errores.email ? " is-invalid" : ""}`}
              type="email"
              autoComplete="email"
              value={datos.email}
              onChange={cambiar("email")}
            />
            {errores.email ? <div className="invalid-feedback d-block">{errores.email}</div> : null}
          </div>
          <div className="col-12">
            <label htmlFor="contacto-tema" className="form-label etiqueta-filtro">Tema</label>
            <input
              id="contacto-tema"
              name="tema"
              className={`form-control campo-oscuro${errores.tema ? " is-invalid" : ""}`}
              type="text"
              value={datos.tema}
              maxLength={LIMITE.tema}
              onChange={cambiar("tema")}
              placeholder="Consulta, stock, despacho..."
            />
            {errores.tema ? <div className="invalid-feedback d-block">{errores.tema}</div> : (
              <div className="form-text texto-contador">{datos.tema.length}/{LIMITE.tema}</div>
            )}
          </div>
          <div className="col-12">
            <label htmlFor="contacto-mensaje" className="form-label etiqueta-filtro">Mensaje</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              className={`form-control campo-oscuro${errores.mensaje ? " is-invalid" : ""}`}
              rows="5"
              maxLength={LIMITE.mensaje}
              value={datos.mensaje}
              onChange={cambiar("mensaje")}
            />
            {errores.mensaje ? <div className="invalid-feedback d-block">{errores.mensaje}</div> : (
              <div className="form-text texto-contador">{datos.mensaje.length}/{LIMITE.mensaje}</div>
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-acento mt-4">Enviar mensaje</button>
      </form>

      {enviado ? (
        <div className="modal fade show d-block modal-machapa" tabIndex="-1" role="dialog" aria-modal="true" aria-labelledby="confirmacion-titulo">
          <div className="modal-backdrop fade show" onClick={cerrarConfirmacion} />
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5" id="confirmacion-titulo">Mensaje enviado</h2>
                <button type="button" className="btn-close btn-close-white" onClick={cerrarConfirmacion} aria-label="Cerrar" />
              </div>
              <div className="modal-body">
                <p className="mensaje-ui ok mb-3">El mensaje se envió correctamente. Te responderemos a la brevedad.</p>
                <dl className="vista-mensaje mb-0">
                  <div>
                    <dt>Nombre</dt>
                    <dd>{enviado.nombre}</dd>
                  </div>
                  <div>
                    <dt>Mail de contacto</dt>
                    <dd
                      ref={refMail}
                      className={`vista-mensaje-cuerpo lineas-2${mailConScroll ? " con-scroll" : ""}`}
                    >
                      {enviado.email}
                    </dd>
                  </div>
                  <div>
                    <dt>Tema</dt>
                    <dd>{enviado.tema}</dd>
                  </div>
                  <div>
                    <dt>Mensaje</dt>
                    <dd className="vista-mensaje-cuerpo">{enviado.mensaje}</dd>
                  </div>
                </dl>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-acento" onClick={cerrarConfirmacion}>Entendido</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FormularioContacto;
