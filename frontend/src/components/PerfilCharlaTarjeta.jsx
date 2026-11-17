import { formatearDia, formatearHora } from "../utils/formatoFecha.js";

function PerfilCharlaTarjeta({ charla }) {
  return (
    <div className="perfil-charla">
      <div className="perfil-charla-informacion">
        <h3>{charla.titulo}</h3>

        <p>
          <i className="bi bi-calendar-event" aria-hidden="true"></i>
          {formatearDia(charla.fecha_hora_charla)}
        </p>

        <p>
          <i className="bi bi-clock" aria-hidden="true"></i>
          {formatearHora(charla.fecha_hora_charla)}
          {" – "}
          {formatearHora(charla.fecha_hora_fin)}
        </p>

        <p>
          <i className="bi bi-geo-alt" aria-hidden="true"></i>
          {charla.nombre_sala}
        </p>
      </div>

      <span className="perfil-charla-estado">Plaza reservada</span>
    </div>
  );
}

export default PerfilCharlaTarjeta;
