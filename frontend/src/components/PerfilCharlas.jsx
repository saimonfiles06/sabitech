import { Link } from "react-router-dom";
import PerfilCharlaTarjeta from "./PerfilCharlaTarjeta.jsx";

import "./PerfilCharlas.css";
import "./PerfilCard.css";

function PerfilCharlas({ charlas, cargandoCharlas, errorCharlas }) {
  return (
    <article className="perfil-card perfil-card-charlas">
      <div className="perfil-card-cabecera">
        <h2>Mis charlas reservadas</h2>
        <p>Consulta las charlas en las que tienes una plaza reservada.</p>
      </div>

      <div className="perfil-lista-charlas" aria-live="polite">
        {cargandoCharlas ? (
          <p>Cargando tus charlas...</p>
        ) : errorCharlas ? (
          <p>{errorCharlas}</p>
        ) : charlas.length === 0 ? (
          <p>
            Todavía no tienes ninguna reserva.{" "}
            <Link to="/">Ver el catálogo de charlas</Link>
          </p>
        ) : (
          charlas.map((charla) => (
            <PerfilCharlaTarjeta key={charla.id} charla={charla} />
          ))
        )}
      </div>
    </article>
  );
}

export default PerfilCharlas;
