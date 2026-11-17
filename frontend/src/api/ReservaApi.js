import { Reserva } from "../models/Reserva.js";
import { ApiError } from "./ApiError.js";
import { Page } from "../models/Page.js";
import { Charla } from "../models/Charla.js";

const API_BASE_URL = "/api/";
const RESERVAS_URL = `${API_BASE_URL}reservas`;

export async function list() {
  const response = await fetch(`${RESERVAS_URL}`);
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(response.status, json.message);
  }
  const reservas = Page.fromJSON(json, "data", Reserva.fromJSON);
  return reservas;
}

/** Charlas reservadas por un usuario (necesita el token de la sesión) */
export async function listarDeUsuario(idUsuario, token) {
  const respuesta = await fetch(`${API_BASE_URL}usuarios/${idUsuario}/reservas`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new ApiError(respuesta.status, json.message);
  }
  return json.map(Charla.fromJSON);
}