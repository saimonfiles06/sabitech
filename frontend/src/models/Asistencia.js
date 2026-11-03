export class Asistencia {
  constructor({
    id,
    reserva_id = "",
    hora_entrada = "",
    registrada_en = "",
    registrada_por = "",
  }) {
    this.id = id;
    this.reserva_id = reserva_id;
    this.hora_entrada = hora_entrada;
    this.registrada_en = registrada_en;
    this.registrada_por = registrada_por;
  }

  /** Builds a User from the API JSON (extra fields are ignored). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      reserva_id: json.reserva_id,
      hora_entrada: json.hora_entrada,
      registrada_en: json.registrada_en,
      registrada_por: json.registrada_por,
    });
  }

  /** Plain object, to save it in sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      reserva_id: this.reserva_id,
      hora_entrada: this.hora_entrada,
      registrada_en: this.registrada_en,
      registrada_por: this.registrada_por,
    };
  }
}
