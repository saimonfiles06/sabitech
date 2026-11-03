/**
 * ApiError — thrown by api/ when the server answers 4xx / 5xx. Check it with `instanceof ApiError`.
 * No connection at all is different: fetch() throws a TypeError ("Failed to fetch").
 */
export class ApiError extends Error {
  constructor(status, message, body = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}
