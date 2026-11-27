import "./EstadoVacioCharlas.css";
//Componente para cuando no hay charlas guardadas
function EstadoVacioCharlas() {
  return (
    <div className="inicio-sin-charlas">
      <i className="bi bi-calendar2-event"></i>

      <h3>No hay charlas disponibles</h3>

      <p>Cuando se publiquen nuevas charlas aparecerán aquí.</p>
    </div>
  );
}

export default EstadoVacioCharlas;
