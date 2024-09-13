export class AppError extends Error {
  readonly statusCode: number;
  readonly status: "fail" | "error";
  readonly isOperational: boolean;
  readonly name: string;
  readonly path?: string;

  constructor(message: string, statusCode: number, path?: string) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.name = "AppError";
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
