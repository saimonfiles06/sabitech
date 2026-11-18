/**
 * "2026-11-20 10:00:00"
 * Devuelve: "jueves, 20 de noviembre"
 */
export function formatearDia(texto) {
  if (!texto) return "";

  return new Date(texto.replace(" ", "T")).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * "2026-11-20 10:00:00"
 * Devuelve: "10:00"
 */
export function formatearHora(texto) {
  if (!texto) return "";

  return new Date(texto.replace(" ", "T")).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * "2026-12-01 09:30:00"
 * Devuelve: "1 dic, 09:30"
 */
export function formatearFecha(texto) {
  if (!texto) return "";

  return new Date(texto.replace(" ", "T")).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
