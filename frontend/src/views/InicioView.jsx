import { useEffect, useState } from "react";
import { list as listarCharlas } from "../api/CharlaApi.js";

import InicioHeader from "../components/InicioHeader.jsx";
import CharlasListado from "../components/CharlasListado.jsx";

import "./InicioView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function InicioView() {
  const [charlas, setCharlas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
      <InicioHeader />

      <main className="inicio">
        {cargando ? (
          <p className="inicio-mensaje">Cargando...</p>
        ) : error ? (
          <p className="inicio-mensaje inicio-error">{error}</p>
        ) : (
          <CharlasListado charlas={charlas} />
        )}
      </main>
    </div>
  );
}
