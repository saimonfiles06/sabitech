export class Charla {
  constructor({
    id,
    titulo = "",
    rama = "",
    nombre_ponente = "",
    apellidos_ponente = "",
    resumen_contenido = "",
    contenido = "",
    url_imagen = "XtartLogo",
    nombre_sala = "",
    fecha_hora_charla = "",
    // Hora a partir de la cual se puede entrar a la charla
    fecha_hora_entrada = "",
    fecha_hora_fin = "",
  }) {
    this.id = id;
    this.titulo = titulo;
    this.rama = rama;
    this.nombre_ponente = nombre_ponente;
    this.apellidos_ponente = apellidos_ponente;
    this.resumen_contenido = resumen_contenido;
    this.contenido = contenido;
    this.url_imagen = url_imagen;
    this.nombre_sala = nombre_sala;
    this.fecha_hora_charla = fecha_hora_charla;
    this.fecha_hora_entrada = fecha_hora_entrada;
    this.fecha_hora_fin = fecha_hora_fin;
  }

  /** Crea una Charla a partir del JSON de la API (los campos extra se ignoran). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      titulo: json.titulo,
      rama: json.rama,
      nombre_ponente: json.nombre_ponente,
      apellidos_ponente: json.apellidos_ponente,
      resumen_contenido: json.resumen_contenido,
      contenido: json.contenido,
      // Si la charla no tiene imagen la API manda null: se usa el logo por defecto
      url_imagen: json.url_imagen ?? undefined,
      nombre_sala: json.nombre_sala,
      fecha_hora_charla: json.fecha_hora_charla,
      fecha_hora_entrada: json.fecha_hora_entrada,
      fecha_hora_fin: json.fecha_hora_fin,
    });
  }

  /** Objeto plano, para guardarlo en sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      rama: this.rama,
      nombre_ponente: this.nombre_ponente,
      apellidos_ponente: this.apellidos_ponente,
      resumen_contenido: this.resumen_contenido,
      contenido: this.contenido,
      url_imagen: this.url_imagen,
      nombre_sala: this.nombre_sala,
      fecha_hora_charla: this.fecha_hora_charla,
      fecha_hora_entrada: this.fecha_hora_entrada,
      fecha_hora_fin: this.fecha_hora_fin,
    };
  }
}
