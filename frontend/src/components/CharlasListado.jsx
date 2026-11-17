import CharlaTarjeta from "./CharlaTarjeta.jsx";
import EstadoVacioCharlas from "./EstadoVacioCharlas.jsx";

function CharlasListado({ charlas }) {
  return (
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

      {/* LISTADO DE CHARLAS */}
      {charlas.length > 0 ? (
        <div className="lista-charlas">
          {charlas.map((charla, index) => (
            <CharlaTarjeta key={charla.id} charla={charla} index={index} />
          ))}
        </div>
      ) : (
        <EstadoVacioCharlas />
      )}
    </section>
  );
}

export default CharlasListado;
