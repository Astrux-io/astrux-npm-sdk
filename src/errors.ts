export class AstruxError extends Error {
  status?: number;
  payload?: unknown;
  constructor(message: string, opts?: { status?: number; payload?: unknown }) {
    super(message);
    this.name = "AstruxError";
    this.status = opts?.status;
    this.payload = opts?.payload;
  }
}
export class AuthenticationError extends AstruxError {}
export class NotFoundError extends AstruxError {}
export class RateLimitError extends AstruxError {}
export class ValidationError extends AstruxError {}
export class ServerError extends AstruxError {}