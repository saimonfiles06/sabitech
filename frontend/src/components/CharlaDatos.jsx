import { formatearFecha } from "../utils/formatoFecha.js";

function CharlaDatos({ charla, yaReservada, reservando, onReservar }) {
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
          className="boton-reservar-charla"
          onClick={() => onReservar(charla.id)}
          disabled={yaReservada || reservando}
        >
          <i className={yaReservada ? "bi bi-calendar-check-fill" : "bi bi-calendar-check"}></i>
          {yaReservada
            ? "Plaza reservada"
            : reservando
              ? "Reservando..."
              : "Reservar asistencia"}
        </button>
      </div>
    </div>
  );
}

export default CharlaDatos;
