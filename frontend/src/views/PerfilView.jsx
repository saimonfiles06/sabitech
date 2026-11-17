import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import { listarDeUsuario } from "../api/ReservaApi.js";
import { ApiError } from "../api/ApiError.js";
import "./PerfilView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

/** "2026-11-20 10:00:00" -> "jueves, 20 de noviembre" */
function formatearDia(texto) {
  if (!texto) return "";
  return new Date(texto.replace(" ", "T")).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** "2026-11-20 10:00:00" -> "10:00" */
function formatearHora(texto) {
  if (!texto) return "";
  return new Date(texto.replace(" ", "T")).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PerfilView() {
  const { usuario, token, cerrarSesion } = useAuth();
  const [charlas, setCharlas] = useState([]);
  const [cargandoCharlas, setCargandoCharlas] = useState(true);
  const [errorCharlas, setErrorCharlas] = useState("");

  // Pide las charlas reservadas cuando hay usuario con sesión
  useEffect(() => {
    if (!usuario) return;

    async function cargarCharlas() {
      try {
        const lista = await listarDeUsuario(usuario.id, token);
        setCharlas(lista);
      } catch (fallo) {
        if (fallo instanceof ApiError && fallo.status === 401) {
          setErrorCharlas("Tu sesión ha caducado. Vuelve a iniciar sesión.");
        } else {
          setErrorCharlas("No se han podido cargar tus charlas.");
        }
      } finally {
        setCargandoCharlas(false);
      }
    }

    cargarCharlas();
  }, [usuario, token]);

  // Sin sesión (por ejemplo, justo después de cerrarla) se vuelve al inicio
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="perfil-pagina">
      {/* CABECERA */}
      <section className="perfil-cabecera">
        <div className="perfil-cabecera-texto">
          <h1>Mi perfil</h1>
          <p>Consulta la información de tu cuenta y tus datos personales.</p>
        </div>

        <div className="perfil-acciones">
          <Link to="/" className="perfil-boton perfil-boton-principal">
            <i className="bi bi-house" aria-hidden="true"></i>
            Volver a inicio
          </Link>

          <button
            type="button"
            className="perfil-boton perfil-boton-secundario"
            onClick={cerrarSesion}
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </div>
      </section>

      {/* CONTENIDO DEL PERFIL */}
      <section className="perfil-contenido">
        {/* INFORMACIÓN PERSONAL */}
        <article className="perfil-card perfil-card-datos">
          <div className="perfil-card-cabecera">
            <h2>Información personal</h2>
            <p>Datos asociados a tu cuenta.</p>
          </div>

          <div className="perfil-datos">
            <div className="perfil-dato">
              <span className="perfil-etiqueta">Nombre</span>
              <span className="perfil-valor">
                {usuario.nombre || "No disponible"}
              </span>
            </div>

            <div className="perfil-dato">
              <span className="perfil-etiqueta">Apellidos</span>
              <span className="perfil-valor">
                {usuario.apellidos || "No disponible"}
              </span>
            </div>

            <div className="perfil-dato">
              <span className="perfil-etiqueta">Correo electrónico</span>
              <span className="perfil-valor">
                {usuario.correo || "No disponible"}
              </span>
            </div>
          </div>

          <div className="perfil-edicion">
            <button type="button" className="perfil-boton-edicion" disabled>
              <i className="bi bi-pencil"></i>
              Editar datos
            </button>

            <button type="button" className="perfil-boton-edicion" disabled>
              <i className="bi bi-lock"></i>
              Cambiar contraseña
            </button>
          </div>
        </article>

        {/* CHARLAS RESERVADAS */}
        <article className="perfil-card perfil-card-charlas">
          <div className="perfil-card-cabecera">
            <h2>Mis charlas reservadas</h2>
            <p>Consulta las charlas en las que tienes una plaza reservada.</p>
          </div>

          <div className="perfil-lista-charlas" aria-live="polite">
            {cargandoCharlas ? (
              <p>Cargando tus charlas...</p>
            ) : errorCharlas ? (
              <p>{errorCharlas}</p>
            ) : charlas.length === 0 ? (
              <p>
                Todavía no tienes ninguna reserva.{" "}
                <Link to="/">Ver el catálogo de charlas</Link>
              </p>
            ) : (
              charlas.map((charla) => (
                <div className="perfil-charla" key={charla.id}>
                  <div className="perfil-charla-informacion">
                    <h3>{charla.titulo}</h3>
                    <p>
                      <i
                        className="bi bi-calendar-event"
                        aria-hidden="true"
                      ></i>
                      {formatearDia(charla.fecha_hora_charla)}
                    </p>
                    <p>
                      <i className="bi bi-clock" aria-hidden="true"></i>
                      {formatearHora(charla.fecha_hora_charla)}
                      {" – "}
                      {formatearHora(charla.fecha_hora_fin)}
                    </p>
                    <p>
                      <i className="bi bi-geo-alt" aria-hidden="true"></i>
                      {charla.nombre_sala}
                    </p>
                  </div>

                  <span className="perfil-charla-estado">Plaza reservada</span>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

export default PerfilView;
