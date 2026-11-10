export class Page {
  constructor({ elementos, total }) {
    this.elementos = elementos;
    this.total = total;
  }

  static fromJSON(json, funcionCrear) {
    const listaCruda = Array.isArray(json.data) ? json.data : [];
    const elementos = listaCruda.map((elementoCrudo) => funcionCrear(elementoCrudo));
    const total = json.meta?.total ?? elementos.length;
    return new Page({ elementos, total });
  }
}