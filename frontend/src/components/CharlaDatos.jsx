import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/ContextoAuth.jsx";
import { reservar } from "../api/ReservaApi.js";
import { ApiError } from "../api/ApiError.js";

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

function CharlaDatos({ charla, yaReservada }) {
  const { usuario, token } = useAuth();
  const navegar = useNavigate();

  const [enviando, setEnviando] = useState(false);
  const [reservada, setReservada] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  // Reservada si ya lo estaba al cargar la página o si se acaba de reservar
  const estaReservada = yaReservada || reservada;

  async function manejarReserva() {
    // Sin sesión no se puede reservar: se lleva al login
    if (!usuario) {
      navegar("/login");
      return;
    }

    setEnviando(true);
    setMensaje("");

    try {
      const respuesta = await reservar(charla.id, token);
      setReservada(true);
      setEsError(false);
      setMensaje(respuesta.message);
    } catch (fallo) {
      setEsError(true);

      if (fallo instanceof ApiError && fallo.status === 401) {
        setMensaje("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      } else if (fallo instanceof ApiError) {
        // Mensaje del servidor: sin plazas, ya reservada, charla empezada...
        setMensaje(fallo.message);
      } else {
        setMensaje("No se puede conectar con el servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tarjeta-charla-datos">
      {/* PONENTE */}
      <div className="dato-charla">
        <i className="bi bi-person-circle"></i>

        <div>
          <span className="dato-charla-label">Ponente</span>

          <strong>
            {charla.nombre_ponente} {charla.apellidos_ponente}
          </strong>
        </div>
      </div>

      {/* SALA */}
      <div className="dato-charla">
        <i className="bi bi-geo-alt"></i>

        <div>
          <span className="dato-charla-label">Sala</span>

          <strong>{charla.nombre_sala}</strong>
        </div>
      </div>

      {/* HORARIO */}
      <div className="dato-charla dato-charla-horario">
        <i className="bi bi-calendar-event"></i>

        <div>
          <span className="dato-charla-label">Horario</span>

          <strong>{formatearFecha(charla.fecha_hora_charla)}</strong>

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

        <button
          type="button"
          className={
            estaReservada
              ? "boton-reservar-charla boton-fantasma"
              : "boton-reservar-charla"
          }
          onClick={manejarReserva}
          disabled={enviando || estaReservada}
        >
          <i
            className={estaReservada ? "bi bi-check-circle" : "bi bi-calendar-check"}
            aria-hidden="true"
          ></i>
          {estaReservada
            ? "Plaza reservada"
            : enviando
              ? "Reservando..."
              : "Reservar asistencia"}
        </button>
      </div>

      {/* RESULTADO DE LA RESERVA */}
      <p
        className={
          esError ? "reserva-mensaje reserva-mensaje-error" : "reserva-mensaje"
        }
        role="status"
      >
        {mensaje}
      </p>
    </div>
  );
}

export default CharlaDatos;