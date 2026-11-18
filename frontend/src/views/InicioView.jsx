import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";                       // NUEVO
import { list as listarCharlas } from "../api/CharlaApi.js";
import { listarDeUsuario, reservar } from "../api/ReservaApi.js";     // CAMBIA: añade reservar
import { ApiError } from "../api/ApiError.js";                        // NUEVO
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

  const navegar = useNavigate();                                      // NUEVO
  const [idCharlaEnProceso, setIdCharlaEnProceso] = useState(null);   // NUEVO
  const [aviso, setAviso] = useState(null);                           // NUEVO: { tipo, texto }

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

  async function reservarCharla(idCharla) {
    // Sin sesión no se puede reservar: se lleva al login
    if (!usuario) {
      navegar("/login");
      return;
    }

    setIdCharlaEnProceso(idCharla);
    setAviso(null);

    try {
      const respuesta = await reservar(idCharla, token);
      setIdsReservadas((anteriores) => new Set(anteriores).add(idCharla));
      setAviso({ tipo: "exito", texto: respuesta.message });
    } catch (e) {
      const texto =
        e instanceof ApiError && e.status === 401
          ? "Tu sesión ha caducado. Vuelve a iniciar sesión."
          : e instanceof ApiError
            ? e.message
            : "No se ha podido reservar la plaza.";
      setAviso({ tipo: "error", texto });
    } finally {
      setIdCharlaEnProceso(null);
    }
  }

  return (
    <div className="inicio-pagina">
      <InicioHeader />

      <main className="inicio">
        {cargando ? (
          <p className="inicio-mensaje">Cargando...</p>
        ) : error ? (
          <p className="inicio-mensaje inicio-error">{error}</p>
        ) : (
          <>
            {/* NUEVO: mensaje de éxito o error de la reserva */}
            {aviso && (
              <p className={`inicio-aviso inicio-aviso-${aviso.tipo}`} role="status">
                {aviso.texto}
              </p>
            )}

            {/* CAMBIA: nuevas props idCharlaEnProceso y onReservar */}
            <CharlasListado
              charlas={charlas}
              idsReservadas={usuario ? idsReservadas : new Set()}
              idCharlaEnProceso={idCharlaEnProceso}
              onReservar={reservarCharla}
            />
          </>
        )}
      </main>
    </div>
  );
}