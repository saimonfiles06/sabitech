import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import logoTexto from "../assets/img/logo_texto.ico";
import "./InicioHeader.css";

function InicioHeader() {
  const { usuario } = useAuth();

  return (
    <header className="inicio-header">
      <a href="/" className="inicio-logo">
        <img src={logoTexto} alt="Logo Sabitech" />
      </a>

      <nav className="inicio-accesos">
        {usuario ? (
          <>
            <span>Hola, {usuario.nombre}</span>

            <Link to="/perfil" className="inicio-boton-perfil">
              <i className="bi bi-person-circle"></i>
              Mi perfil
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="inicio-boton-login">
              Iniciar sesión
            </Link>

            <Link to="/registro" className="inicio-boton-registro">
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default InicioHeader;
