import { createContext, useContext, useState } from "react";
import { User } from "../models/User.js";
import * as AuthApi from "../api/AuthApi.js";

const CLAVE_SESION = "sabitech_sesion";

const ContextoAuth = createContext(null);

// Recupera la sesión guardada en el navegador (si la hay)
function leerSesionGuardada() {
  try {
    const texto = sessionStorage.getItem(CLAVE_SESION);
    if (!texto) return null;

    const { token, usuario } = JSON.parse(texto);
    return { token, usuario: new User(usuario) };
  } catch {
    return null;
  }
}

export function ProveedorAuth({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada);

  function guardarSesion(nuevaSesion) {
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  }

  async function iniciarSesion(correo, password) {
    const nuevaSesion = await AuthApi.login(correo, password);
    guardarSesion(nuevaSesion);
  }

  async function registrarse(datos) {
    const nuevaSesion = await AuthApi.registro(datos);
    guardarSesion(nuevaSesion);
  }

  async function cerrarSesion() {
    try {
      await AuthApi.logout(sesion.token);
    } catch {
      // Si el token ya había caducado, no pasa nada: cerramos la sesión local igualmente
    }
    sessionStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  const valor = {
    usuario: sesion ? sesion.usuario : null,
    token: sesion ? sesion.token : null,
    iniciarSesion,
    registrarse,
    cerrarSesion,
  };

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>;
}

// Función corta para usar el contexto desde cualquier pantalla
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(ContextoAuth);
}