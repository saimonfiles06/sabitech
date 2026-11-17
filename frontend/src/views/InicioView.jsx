import { useEffect, useState } from "react";
import { list as listarCharlas } from "../api/CharlaApi.js";
import { listarDeUsuario } from "../api/ReservaApi.js";
import { useAuth } from "../auth/ContextoAuth.jsx";

import InicioHeader from "../components/InicioHeader.jsx";
import CharlasListado from "../components/CharlasListado.jsx";

import "./InicioView.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export function InicioView() {
  const [charlas, setCharlas] = useState([]);
  const [idsReservadas, setIdsReservadas] = useState(new Set());
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario, token } = useAuth();

  // Catálogo de charlas (para todo el mundo)
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

  // Charlas que ya tiene reservadas el usuario (solo si hay sesión)
  useEffect(() => {
    if (!usuario) return;

    async function cargarReservas() {
      try {
        const reservadas = await listarDeUsuario(usuario.id, token);
        setIdsReservadas(new Set(reservadas.map((charla) => charla.id)));
      } catch (e) {
        // Si falla, el catálogo se sigue viendo; el servidor impide reservar dos veces
        console.error(e);
      }
    }

    cargarReservas();
  }, [usuario, token]);

  return (
    <div className="inicio-pagina">
      <InicioHeader />

      <main className="inicio">
        {cargando ? (
          <p className="inicio-mensaje">Cargando...</p>
        ) : error ? (
          <p className="inicio-mensaje inicio-error">{error}</p>
        ) : (
          <CharlasListado charlas={charlas} idsReservadas={idsReservadas} />
        )}
      </main>
    </div>
  );
}