import { useEffect, useState } from "react";
import { list as listarCharlas } from "../api/CharlaApi.js";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./InicioView.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logoTexto from "../assets/img/logo_texto.ico";

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
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario } = useAuth();

  useEffect(() => {
    async function cargarDatos() {
      try {
        const listaCharlas = await listarCharlas();
        setCharlas(listaCharlas);
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="inicio">
        {cargando ? (
          <p className="inicio-mensaje">Cargando...</p>
        ) : error ? (
          <p className="inicio-mensaje inicio-error">{error}</p>
        ) : (
          <section className="inicio-bloque">
            {/* CABECERA DEL LISTADO */}
            <div className="inicio-bloque-cabecera">
              <div>
                <h2>Charlas</h2>
                <p>Descubre las charlas y sus ponentes.</p>
              </div>

              <span className="inicio-total-charlas">
                {charlas.length} {charlas.length === 1 ? "charla" : "charlas"}
              </span>
            </div>

            {/* LISTADO DE TARJETAS */}
            {charlas.length > 0 ? (
              <div className="lista-charlas">
                {charlas.map((charla, index) => (
                  <article
                    className="tarjeta-charla"
                    key={charla.id}
                    style={{ "--retraso": `${index * 70}ms` }}
                  >
                    {/* INFORMACIÓN PRINCIPAL CON IMAGEN */}
                    <div className="tarjeta-charla-contenido">
                      {charla.imagen_url && (
                        <img
                          className="imagen-fondo-charla"
                          src={charla.imagen_url}
                          alt=""
                          aria-hidden="true"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}

                      <span className="etiqueta-rama">{charla.rama}</span>

                      <h3 className="titulo-charla">{charla.titulo}</h3>

                      <p className="resumen-charla">
                        {charla.resumen_contenido}
                      </p>
                    </div>

                    {/* INFORMACIÓN COMPLEMENTARIA */}
                    <div className="tarjeta-charla-datos">
                      <div className="dato-charla">
                        <i className="bi bi-person-circle"></i>

                        <div>
                          <span className="dato-charla-label">Ponente</span>

                          <strong>
                            {charla.nombre_ponente} {charla.apellidos_ponente}
                          </strong>
                        </div>
                      </div>

                      <div className="dato-charla">
                        <i className="bi bi-geo-alt"></i>

                        <div>
                          <span className="dato-charla-label">Sala</span>

                          <strong>{charla.nombre_sala}</strong>
                        </div>
                      </div>

                      <div className="dato-charla dato-charla-horario">
                        <i className="bi bi-calendar-event"></i>

                        <div>
                          <span className="dato-charla-label">Horario</span>

                          <strong>
                            {formatearFecha(charla.fecha_hora_charla)}
                          </strong>

                          <span className="dato-charla-fin">
                            Hasta {formatearFecha(charla.fecha_hora_fin)}
                          </span>
                        </div>
                      </div>

                      {/* BOTONES DE ACCIÓN */}
                      <div className="tarjeta-charla-acciones">
                        <button type="button" className="boton-detalles-charla">
                          <i className="bi bi-eye"></i>
                          Ver detalles
                        </button>

                        <button type="button" className="boton-reservar-charla">
                          <i className="bi bi-calendar-check"></i>
                          Reservar asistencia
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="inicio-sin-charlas">
                <i className="bi bi-calendar2-event"></i>
                <h3>No hay charlas disponibles</h3>
                <p>Cuando se publiquen nuevas charlas aparecerán aquí.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
