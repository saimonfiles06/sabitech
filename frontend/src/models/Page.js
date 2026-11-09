/**
 * Page — a page of results. Every DummyJSON list is { <name>: [...], total, skip, limit }:
 *   Page.fromJSON(json, 'todos', Todo.fromJSON) → a Page whose items are Todo objects.
 */
export class Page {
  constructor({ items }) {
    this.items = items;
  }

  /** listKey: name of the array ("todos", "products"…); mapFn: turns each raw item into a model. */
  static fromJSON(json, listKey, mapFn) {
    const rawItems = Array.isArray(json[listKey]) ? json[listKey] : [];
    return rawItems.map(mapFn);
  }
}
