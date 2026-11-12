import { ApiError } from "./ApiError.js";
import { User } from "../models/User.js";

const API_BASE_URL = "/api/";
const USUARIO_URL = `${API_BASE_URL}usuarios`;

export async function list() {
  const response = await fetch(`${USUARIO_URL}`);
  const json = await response.json();
  if (!response.ok) {
    throw new ApiError(response.status, json.message);
  }
  return json.map(User.fromJSON);
}
