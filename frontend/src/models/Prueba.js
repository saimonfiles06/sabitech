export class Charla {
  constructor({ id, titulo = "", res_contenido = "", contenido = "" }) {
    this.id = id;
    this.titulo = titulo;
    this.res_contenido = res_contenido;
    this.contenido = contenido;
  }

  /** Builds a Charla de Prueba from the API JSON (extra fields are ignored). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      titulo: json.titulo,
      res_contenido: json.res_contenido,
    });
  }

  /** Plain object, to save it in sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      res_contenido: this.res_contenido,
    };
  }
}
