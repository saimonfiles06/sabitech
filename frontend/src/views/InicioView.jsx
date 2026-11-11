import { useEffect, useState } from "react";
import { list as listarCharlas } from "../api/CharlaApi.js";
import { list as listarUsuarios } from "../api/UsuarioApi.js";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./InicioView.css";

/** "2026-12-01 09:30:00" -> "1 dic, 09:30" */
function formatearFecha(texto) {
  if (!texto) return "";

  const fecha = new Date(texto.replace(" ", "T"));

  return fecha.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InicioView() {
  const [charlas, setCharlas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario, cerrarSesion } = useAuth();

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Las dos peticiones se lanzan a la vez
        const [listaCharlas, listaUsuarios] = await Promise.all([
          listarCharlas(),
          listarUsuarios(),
        ]);

        setCharlas(listaCharlas);
        setUsuarios(listaUsuarios);
      } catch (e) {
        setError("No se han podido cargar los datos.");
        console.error(e);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  return (
    <div className="inicio-pagina">
      {/* HEADER */}
      <header className="inicio-header">
        <a href="/" className="inicio-logo">
          <img src="/assets/img/logo_texto.ico" alt="SABITECH" />
        </a>

        <nav className="inicio-accesos">
          {usuario ? (
            <>
              <span>Hola, {usuario.nombre}</span>

              <button
                type="button"
                className="inicio-boton-login"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="inicio">
        {cargando ? (
          <p className="inicio-mensaje">Cargando...</p>
        ) : error ? (
          <p className="inicio-mensaje inicio-error">{error}</p>
        ) : (
          <>
            {/* CHARLAS */}
            <section className="inicio-bloque">
              <h2>Charlas ({charlas.length})</h2>

              <div className="tabla-contenedor tabla-charlas">
                <table>
                  <thead>
                    <tr>
                      <th>Charla</th>
                      <th>Ponente</th>
                      <th>Sala</th>
                      <th>Horario</th>
                    </tr>
                  </thead>

                  <tbody>
                    {charlas.map((charla) => (
                      <tr key={charla.id}>
                        <td>
                          <span className="etiqueta-rama">{charla.rama}</span>

                          <strong className="titulo-charla">
                            {charla.titulo}
                          </strong>

                          <p className="resumen-charla">
                            {charla.resumen_contenido}
                          </p>
                        </td>

                        <td>
                          {charla.nombre_ponente} {charla.apellidos_ponente}
                        </td>

                        <td>{charla.nombre_sala}</td>

                        <td>
                          {formatearFecha(charla.fecha_hora_charla)}
                          {" – "}
                          {formatearFecha(charla.fecha_hora_fin)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* USUARIOS */}
            <section className="inicio-bloque">
              <h2>Usuarios ({usuarios.length})</h2>

              <div className="tabla-contenedor">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th>Alta</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombreCompleto}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.rol}</td>
                        <td>{formatearFecha(usuario.fecha_alta)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
