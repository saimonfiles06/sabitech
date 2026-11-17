import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/ContextoAuth.jsx";
import { listarDeUsuario } from "../api/ReservaApi.js";
import { ApiError } from "../api/ApiError.js";

import PerfilCabecera from "../components/PerfilCabecera.jsx";
import PerfilDatos from "../components/PerfilDatos.jsx";
import PerfilCharlas from "../components/PerfilCharlas.jsx";

import "./PerfilView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function PerfilView() {
  const { usuario, token, cerrarSesion } = useAuth();

  const [charlas, setCharlas] = useState([]);
  const [cargandoCharlas, setCargandoCharlas] = useState(true);
  const [errorCharlas, setErrorCharlas] = useState("");

  // Cargar las charlas reservadas del usuario
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

  // Redirigir si no existe una sesión activa
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="perfil-pagina">
      {/* CABECERA */}
      <PerfilCabecera cerrarSesion={cerrarSesion} />

      {/* CONTENIDO DEL PERFIL */}
      <section className="perfil-contenido">
        {/* INFORMACIÓN PERSONAL */}
        <PerfilDatos usuario={usuario} />

        {/* CHARLAS RESERVADAS */}
        <PerfilCharlas
          charlas={charlas}
          cargandoCharlas={cargandoCharlas}
          errorCharlas={errorCharlas}
        />
      </section>
    </main>
  );
}

export default PerfilView;
