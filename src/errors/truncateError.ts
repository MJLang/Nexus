export class TruncateError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'TruncateError';
    Error.captureStackTrace(this);
  }
}