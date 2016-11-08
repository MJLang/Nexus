export class CorruptedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'CorruptedError';
    Error.captureStackTrace(this);
  }
}