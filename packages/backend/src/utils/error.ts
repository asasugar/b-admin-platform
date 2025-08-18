export class BError extends Error {
  constructor(message: string, public code: number = 200) {
    super(message);
  }
}
