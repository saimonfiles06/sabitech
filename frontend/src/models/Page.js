/**
 * Page — a page of results. Every DummyJSON list is { <name>: [...], total, skip, limit }:
 *   Page.fromJSON(json, 'todos', Todo.fromJSON) → a Page whose items are Todo objects.
 */
export class Page {
	constructor({ items, total, skip, limit }) {
		this.items = items;
		this.total = total;
		this.skip = skip;
		this.limit = limit;
	}

	/** true if there are more items after this page. */
	hasNext() {
		return this.skip + this.items.length < this.total;
	}

	/** listKey: name of the array ("todos", "products"…); mapFn: turns each raw item into a model. */
	static fromJSON(json, listKey, mapFn) {
		const rawItems = Array.isArray(json[listKey]) ? json[listKey] : [];
		return new Page({
			items: rawItems.map(mapFn),
			total: json.total ?? rawItems.length,
			skip: json.skip ?? 0,
			limit: json.limit ?? rawItems.length,
		});
	}
}
