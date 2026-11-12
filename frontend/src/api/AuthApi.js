import { ApiError } from "./ApiError.js";
import { User } from "../models/User.js";

const API_BASE_URL = "/api/";

// Función interna: prepara y envía una petición a la API
async function enviar(ruta, { metodo = "GET", cuerpo = null, token = null } = {}) {
  const cabeceras = { Accept: "application/json" };

  if (cuerpo) {
    cabeceras["Content-Type"] = "application/json";
  }
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : null,
  });

  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, json.message, json);
  }
  return json;
}

/** Inicia sesión. Devuelve { token, usuario } */
export async function login(correo, password) {
  const json = await enviar("login", {
    metodo: "POST",
    cuerpo: { correo_electronico: correo, password },
  });
  return { token: json.token, usuario: User.fromJSON(json.usuario) };
}

/** Crea la cuenta e inicia sesión. Devuelve { token, usuario } */
export async function registro({ nombre, apellidos, correo, password, confirmarPassword }) {
  const json = await enviar("registro", {
    metodo: "POST",
    cuerpo: {
      nombre,
      apellidos,
      correo_electronico: correo,
      password,
      confirmar_password: confirmarPassword,
    },
  });
  return { token: json.token, usuario: User.fromJSON(json.usuario) };
}

/** Cierra la sesión en el servidor (borra el token) */
export async function logout(token) {
  return enviar("logout", { metodo: "POST", token });
}

/** Datos del usuario del token. Sirve para comprobar que la sesión sigue válida */
export async function perfil(token) {
  const json = await enviar("perfil", { token });
  return User.fromJSON(json);
}