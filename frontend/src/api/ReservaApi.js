import { Reserva } from "../models/Reserva.js";
import { ApiError } from "./ApiError.js";
import { Page } from "../models/Page.js";

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
