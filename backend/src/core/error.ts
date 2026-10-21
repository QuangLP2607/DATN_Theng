export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "Bad request", details?: unknown) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = "Unauthorized", details?: unknown) {
    return new AppError(message, 401, details);
  }

  static forbidden(message = "Forbidden", details?: unknown) {
    return new AppError(message, 403, details);
  }

  static notFound(message = "Not found", details?: unknown) {
    return new AppError(message, 404, details);
  }

  static conflict(message = "Conflict", details?: unknown) {
    return new AppError(message, 409, details);
  }

  static internal(message = "Internal server error", details?: unknown) {
    return new AppError(message, 500, details);
  }
}
