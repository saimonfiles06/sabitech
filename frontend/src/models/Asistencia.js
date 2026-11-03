export class Asistencia {
  constructor({ id, reservaId, horaEntrada, registrada_en, registrada_por }) {
    this.id = id;
    this.reservaId = reservaId;
    this.horaEntrada = horaEntrada;
    this.registrada_en = registrada_en;
    this.registrada_por = registrada_por;
  }

  /** Builds a User from the API JSON (extra fields are ignored). */
  static fromJSON(json) {
    return new Charla({
      id: json.id,
      reservaId: json.reservaId,
      horaEntrada: json.horaEntrada,
      registrada_en: json.registrada_en,
      registrada_por: json.registrada_por,
    });
  }

  /** Plain object, to save it in sessionStorage. */
  toJSON() {
    return {
      id: this.id,
      reservaId: this.reservaId,
      horaEntrada: this.horaEntrada,
      registrada_en: this.registrada_en,
      registrada_por: this.registrada_por,
    };
  }
}
