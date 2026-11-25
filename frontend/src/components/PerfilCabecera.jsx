import { Link } from "react-router-dom";

import "./PerfilCabecera.css";

function PerfilCabecera({ cerrarSesion }) {
  return (
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
          <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}

export default PerfilCabecera;
