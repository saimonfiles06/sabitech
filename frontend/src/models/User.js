/**
 * User model
 */
// id
// nombre
// apellidos
// correo_electronico
// rol
// correo_confirmado
// fecha_alta
export class User {
  constructor({
    id,
    nombre = "",
    apellidos = "",
    correo = "",
    rol = "",
    correo_confirmado = "",
    fecha_alta,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.correo = correo;
    this.rol = rol;
    this.correo_confirmado = correo_confirmado;
    this.fecha_alta = fecha_alta;
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
      correo: json.correo_electronico,
      rol: json.rol,
      correo_confirmado: json.correo_confirmado,
      fecha_alta: json.created_at,
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
      rol: this.rol,
      correo_confirmado: this.correo_confirmado,
      fecha_alta: this.fecha_alta,
    };
  }
}
