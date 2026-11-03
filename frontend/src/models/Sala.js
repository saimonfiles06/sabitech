export class Sala {
  constructor({ id, nombre, aforo }) {
    this.id = id;
    this.nombre = nombre;
    this.aforo = aforo;
  }

  /** Builds a User from the API JSON (extra fields are ignored). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      nombre: json.nombre,
      aforo: json.aforo,
    });
  }

  /** Plain object, to save it in sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      aforo: this.aforo,
    };
  }
}
