/**
 * Reserva model
 */
export class Reserva {
  constructor({
    id,
    usuario_id = "",
    charla_id = "",
    fecha_actualizacion = "",
    estado = "",
    /**
     * false por defecto;
     *  se modificará cuando se obtenga la confirmación de envío del servidor
     * */
    correo_enviado = false,
    fecha_cancelacion = "",
  }) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.charla_id = charla_id;
    this.fecha_actualizacion = fecha_actualizacion;
    this.estado = estado;
    this.correo_enviado = correo_enviado;
    this.fecha_cancelacion = fecha_cancelacion;
  }
  /**
   * Funciones de utilidad para el modelo Reserva
   * !Revisar funciones a implementar
   */

  /**
   * Funciones API para el modelo Reserva
   */

  static fromJSON(json) {
    return new Reserva({
      id: json.id,
      usuario_id: json.usuario_id,
      charla_id: json.charla_id,
      fecha_actualizacion: json.fecha_actualizacion,
      estado: json.estado,
      correo_enviado: json.correo_enviado,
      fecha_cancelacion: json.fecha_cancelacion,
    });
  }

  /** Plain object, to save it in sessionStorage.
   * Creación de un objeto plano, para guardarlo en sessionStorage
   */
  toJSON() {
    return {
      id: this.id,
      usuario_id: this.usuario_id,
      charla_id: this.charla_id,
      fecha_actualizacion: this.fecha_actualizacion,
      estado: this.estado,
      correo_enviado: this.correo_enviado,
      fecha_cancelacion: this.fecha_cancelacion,
    };
  }
}
