import { ApiError } from "./ApiError.js";
import { User } from "../models/User.js";

const API_BASE_URL = "/api/";
const USUARIO_URL = `${API_BASE_URL}usuarios`;

// Cabeceras con el token (las rutas protegidas lo exigen)
function cabeceras(token) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** Lista de usuarios (solo administrador) */
export async function list(token) {
  const response = await fetch(USUARIO_URL, { headers: cabeceras(token) });
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(response.status, json.message);
  }
  return json.map(User.fromJSON);
}

/** Datos de un usuario (el propio o, si eres administrador, cualquiera) */
export async function obtenerPorId(id, token) {
  const response = await fetch(`${USUARIO_URL}/${id}`, { headers: cabeceras(token) });
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(response.status, json.message);
  }
  return User.fromJSON(json);
}