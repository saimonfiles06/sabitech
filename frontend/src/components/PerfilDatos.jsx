import "./PerfilCard.css";
import "./PerfilDatos.css";
function PerfilDatos({ usuario }) {
  return (
    <article className="perfil-card perfil-card-datos">
      <div className="perfil-card-cabecera">
        <h2>Información personal</h2>
        <p>Datos asociados a tu cuenta.</p>
      </div>

      {/* INFORMACIÓN PERSONAL */}
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

      {/* OPCIONES DE EDICIÓN */}
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
  );
}

export default PerfilDatos;
