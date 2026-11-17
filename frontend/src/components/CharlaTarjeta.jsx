import CharlaDatos from "./CharlaDatos.jsx";

function CharlaTarjeta({ charla, index }) {
  return (
    <article
      className="tarjeta-charla"
      key={charla.id}
      style={{ "--retraso": `${index * 70}ms` }}
    >
      {/* INFORMACIÓN PRINCIPAL */}
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

        <p className="resumen-charla">{charla.resumen_contenido}</p>
      </div>

      {/* INFORMACIÓN COMPLEMENTARIA */}
      <CharlaDatos charla={charla} />
    </article>
  );
}

export default CharlaTarjeta;
