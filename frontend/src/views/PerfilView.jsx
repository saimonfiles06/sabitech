import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./PerfilView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PerfilView() {
  const { usuario, cerrarSesion } = useAuth();

  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible";

    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!usuario) {
    return (
      <main className="perfil">
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
            <i className="bi bi-chat-left-text"></i>
            Mis charlas
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

      {/* INFORMACIÓN PERSONAL */}
      <section className="perfil-bloque">
        <div className="perfil-bloque-cabecera">
          <h2>Información personal</h2>
          <p>Datos asociados a tu cuenta.</p>
        </div>

        <div className="perfil-datos">
          <div className="perfil-dato">
            <span className="perfil-etiqueta">Nombre completo</span>
            <span className="perfil-valor">
              {usuario.nombreCompleto || usuario.nombre || "No disponible"}
            </span>
          </div>

          <div className="perfil-dato">
            <span className="perfil-etiqueta">Correo electrónico</span>
            <span className="perfil-valor">
              {usuario.correo || "No disponible"}
            </span>
          </div>

          {/* <div className="perfil-dato">
            <span className="perfil-etiqueta">Rol</span>
            <span className="perfil-rol">{usuario.rol || "Usuario"}</span>
          </div> */}

          <div className="perfil-dato">
            <span className="perfil-etiqueta">Fecha de alta</span>
            <span className="perfil-valor">
              {formatearFecha(usuario.fecha_alta)}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PerfilView;
