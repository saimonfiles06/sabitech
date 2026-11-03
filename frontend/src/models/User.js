/**
 * User model
 */

export class User {
  constructor({
    id,
    nombre = "",
    apellidos = "",
    correo = "",
    contraseña = "",
    fecha_alta,
    correo_confirmado = "",
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.contraseña = contraseña;
    this.fecha_alta = fecha_alta;
    this.correo_confirmado = correo_confirmado;
  }
  /** "Emily Johnson" */
  get nombreCompleto() {
    return `${this.nombre} ${this.apellidos}`.trim();
  }
  /** Builds a User from the API JSON (extra fields are ignored).
   * Creación objeto de usuario a partir de un JSON de la API
   * (solo se han insertado los campos necesarios)
   */
  static fromJSON(json) {
    return new User({
      id: json.id,
      nombre: json.nombre,
      apellidos: json.apellidos,
      correo: json.correo,
      contraseña: json.contraseña,
      fecha_alta: json.fecha_alta,
      correo_confirmado: json.correo_confirmado,
    });
  }

  /** Plain object, to save it in sessionStorage.
   * Creación de un objeto plano, para guardarlo en sessionStorage
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo: this.correo,
      contraseña: this.contraseña,
      fecha_alta: this.fecha_alta,
      correo_confirmado: this.correo_confirmado,
    };
  }
}
