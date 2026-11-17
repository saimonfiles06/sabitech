import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./PerfilView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PerfilView() {
  const { usuario, cerrarSesion } = useAuth();

  if (!usuario) {
    return (
      <main className="perfil-pagina">
        <p>Cargando información del perfil...</p>
      </main>
    );
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
          <Link to="/charlas" className="perfil-boton perfil-boton-principal">
            <i class="bi bi-house"></i>
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

          <div className="perfil-lista-charlas">
            {/* CONTENIDO VISUAL PROVISIONAL */}
            <div className="perfil-charla">
              <div className="perfil-charla-informacion">
                <h3>Nombre de la charla</h3>
                <p>
                  <i className="bi bi-calendar-event"></i>
                  Fecha de la charla
                </p>
                <p>
                  <i className="bi bi-clock"></i>
                  Horario
                </p>
                <p>
                  <i className="bi bi-geo-alt"></i>
                  Ubicación
                </p>
              </div>

              <span className="perfil-charla-estado">Plaza reservada</span>
            </div>

            <div className="perfil-charla">
              <div className="perfil-charla-informacion">
                <h3>Nombre de la charla</h3>
                <p>
                  <i className="bi bi-calendar-event"></i>
                  Fecha de la charla
                </p>
                <p>
                  <i className="bi bi-clock"></i>
                  Horario
                </p>
                <p>
                  <i className="bi bi-geo-alt"></i>
                  Ubicación
                </p>
              </div>

              <span className="perfil-charla-estado">Plaza reservada</span>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default PerfilView;
