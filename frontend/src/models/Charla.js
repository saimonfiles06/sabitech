export class Charla {
  constructor({
    id,
    titulo = "",
    rama = "",
    res_contenido = "",
    contenido = "",
    imagen = "XtartLogo",
    fecha = "",
    //Hora de entrada a partir de la cual se puede entrar a la charla
    fecha_entrada = "",
    duracion = "",
  }) {
    this.id = id;
    this.titulo = titulo;
    this.rama = rama;
    this.res_contenido = res_contenido;
    this.contenido = contenido;
    this.imagen = imagen;
    this.fecha = fecha;
    this.fecha_entrada = fecha_entrada;
    this.duracion = duracion;
  }

  /** Builds a User from the API JSON (extra fields are ignored). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      titulo: json.titulo,
      rama: json.rama,
      res_contenido: json.res_contenido,
      contenido: json.contenido,
      imagen: json.imagen,
      fecha: json.fecha,
      fecha_entrada: json.fecha_entrada,
      duracion: json.duracion,
    });
  }

  /** Plain object, to save it in sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      rama: this.rama,
      res_contenido: this.res_contenido,
      contenido: this.contenido,
      imagen: this.imagen,
      fecha: this.fecha,
      fecha_entrada: this.fecha_entrada,
      duracion: this.duracion,
    };
  }
}
