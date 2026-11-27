import CharlaDatos from "./CharlaDatos.jsx";
import "./CharlaTarjeta.css";

function CharlaTarjeta({ charla, index, yaReservada, reservando, onReservar }) {
  return (
    <article
      className="tarjeta-charla"
      key={charla.id}
      style={{ "--retraso": `${index * 70}ms` }}
    >
      {/* INFORMACIÓN PRINCIPAL */}
      <div className={`tarjeta-charla-contenido ${charla.rama?.toLowerCase()}`}>
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

        <p className="resumen-charla">{charla.resumen_contenido}</p>
      </div>

      {/* INFORMACIÓN COMPLEMENTARIA */}
      <CharlaDatos // CAMBIA (líneas 32-37)
        charla={charla}
        yaReservada={yaReservada}
        reservando={reservando}
        onReservar={onReservar}
      />
    </article>
  );
}

export default CharlaTarjeta;
