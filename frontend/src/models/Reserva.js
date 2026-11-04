/**
 * Reserva model
 */
export class Reserva {
  constructor({
    id,
    correo_enviado_en = "",
    id_usuario_id_charla = "",
    creado_actualiado_en = "",
    estado = "",
    //Hora de entrada a la charla,
    // se obtiene al momento de entrar a la charla
    hora_entrada = "",
  }) {
    this.id = id;
    this.correo_enviado_en = correo_enviado_en;
    this.id_usuario_id_charla = id_usuario_id_charla;
    this.creado_actualiado_en = creado_actualiado_en;
    this.estado = estado;
    this.hora_entrada = hora_entrada;
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
      correo_enviado_en: json.correo_enviado_en,
      id_usuario_id_charla: json.id_usuario_id_charla,
      creado_actualiado_en: json.creado_actualiado_en,
      estado: json.estado,
      hora_entrada: json.hora_entrada,
    });
  }

  /** Plain object, to save it in sessionStorage.
   * Creación de un objeto plano, para guardarlo en sessionStorage
   */
  toJSON() {
    return {
      id: this.id,
      correo_enviado_en: this.correo_enviado_en,
      id_usuario_id_charla: this.id_usuario_id_charla,
      creado_actualiado_en: this.creado_actualiado_en,
      estado: this.estado,
      hora_entrada: this.hora_entrada,
    };
  }
}
